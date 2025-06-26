// === src/api.js ===
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: false          // we use Bearer token, not cookies
});

export default api;