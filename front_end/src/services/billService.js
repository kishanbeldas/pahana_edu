import api from './api';

export const billService = {
  getAllBills: () => api.get('/bills'),
  getBillById: (id) => api.get(`/bills/${id}`),
  getBillByNumber: (billNumber) => api.get(`/bills/number/${billNumber}`),
  getBillsByCustomer: (customerId) => api.get(`/bills/customer/${customerId}`),
  createBill: (bill) => api.post('/bills', bill),
  updateBill: (id, bill) => api.put(`/bills/${id}`, bill),
  deleteBill: (id) => api.delete(`/bills/${id}`),
  generateBillPDF: (id) => api.get(`/bills/${id}/pdf`, { responseType: 'blob' })
};