import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCustomerForm from './AddCustomerForm';
import EditCustomerForm from './EditCustomerForm';
import { customerService } from '../../services/customerService';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Add new customer
  const handleAddCustomer = async (customer) => {
    try {
      const response = await customerService.addCustomer(customer);
      setCustomers([...customers, response.data]);
      setOpenAddDialog(false);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  // Edit customer
  const handleEditCustomer = async (updatedCustomer) => {
    try {
      await customerService.updateCustomer(updatedCustomer.id, updatedCustomer);
      setCustomers(
        customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
      );
      setEditingCustomer(null);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  // Delete customer
  const handleDeleteCustomer = async (id) => {
    try {
      await customerService.deleteCustomer(id);
      setCustomers(customers.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // Filtered customers based on search
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
          Add New Customer
        </Button>
        <TextField
          label="Search customers"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        {filteredCustomers.length === 0 ? (
          <Typography>No customers found.</Typography>
        ) : (
          filteredCustomers.map((customer) => (
            <Box
              key={customer.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                border: '1px solid #ccc',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Box>
                <Typography>
                  {customer.name} ({customer.accountNumber})
                </Typography>
                <Typography variant="body2">{customer.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setEditingCustomer(customer);
                    setOpenEditDialog(true);
                  }}
                >
                  Edit
                </Button>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteCustomer(customer.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Add Customer Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <AddCustomerForm onSubmit={handleAddCustomer} />
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          {editingCustomer && (
            <EditCustomerForm
              customer={editingCustomer}
              onSubmit={handleEditCustomer}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CustomerList;