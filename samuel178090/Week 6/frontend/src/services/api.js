// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const IS_DEVELOPMENT = import.meta.env.VITE_ENABLE_DEBUG === 'true';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.activeRequests = new Map();
  }

  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('token');
  }

  /**
   * Get user ID from localStorage
   */
  getUserId() {
    return localStorage.getItem('userId');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  }

  /**
   * Create request with timeout
   */
  createRequestWithTimeout(url, config, timeout = REQUEST_TIMEOUT) {
    return Promise.race([
      fetch(url, config),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }

  /**
   * Main request method with retry logic
   */
  async request(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    // Build request configuration
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Create abort controller for this request
    const controller = new AbortController();
    config.signal = controller.signal;

    // Store controller to allow cancellation
    const requestId = `${endpoint}-${Date.now()}`;
    this.activeRequests.set(requestId, controller);

    try {
      const response = await this.createRequestWithTimeout(url, config);
      const data = await response.json();
      
      // Remove from active requests
      this.activeRequests.delete(requestId);
      
      // Handle different response codes
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.logout();
          throw new Error('Session expired. Please login again.');
        }

        // Handle forbidden errors
        if (response.status === 403) {
          throw new Error('You do not have permission to perform this action.');
        }

        // Handle not found errors
        if (response.status === 404) {
          throw new Error(data.message || 'Resource not found.');
        }

        // Handle server errors
        if (response.status >= 500) {
          throw new Error(data.message || 'Server error. Please try again later.');
        }

        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      // Remove from active requests
      this.activeRequests.delete(requestId);

      // Handle network errors with retry
      if (error.name === 'TypeError' && retryCount < MAX_RETRIES) {
        console.log(`Retrying request... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.request(endpoint, options, retryCount + 1);
      }

      // Handle abort errors
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }

      throw error;
    }
  }

  /**
   * Cancel all active requests
   */
  cancelAllRequests() {
    this.activeRequests.forEach(controller => controller.abort());
    this.activeRequests.clear();
  }

  /**
   * Cancel specific request
   */
  cancelRequest(requestId) {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
    }
  }

  // ==================== AUTH ENDPOINTS ====================

  /**
   * Login user
   * @param {Object} credentials - { phone, password }
   */
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store auth data if login successful
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.UID);
      localStorage.setItem('username', response.user.username);
    }
    
    return response;
  }

  /**
   * Register new user - Mock implementation
   * @param {Object} userData - User registration data
   */
  async register(userData) {
    // Mock registration - simulate successful registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Registration successful',
      user: {
        id: `user-${Date.now()}`,
        ...userData
      }
    };
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  /**
   * Change user password
   * @param {Object} data - { currentPassword, newPassword }
   */
  async changePassword(data) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Request password reset
   * @param {string} email - User email
   */
  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Reset password with token
   * @param {Object} data - { token, newPassword }
   */
  async resetPassword(data) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== USER ENDPOINTS ====================

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return this.request('/users/profile');
  }

  /**
   * Get user by phone number (public endpoint)
   * @param {string} phone - Phone number
   */
  async getUserByPhone(phone) {
    return this.request(`/users/phone/${phone}`);
  }

  /**
   * Get user's virtual credit card
   */
  async getUserVCC() {
    return this.request('/users/virtual-credit-card');
  }

  /**
   * Get user's transactions
   */
  async getUserTransactions() {
    return this.request('/users/transactions');
  }

  /**
   * Get user's money spent statistics
   */
  async getMoneySpent() {
    return this.request('/users/money-spent');
  }

  /**
   * Update user profile
   * @param {string} id - User UUID
   * @param {Object} data - User data to update
   */
  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update current user profile
   * @param {Object} data - User data to update
   */
  async updateCurrentUser(data) {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('No user ID found');
    }
    return this.updateUser(userId, data);
  }

  /**
   * Delete user account
   * @param {string} id - User UUID
   */
  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get user's transaction history
   * @param {string} id - User UUID
   * @param {number} page - Page number
   * @param {number} size - Items per page
   */
  async getUserTransactions(id, page = 0, size = 20) {
    return this.request(`/users/${id}/transactions?page=${page}&size=${size}`);
  }

  /**
   * Get current user's transaction history
   */
  async getCurrentUserTransactions(page = 0, size = 20) {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('No user ID found');
    }
    return this.getUserTransactions(userId, page, size);
  }

  /**
   * Search users
   * @param {string} query - Search query
   */
  async searchUsers(query) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  // ==================== TRANSACTION ENDPOINTS ====================

  /**
   * Send money by phone number
   * @param {Object} transactionData - { recipientPhone, amount }
   */
  async sendMoneyByPhone(transactionData) {
    return this.request('/transactions/send-money/phone', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  /**
   * Send money by username
   * @param {Object} transactionData - { recipientUsername, amount }
   */
  async sendMoneyByUsername(transactionData) {
    return this.request('/transactions/send-money/username', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  /**
   * Request money by phone number
   * @param {Object} requestData - { recipientPhone, amount, message }
   */
  async requestMoneyByPhone(requestData) {
    return this.request('/transactions/request-money/phone', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  /**
   * Get transaction by ID
   * @param {string} id - Transaction UUID
   */
  async getTransactionById(id) {
    return this.request(`/transactions/${id}`);
  }

  /**
   * Get all transactions (admin)
   * @param {number} page - Page number
   * @param {number} size - Items per page
   */
  async getAllTransactions(page = 0, size = 20) {
    return this.request(`/transactions?page=${page}&size=${size}`);
  }

  /**
   * Cancel pending transaction
   * @param {string} id - Transaction UUID
   */
  async cancelTransaction(id) {
    return this.request(`/transactions/${id}/cancel`, {
      method: 'POST',
    });
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats() {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('No user ID found');
    }
    return this.request(`/transactions/stats/${userId}`);
  }

  // ==================== FUNDS ENDPOINTS ====================

  /**
   * Get Fawry service code for cash funding
   */
  async getFawryServiceCode() {
    return this.request('/funds/cash/service-code');
  }

  /**
   * Add funds via cash (Fawry)
   * @param {Object} data - { amount, serviceCode }
   */
  async addFundsCash(data) {
    return this.request('/funds/cash/add-funds', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Add funds via credit card
   * @param {Object} data - { amount, paymentMethodId }
   */
  async addFundsCredit(data) {
    return this.request('/funds/credit/add-funds', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== PAYMENT ENDPOINTS ====================

  /**
   * Create Stripe payment intent
   * @param {Object} data - { amount, currency }
   */
  async createPaymentIntent(data) {
    return this.request('/payments/credit-card/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get transaction status
   * @param {string} transactionId - Transaction ID
   */
  async getTransactionStatus(transactionId) {
    return this.request(`/payments/transactions/${transactionId}`);
  }

  // ==================== VCC ENDPOINTS ====================

  /**
   * Generate virtual credit card
   * @param {Object} data - { visa_type, amount }
   */
  async generateVCC(data) {
    return this.request('/vcc/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Use virtual credit card
   * @param {Object} data - { creditCardNumber, cvc, amount }
   */
  async useVCC(data) {
    return this.request('/vcc/use', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get VCC limits and settings
   */
  async getVCCLimits() {
    return this.request('/vcc/limits');
  }

  // ==================== SUBACCOUNT ENDPOINTS ====================

  /**
   * Create subaccount
   * @param {Object} data - Subaccount data
   */
  async createSubaccount(data) {
    return this.request('/subaccounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get subaccount by ID
   * @param {string} id - Subaccount ID
   */
  async getSubaccount(id) {
    return this.request(`/subaccounts/${id}`);
  }

  /**
   * Update subaccount
   * @param {string} id - Subaccount ID
   * @param {Object} data - Update data
   */
  async updateSubaccount(id, data) {
    return this.request(`/subaccounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete subaccount
   * @param {string} id - Subaccount ID
   */
  async deleteSubaccount(id) {
    return this.request(`/subaccounts/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== DASHBOARD ENDPOINTS ====================

  /**
   * Get dashboard data
   */
  async getDashboardData() {
    return this.request('/dashboard/data');
  }

  // ==================== HTTP METHODS ====================

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  /**
   * POST request
   */
  async post(endpoint, data = null, options = {}) {
    const config = {
      method: 'POST',
      ...options
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    return this.request(endpoint, config);
  }

  /**
   * PUT request
   */
  async put(endpoint, data = null, options = {}) {
    const config = {
      method: 'PUT',
      ...options
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    return this.request(endpoint, config);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Health check
   */
  async healthCheck() {
    return this.request('/health');
  }

  /**
   * Get API version
   */
  async getVersion() {
    return this.request('/version');
  }

  /**
   * Upload file
   * @param {File} file - File to upload
   * @param {string} endpoint - Upload endpoint
   */
  async uploadFile(file, endpoint = '/upload') {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getAuthToken();
    const config = {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const apiService = new ApiService();

// Add cleanup on window unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    apiService.cancelAllRequests();
  });
}

export default apiService;