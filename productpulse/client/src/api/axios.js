import axios from 'axios';

// Single axios instance for the whole app. Base URL points at our own Express
// backend — the client never talks to any third-party API directly.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

export const TOKEN_KEY = 'pp_token';

// Attach the JWT (if we have one) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize every error into a plain Error carrying the backend's message,
// status code, and field-level errors, so callers can rely on a single shape.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;
    const message =
      (res && res.data && res.data.message) ||
      error.message ||
      'Network error — is the server running?';

    const normalized = new Error(message);
    normalized.status = res ? res.status : 0;
    normalized.errors = (res && res.data && res.data.errors) || [];
    return Promise.reject(normalized);
  }
);

export default api;
