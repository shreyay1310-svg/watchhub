import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
// On HTTPS origins (like Vercel), prevent mixed-content blocks against insecure local URLs
const isHttpsOrigin = typeof window !== 'undefined' && window.location.protocol === 'https:';
const sanitizedApiUrl =
  isHttpsOrigin && rawApiUrl && rawApiUrl.startsWith('http://localhost')
    ? '/api'
    : (rawApiUrl || '/api');

const resolvedBaseUrl = sanitizedApiUrl
  ? (sanitizedApiUrl.endsWith('/api') ? sanitizedApiUrl : `${sanitizedApiUrl.replace(/\/+$/, '')}/api`)
  : '/api';

const api = axios.create({
  baseURL: resolvedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to attach JWT access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('watchhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh / auth handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // In production: trigger refresh token rotation or clear auth
      console.warn('[API Auth] Session expired or unauthorized.');
    }
    return Promise.reject(error);
  }
);

export default api;

