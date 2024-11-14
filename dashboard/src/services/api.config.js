// src/config/api.config.js
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
  },
  production: {
    baseURL: 'itsag3t1-crm-backend.itsag3t1-crm.svc.cluster.local:8080/api',
    timeout: 5000,
  },
};

export const getApiConfig = () => {
  const environment = import.meta.env.VITE_ENV || 'development';
  console.log("Environment: ", environment);
  return API_CONFIG[environment];
};