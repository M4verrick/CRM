// src/config/api.config.js
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
  },
  production: {
    baseURL: 'https://itsag3t1-crm-backend.itsag3t1-crm.svc.cluster.local',
    timeout: 5000,
  },
};

export const getApiConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  return API_CONFIG[environment];
};