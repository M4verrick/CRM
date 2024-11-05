// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import { apiClient } from '../services/api.client';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // log 
  const logRequest = (method, endpoint, data, headers) => {
    console.group('API Request');
    console.log('Method:', method);
    console.log('Endpoint:', endpoint);
    console.log('Headers:', headers);
    if (data) {
      console.log('Request Data:', data);
    }
    console.groupEnd();
  };

  const logResponse = (response) => {
    console.group('API Response');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);
    console.groupEnd();
  };

  const logError = (error) => {
    console.group('API Error');
    console.log('Status:', error.response?.status);
    console.log('Headers:', error.response?.headers);
    console.log('Error Data:', error.response?.data);
    console.log('Error Message:', error.message);
    console.groupEnd();
  };

  const request = useCallback(async (method, endpoint, data = null) => {
    try {
      setLoading(true);
      setError(null);

      // Log request details before sending
      logRequest(method, endpoint, data, apiClient.defaults.headers);

      const response = await apiClient({
        method,
        url: endpoint,
        data,
      });

      // Log successful response
      logResponse(response);

      return response;
    } catch (err) {
      // Log error details
      logError(err);
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((endpoint) => request('get', endpoint), [request]);
  const post = useCallback((endpoint, data) => request('post', endpoint, data), [request]);
  const put = useCallback((endpoint, data) => request('put', endpoint, data), [request]);
  const del = useCallback((endpoint) => request('delete', endpoint), [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  };
};