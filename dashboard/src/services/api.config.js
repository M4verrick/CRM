// src/config/api.config.js
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8080',
    timeout: 5000,
  },
  production: {
    baseURL: 'https://itsag3t1-crm-backend.itsag3t1-crm.svc.cluster.local',
    timeout: 5000,
  },
  feature4: {
    baseURL: 'http://18.140.139.117:3000',
    timeout: 5000,
  },
};

export const getApiConfig = () => {
  const environment = import.meta.env.VITE_ENV || 'development';
  console.log("Environment: ", environment);
  // return API_CONFIG["feature4"];
  return API_CONFIG[environment];

};