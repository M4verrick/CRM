import { apiClient } from './api.client';

export const api = {
  // Profile Management
  getProfileAccounts: () => {
    return apiClient.get('/api/clients/accountsById');
  },

  // Get all client accounts associated with an agent
  getClientAccounts: () => {
    return apiClient.get('/api/clients');
  },

  // Get a client by ID
  getClientAccount: (clientId) => {
    return apiClient.get(`/api/clients/${clientId}`);
  },

  // Create Client
  createClientAccount: (accountData) => {
    return apiClient.post('/api/clients/createProfileAgent', accountData);
  },

  updateClient: (clientId, data) => {
    return apiClient.put(`/api/clients/${clientId}`, data);
  },

  deleteClient: (clientId) => {
    return apiClient.delete(`/api/clients/${clientId}`);
  }

};

export default api;
