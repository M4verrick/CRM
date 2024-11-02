// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import { apiClient } from '../services/api.client';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, endpoint, data = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient({
        method,
        url: endpoint,
        data,
      });
      return response;
    } catch (err) {
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