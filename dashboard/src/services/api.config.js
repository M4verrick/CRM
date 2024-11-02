// src/config/api.config.js
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
  },
  production: {
    baseURL: 'https://game.itsag3t1.com',
    timeout: 5000,
  },
};

export const getApiConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  return API_CONFIG[environment];
};