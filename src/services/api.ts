import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // Servidor de NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el Token de Google OAuth / JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});