import axios from 'axios';

const api = axios.create({
  baseURL: 'https://payment-gateway-backend-juri.onrender.com/api',
  //baseURL: 'http://localhost:5001/api',
  withCredentials: false // we use Bearer token, not cookies
});

export default api;