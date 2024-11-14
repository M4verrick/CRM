import { apiClient } from './api.client';

export const api = {
  // Profile Management
  getAccounts: () => {
    return apiClient.get('/api/clients/accountsById');
  },

  // Get all clients
  getClients: () => {
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
  },

  // api/clients/verify -> verify email of client
  verifyClient: () => {
    return apiClient.get(`/api/clients/verify`);
  },

  getTransactions: () => {
    return apiClient.get(`/db/transactions`);
  },

  retrieveUpdatedTransaction: () => {
    return apiClient.get(`/sftp/download-file`);
  },

  getTransactionsByClient: (clientId) => {
    return apiClient.get(`/db/transactions/client/${clientId}`);
  },


};

export default api;
