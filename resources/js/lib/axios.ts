import axios from 'axios';

// Set base URL untuk API - HANYA untuk API calls
// Web routes tidak gunakan axios, gunakan fetch langsung
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
// Kirim cookies agar session auth terbaca di API
axios.defaults.withCredentials = true;

// Clean up old localStorage token jika ada
localStorage.removeItem('auth_token');

// Interceptor untuk handle 401 Unauthorized
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect ke login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
