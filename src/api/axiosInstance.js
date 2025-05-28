import axios from 'axios';

// ✅ Use relative path so React proxy handles the full backend URL
const instance = axios.create({
  baseURL: '/api', // Proxy will send this to https://localhost:7121/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Automatically attach token from localStorage (if exists)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
