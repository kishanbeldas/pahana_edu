// src/services/__tests__/customerService.test.js
import { customerService } from '../customerService';
import api from '../api';

jest.mock('../api');
const mockedApi = api;

describe('CustomerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCustomers', () => {
    test('should fetch all customers successfully', async () => {
      const mockCustomers = [
        { id: 1, name: 'John Doe', accountNumber: 'ACC001' },
        { id: 2, name: 'Jane Smith', accountNumber: 'ACC002' }
      ];
      
      mockedApi.get.mockResolvedValue({ data: mockCustomers });

      const result = await customerService.getAllCustomers();

      expect(mockedApi.get).toHaveBeenCalledWith('/customers');
      expect(result.data).toEqual(mockCustomers);
    });

    test('should handle API errors', async () => {
      mockedApi.get.mockRejectedValue(new Error('Network error'));

      await expect(customerService.getAllCustomers()).rejects.toThrow('Network error');
    });
  });

  describe('createCustomer', () => {
    test('should create customer successfully', async () => {
      const newCustomer = {
        name: 'New Customer',
        address: '123 Street',
        telephone: '+94771234567'
      };
      
      const createdCustomer = { id: 1, ...newCustomer, accountNumber: 'ACC001' };
      mockedApi.post.mockResolvedValue({ data: createdCustomer });

      const result = await customerService.createCustomer(newCustomer);

      expect(mockedApi.post).toHaveBeenCalledWith('/customers', newCustomer);
      expect(result.data).toEqual(createdCustomer);
    });
  });
});