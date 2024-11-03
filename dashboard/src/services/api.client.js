import axios from 'axios';
import { getApiConfig } from './api.config';
import { getAuthTokens, isTokenExpired } from './auth.service';

const createApiClient = () => {
  const config = getApiConfig();
  
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      const tokens = getAuthTokens();
      
      if (tokens?.AuthenticationResult) {
        const { AccessToken, IdToken } = tokens.AuthenticationResult;
        
        // Check if access token is expired
        if (isTokenExpired(AccessToken)) {
          // Here you would typically:
          // 1. Use the RefreshToken to get new tokens
          // 2. Update stored tokens
          // 3. Redirect to login if refresh fails
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired'));
        }

        // Add the access token to the request
        config.headers.Authorization = `Bearer ${AccessToken}`;
        console.log(config.headers.Authorization)
        
        // Optionally add ID token if needed for specific endpoints
        // config.headers['X-Id-Token'] = IdToken;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        // Clear stored tokens
        localStorage.removeItem('auth_tokens');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createApiClient();

export const storeAuthTokens = (authResult) => {
  localStorage.setItem('auth_tokens', JSON.stringify(authResult));
};