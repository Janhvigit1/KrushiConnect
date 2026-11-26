import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Intercept requests and attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('krushi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses and handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not on login page, remove token
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('krushi_token');
        localStorage.removeItem('krushi_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
