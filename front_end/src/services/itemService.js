import api from './api';

export const itemService = {
  getAllItems: () => api.get('/items'),
  getItemById: (id) => api.get(`/items/${id}`),
  getItemByCode: (itemCode) => api.get(`/items/code/${itemCode}`),
  getItemsByCategory: (category) => api.get(`/items/category/${category}`),
  createItem: (item) => api.post('/items', item),
  updateItem: (id, item) => api.put(`/items/${id}`, item),
  deleteItem: (id) => api.delete(`/items/${id}`),
  searchItems: (searchTerm) => api.get(`/items/search?term=${searchTerm}`)
};