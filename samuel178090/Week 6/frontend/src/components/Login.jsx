import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiService from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('user');
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (loginType === 'admin') {
        // Mock admin login
        if (formData.phone === 'admin@flowserve.com' && formData.password === 'admin123') {
          localStorage.setItem('adminToken', 'admin-token-mock');
          localStorage.setItem('adminUser', JSON.stringify({
            id: 'admin-1',
            email: 'admin@flowserve.com',
            role: 'ADMIN',
            name: 'System Administrator'
          }));
          navigate('/admin/dashboard');
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        // Mock user login - check both email and phone formats
        const users = [
          { email: 'john.doe@example.com', phone: '01234567890', password: 'password123', id: 'user-1', name: 'John Doe', UID: 'user-1' },
          { email: 'jane.smith@example.com', phone: '01234567891', password: 'password123', id: 'user-2', name: 'Jane Smith', UID: 'user-2' },
          { email: 'bob.johnson@example.com', phone: '01234567892', password: 'password123', id: 'user-3', name: 'Bob Johnson', UID: 'user-3' }
        ];
        
        const user = users.find(u => (u.email === formData.phone || u.phone === formData.phone) && u.password === formData.password);
        
        if (user) {
          localStorage.setItem('token', `user-token-${user.id}`);
          localStorage.setItem('userId', user.UID);
          localStorage.setItem('username', user.name);
          navigate('/transactions');
        } else {
          setError('Invalid user credentials');
        }
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 ${
      loginType === 'admin' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        {/* Login Type Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setLoginType('user')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                loginType === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              User Login
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                loginType === 'admin'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              Admin Login
            </button>
          </div>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          {loginType === 'admin' && (
            <div className="mx-auto h-12 w-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )}
          <h2 className="text-3xl font-bold text-gray-800">
            {loginType === 'admin' ? 'Admin Access' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 mt-2">
            {loginType === 'admin' ? 'Authorized personnel only' : 'Sign in to your FlowServe account'}
          </p>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-red-700 text-xl">&times;</span>
            </button>
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email/Phone Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {loginType === 'admin' ? 'Admin Email' : 'Phone Number'}
            </label>
            <input
              type={loginType === 'admin' ? 'email' : 'tel'}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={loginType === 'admin' ? 'admin@flowserve.com' : '01234567890'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {loginType === 'admin' ? 'Enter admin email address' : 'Enter your 11-digit phone number'}
            </p>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  // Eye slash icon (hide password)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  // Eye icon (show password)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="mb-6 text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 font-semibold shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to ABCDPay?</span>
            </div>
          </div>
        </div>

        {/* Register Link - Only for users */}
        {loginType === 'user' && (
          <div className="text-center">
            <Link 
              to="/register"
              className="text-blue-500 hover:text-blue-600 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </div>
        )}
        
        {/* Admin credentials hint */}
        {loginType === 'admin' && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Admin: admin@flowserve.com / admin123
            </p>
          </div>
        )}

        {/* Additional Links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-700 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;