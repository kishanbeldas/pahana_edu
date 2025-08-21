// components/bills/BillForm.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Autocomplete,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { customerService } from '../../services/customerService';
import { itemService } from '../../services/itemService';

const BillForm = ({ open, onClose, onSubmit, initialData }) => {
  const [bill, setBill] = useState({
    billNumber: '',
    customerId: null,
    billDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    billItems: []
  });
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Generate a unique bill number
  const generateBillNumber = () => {
    try {
      const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const randomPart = Math.floor(Math.random() * 9000 + 1000); // 4 digits
      return `bill-${datePart}-${randomPart}`;
    } catch (error) {
      console.error('Error generating bill number:', error);
      return `bill-${Date.now()}`;
    }
  };

  // Fetch customers & items
  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
      console.log('Fetched customers:', response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showNotification('Error fetching customers', 'error');
    }
  };

  const fetchItems = async () => {
    try {
      const response = await itemService.getAllItems();
      setItems(response.data);
      console.log('Fetched items:', response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      showNotification('Error fetching items', 'error');
    }
  };

  // Prefill for edit mode or set defaults
  useEffect(() => {
    if (initialData) {
      setBill({
        billNumber: initialData.billNumber || generateBillNumber(),
        customerId: initialData.customer?.id || null,
        billDate: initialData.billDate || new Date().toISOString().split('T')[0],
        dueDate: initialData.dueDate || '',
        billItems: initialData.billItems || []
      });
      setSelectedCustomer(initialData.customer || null);
    } else {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      setBill({
        billNumber: generateBillNumber(),
        customerId: null,
        billDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        billItems: []
      });
      setSelectedCustomer(null);
    }
  }, [initialData]);

  const addBillItem = () => {
    setBill(prev => ({
      ...prev,
      billItems: [
        ...prev.billItems,
        { 
          itemId: null, 
          quantity: 1, 
          unitPrice: 0, 
          totalPrice: 0, 
          item: null 
        }
      ]
    }));
    console.log('Added new bill item');
  };

  const removeBillItem = (index) => {
    setBill(prev => ({
      ...prev,
      billItems: prev.billItems.filter((_, i) => i !== index)
    }));
    console.log(`Removed bill item at index ${index}`);
  };

  const updateBillItem = (index, field, value) => {
    setBill(prev => {
      const newBillItems = [...prev.billItems];
      const item = newBillItems[index];

      if (field === 'item') {
        item.itemId = value ? value.id : null;
        item.item = value;
        item.unitPrice = value ? value.unitPrice : 0;
        console.log(`Updated item ${index}: itemId=${item.itemId}, item name=${value?.name}, full item:`, value);
      } else {
        item[field] = value;
      }

      // Recalculate total price
      if (item.quantity && item.unitPrice) {
        item.totalPrice = item.quantity * item.unitPrice;
      }
      
      console.log(`Final item ${index}:`, item);
      return { ...prev, billItems: newBillItems };
    });
  };

  const calculateTotals = () => {
    const subtotal = bill.billItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * 0.1;
    const totalAmount = subtotal + taxAmount;
    return { subtotal, taxAmount, totalAmount };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      showNotification('Please select a customer', 'error');
      return;
    }
    
    if (bill.billItems.length === 0) {
      showNotification('Please add at least one item', 'error');
      return;
    }
    
    // Debug: Check bill items before processing
    console.log('Bill items before processing:', bill.billItems);
    
    // Validate that all items have itemId
    for (let i = 0; i < bill.billItems.length; i++) {
      const item = bill.billItems[i];
      if (!item.itemId) {
        showNotification(`Please select an item for row ${i + 1}`, 'error');
        return;
      }
    }
    
    const billData = {
      ...bill,
      customerId: selectedCustomer.id,
      billItems: bill.billItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }))
    };
    
    console.log('Sending bill data:', JSON.stringify(billData, null, 2));
    onSubmit(billData);
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{initialData ? 'Edit Bill' : 'Create New Bill'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Bill Info */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Bill Information</Typography>
                    <TextField
                      fullWidth
                      label="Bill Number"
                      value={bill.billNumber}
                      InputProps={{ readOnly: true }}
                      sx={{ mt: 2, mb: 2 }}
                    />
                    <Autocomplete
                      options={customers}
                      getOptionLabel={(option) => `${option.accountNumber} - ${option.name}`}
                      value={selectedCustomer}
                      onChange={(_, newValue) => {
                        setSelectedCustomer(newValue);
                        console.log('Selected customer:', newValue);
                      }}
                      renderInput={(params) => <TextField {...params} label="Customer" required />}
                    />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Bill Date"
                          type="date"
                          value={bill.billDate}
                          onChange={(e) => setBill(prev => ({ ...prev, billDate: e.target.value }))}
                          InputLabelProps={{ shrink: true }}
                          required
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Due Date"
                          type="date"
                          value={bill.dueDate}
                          onChange={(e) => setBill(prev => ({ ...prev, dueDate: e.target.value }))}
                          InputLabelProps={{ shrink: true }}
                          required
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Bill Summary */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Bill Summary</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography>Subtotal: Rs. {totals.subtotal.toFixed(2)}</Typography>
                      <Typography>Tax (10%): Rs. {totals.taxAmount.toFixed(2)}</Typography>
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                        Total: Rs. {totals.totalAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Bill Items */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">Bill Items</Typography>
                      <Button variant="outlined" startIcon={<Add />} onClick={addBillItem}>
                        Add Item
                      </Button>
                    </Box>
                    {bill.billItems.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No items added. Click "Add Item" to get started.
                      </Typography>
                    ) : (
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Item</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell>Unit Price</TableCell>
                              <TableCell>Total</TableCell>
                              <TableCell align="center">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {bill.billItems.map((billItem, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Autocomplete
                                    options={items}
                                    getOptionLabel={(option) => `${option.itemCode} - ${option.name}`}
                                    value={billItem.item}
                                    onChange={(_, newValue) => {
                                      console.log(`Selecting item for row ${index}:`, newValue);
                                      updateBillItem(index, 'item', newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField 
                                        {...params} 
                                        size="small" 
                                        placeholder="Select an item"
                                        error={!billItem.itemId}
                                        helperText={!billItem.itemId ? "Please select an item" : ""}
                                      />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={billItem.quantity}
                                    onChange={(e) => updateBillItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                    inputProps={{ min: 0.1, step: 0.1 }}
                                    sx={{ width: 100 }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={billItem.unitPrice}
                                    onChange={(e) => updateBillItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                    inputProps={{ min: 0, step: 0.01 }}
                                    sx={{ width: 120 }}
                                  />
                                </TableCell>
                                <TableCell>Rs. {billItem.totalPrice.toFixed(2)}</TableCell>
                                <TableCell align="center">
                                  <IconButton 
                                    color="error" 
                                    onClick={() => removeBillItem(index)}
                                    size="small"
                                  >
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {initialData ? 'Update Bill' : 'Create Bill'}
              </Button>
            </DialogActions>
          </form>
        </Box>
      </DialogContent>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default BillForm;