import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { ArrowBack, Edit, Receipt } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { billService } from '../../services/billService';

const CustomerDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [customerBills, setCustomerBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      const [customerResponse, billsResponse] = await Promise.all([
        customerService.getAllCustomers,
        customerService.getCustomerById(id),
        billService.getBillsByCustomer(id)
      ]);
      
      setCustomer(customerResponse.data);
      setCustomerBills(billsResponse.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };



  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'OVERDUE': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">Customer not found</Typography>
      </Box>
    );
  }

  const totalBillAmount = customerBills.reduce((sum, bill) => sum + parseFloat(bill.totalAmount), 0);
  const pendingBills = customerBills.filter(bill => bill.status === 'PENDING').length;
  const overdueBills = customerBills.filter(bill => bill.status === 'OVERDUE').length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/customers')}
          >
            Back to Customers
          </Button>
          <Typography variant="h4" component="h1">
            Customer Details
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/customers/edit/${customer.id}`)}
          >
            Edit Customer
          </Button>
          <Button
            variant="contained"
            startIcon={<Receipt />}
            onClick={() => navigate('/bills/new', { state: { customerId: customer.id } })}
          >
            Create Bill
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Customer Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Account Number:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {customer.accountNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Name:
                  </Typography>
                  <Typography variant="h6">
                    {customer.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Address:
                  </Typography>
                  <Typography variant="body1">
                    {customer.address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Telephone:
                  </Typography>
                  <Typography variant="body1">
                    {customer.telephone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Email:
                  </Typography>
                  <Typography variant="body1">
                    {customer.email || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Units Consumed:
                  </Typography>
                  <Typography variant="body1">
                    {customer.unitsConsumed}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Account Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Bills:
                  </Typography>
                  <Typography variant="h6">
                    {customerBills.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(totalBillAmount)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Pending Bills:
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {pendingBills}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Overdue Bills:
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {overdueBills}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Bills */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Customer Bills
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Bill Number</TableCell>
                      <TableCell>Bill Date</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customerBills.length > 0 ? (
                      customerBills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell>{bill.billNumber}</TableCell>
                          <TableCell>{formatDate(bill.billDate)}</TableCell>
                          <TableCell>{formatDate(bill.dueDate)}</TableCell>
                          <TableCell align="right">{formatCurrency(bill.totalAmount)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={bill.status} 
                              color={getStatusColor(bill.status)} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/bills/view/${bill.id}`)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No bills found for this customer
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDetail;