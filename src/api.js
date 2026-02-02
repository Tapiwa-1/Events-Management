import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust if needed
  withCredentials: true, // Important for cookies
});

// Response interceptor to handle 401s (token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401, redirect to login (unless already there)
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
