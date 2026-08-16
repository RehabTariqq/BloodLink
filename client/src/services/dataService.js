import api from './api';

export const donorService = {
  create: (data) => api.post('/donors', data),
  getAll: (params) => api.get('/donors', { params }),
  getById: (id) => api.get(`/donors/${id}`)
};

export const donationService = {
  create: (data) => api.post('/donations', data),
  getAll: (params) => api.get('/donations', { params }),
  update: (id, data) => api.put(`/donations/${id}`, data)
};

export const inventoryService = {
  create: (data) => api.post('/inventory', data),
  getAll: (params) => api.get('/inventory', { params }),
  getSummary: () => api.get('/inventory/summary'),
  update: (id, data) => api.put(`/inventory/${id}`, data)
};

export const requestService = {
  create: (data) => api.post('/requests', data),
  getAll: (params) => api.get('/requests', { params }),
  updateStatus: (id, data) => api.put(`/requests/${id}`, data),
  issueUnit: (id, unitId) => api.post(`/requests/${id}/issue`, { unitId })
};

export const hospitalService = {
  create: (data) => api.post('/hospitals', data),
  getById: (id) => api.get(`/hospitals/${id}`)
};

export const reportService = {
  getDashboardStats: () => api.get('/reports/dashboard')
};