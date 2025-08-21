import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Box, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar, Alert, Chip
} from '@mui/material';
import { Add, Edit, Delete, Visibility, GetApp, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { billService } from '../../services/billService';
import BillForm from './BillForm';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formBill, setFormBill] = useState(null); // for edit mode
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    const filtered = bills.filter(bill =>
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.customer && bill.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      bill.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBills(filtered);
  }, [bills, searchTerm]);

  const fetchBills = async () => {
    try {
      const response = await billService.getAllBills();
      setBills(response.data);
    } catch (error) {
      showNotification('Error fetching bills', 'error');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formBill) {
        // update mode
        await billService.updateBill(formBill.id, formData);
        showNotification('Bill updated successfully', 'success');
      } else {
        // create mode
        await billService.createBill(formData);
        showNotification('Bill created successfully', 'success');
      }
      fetchBills();
      setFormOpen(false);
      setFormBill(null);
    } catch (error) {
      showNotification('Error saving bill', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await billService.deleteBill(selectedBill.id);
      fetchBills();
      setDeleteDialog(false);
      showNotification('Bill deleted successfully', 'success');
    } catch (error) {
      showNotification('Error deleting bill', 'error');
    }
  };

  const handleDownloadPDF = async (billId) => {
    try {
      const response = await billService.generateBillPDF(billId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill-${billId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showNotification('Error downloading PDF', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'OVERDUE': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatCurrency = (amount) => `Rs. ${parseFloat(amount).toFixed(2)}`;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Bill Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setFormBill(null);  // new bill
            setFormOpen(true);
          }}
        >
          Create Bill
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search bills by number, customer, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bill Number</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Bill Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.billNumber}</TableCell>
                <TableCell>{bill.customer?.name || 'Unknown'}</TableCell>
                <TableCell>{formatDate(bill.billDate)}</TableCell>
                <TableCell>{formatDate(bill.dueDate)}</TableCell>
                <TableCell>{formatCurrency(bill.totalAmount)}</TableCell>
                <TableCell>
                  <Chip label={bill.status} color={getStatusColor(bill.status)} size="small" />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="info"
                    onClick={() => navigate(`/bills/view/${bill.id}`)}
                    title="View Bill"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setFormBill(bill); // pass bill to edit
                      setFormOpen(true);
                    }}
                    title="Edit Bill"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDownloadPDF(bill.id)}
                    title="Download PDF"
                  >
                    <GetApp />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedBill(bill);
                      setDeleteDialog(true);
                    }}
                    title="Delete Bill"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete bill "{selectedBill?.billNumber}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Bill Form Dialog */}
      <BillForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={formBill}
      />

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default BillList;