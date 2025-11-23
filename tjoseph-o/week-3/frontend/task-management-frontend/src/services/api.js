



// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// class ApiService {
//   constructor() {
//     this.baseURL = API_URL;
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;
    
//     const config = {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//     };

//     try {
//       const response = await fetch(url, config);
      
//       // Try to parse JSON
//       let data;
//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         data = await response.json();
//       } else {
//         // Handle non-JSON responses (like rate limit text)
//         const text = await response.text();
//         data = { success: false, message: text };
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Request failed');
//       }

//       return data;
//     } catch (error) {
//       throw error;
//     }
//   }

//   // Auth endpoints
//   async register(email, password) {
//     return this.request('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     });
//   }

//   async login(email, password) {
//     return this.request('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     });
//   }

//   async logout(refreshToken) {
//     return this.request('/auth/logout', {
//       method: 'POST',
//       body: JSON.stringify({ refreshToken }),
//     });
//   }

//   async refreshToken(refreshToken) {
//     return this.request('/auth/refresh', {
//       method: 'POST',
//       body: JSON.stringify({ refreshToken }),
//     });
//   }

//   async getTasks(accessToken) {
//     return this.request('/tasks', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     });
//   }

//   async createTask(accessToken, taskData) {
//     return this.request('/tasks', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(taskData),
//     });
//   }

//   async deleteTask(accessToken, taskId) {
//     return this.request(`/tasks/${taskId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     });
//   }

//   async searchTasks(accessToken, searchParams) {
//     return this.request('/tasks/search', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(searchParams),
//     });
//   }

//   async filterTasks(accessToken, filterParams) {
//     return this.request('/tasks/filter', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(filterParams),
//     });
//   }
// }

// export default new ApiService();



const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async register(email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(refreshToken) {
    return this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async refreshToken(refreshToken) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Task endpoints
  async getTasks(accessToken) {
    return this.request('/tasks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async createTask(accessToken, taskData) {
    return this.request('/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(accessToken, taskId, taskData) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(accessToken, taskId) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async searchTasks(accessToken, searchParams) {
    return this.request('/tasks/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(searchParams),
    });
  }

  async filterTasks(accessToken, filterParams) {
    return this.request('/tasks/filter', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(filterParams),
    });
  }
}

export default new ApiService();