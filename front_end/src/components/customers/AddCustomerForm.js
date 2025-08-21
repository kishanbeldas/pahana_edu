// components/customers/AddCustomerForm.js
import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Grid, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../services/customerService';

const AddCustomerForm = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    accountNumber: '',
    name: '',
    address: '',
    telephone: '',
    email: '',
    unitsConsumed: 0
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: name === 'unitsConsumed' ? Number(value) : value }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customer.accountNumber.trim()) newErrors.accountNumber = 'Account Number is required';
    if (!customer.name.trim()) newErrors.name = 'Name is required';
    if (!customer.address.trim()) newErrors.address = 'Address is required';
    if (!customer.telephone.trim()) newErrors.telephone = 'Telephone is required';
    if (customer.email && !/\S+@\S+\.\S+/.test(customer.email)) newErrors.email = 'Invalid email format';
    if (customer.unitsConsumed < 0) newErrors.unitsConsumed = 'Units consumed cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await customerService.createCustomer(customer);
      setNotification({ open: true, message: 'Customer created successfully', severity: 'success' });
      setTimeout(() => navigate('/customers'), 1500);
    } catch (error) {
      setNotification({ open: true, message: 'Error creating customer', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Add New Customer</Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Fields */}
              {['accountNumber', 'name', 'address', 'telephone', 'email', 'unitsConsumed'].map((field, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <TextField
                    fullWidth
                    label={field === 'unitsConsumed' ? 'Units Consumed' : field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    type={field === 'email' ? 'email' : field === 'unitsConsumed' ? 'number' : 'text'}
                    value={customer[field]}
                    onChange={handleChange}
                    error={!!errors[field]}
                    helperText={errors[field]}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={() => navigate('/customers')}>Cancel</Button>
                  <Button type="submit" variant="contained" color="primary" disabled={loading}>Create Customer</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCustomerForm;