// components/customers/CustomerForm.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { customerService } from '../../services/customerService';

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const initialCustomer = {
    accountNumber: '',
    name: '',
    address: '',
    telephone: '',
    email: '',
    unitsConsumed: 0
  };

  const [customer, setCustomer] = useState(initialCustomer);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchCustomer();
    } else {
      // reset form for "Add New Customer"
      setCustomer(initialCustomer);
    }
  }, [id, isEdit]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await customerService.getCustomerById(id);
      setCustomer(response.data || initialCustomer);
    } catch (error) {
      showNotification('Error fetching customer', 'error');
      setCustomer(initialCustomer);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: name === 'unitsConsumed' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
      if (isEdit) {
        await customerService.updateCustomer(id, customer);
        showNotification('Customer updated successfully', 'success');
      } else {
        await customerService.createCustomer(customer);
        showNotification('Customer created successfully', 'success');
        setCustomer(initialCustomer); // reset form after adding
      }
      setTimeout(() => navigate('/customers'), 1500);
    } catch (error) {
      showNotification('Error saving customer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit Customer' : 'Add New Customer'}
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  name="accountNumber"
                  value={customer.accountNumber}
                  onChange={handleChange}
                  required
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  required
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telephone"
                  name="telephone"
                  value={customer.telephone}
                  onChange={handleChange}
                  required
                  error={!!errors.telephone}
                  helperText={errors.telephone}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={customer.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Units Consumed"
                  name="unitsConsumed"
                  type="number"
                  value={customer.unitsConsumed}
                  onChange={handleChange}
                  error={!!errors.unitsConsumed}
                  helperText={errors.unitsConsumed}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={() => navigate('/customers')}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {isEdit ? 'Update' : 'Create'} Customer
                  </Button>
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
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerForm;