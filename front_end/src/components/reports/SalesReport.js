import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { GetApp, Print } from '@mui/icons-material';
import { billService } from '../../services/billService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SalesReport = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await billService.getBillsByDateRange(startDate, endDate);
      const bills = response.data;
      
      // Calculate summary statistics
      const totalSales = bills.reduce((sum, bill) => sum + parseFloat(bill.totalAmount), 0);
      const totalBills = bills.length;
      const paidBills = bills.filter(bill => bill.status === 'PAID');
      const pendingBills = bills.filter(bill => bill.status === 'PENDING');
      const overdueBills = bills.filter(bill => bill.status === 'OVERDUE');
      
      setReportData({
        bills,
        summary: {
          totalSales,
          totalBills,
          paidBills: paidBills.length,
          pendingBills: pendingBills.length,
          overdueBills: overdueBills.length,
          paidAmount: paidBills.reduce((sum, bill) => sum + parseFloat(bill.totalAmount), 0),
          pendingAmount: pendingBills.reduce((sum, bill) => sum + parseFloat(bill.totalAmount), 0),
          overdueAmount: overdueBills.reduce((sum, bill) => sum + parseFloat(bill.totalAmount), 0)
        }
      });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Implementation for exporting report to CSV/Excel
    console.log('Exporting report...');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sales Report
        </Typography>

        {/* Date Range Selection */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  onClick={generateReport}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<GetApp />}
                    onClick={exportReport}
                    disabled={!reportData}
                    size="small"
                  >
                    Export
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Print />}
                    onClick={printReport}
                    disabled={!reportData}
                    size="small"
                  >
                    Print
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Report Summary */}
        {reportData && (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Total Sales
                    </Typography>
                    <Typography variant="h4">
                      {formatCurrency(reportData.summary.totalSales)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Total Bills
                    </Typography>
                    <Typography variant="h4">
                      {reportData.summary.totalBills}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main">
                      Paid Bills
                    </Typography>
                    <Typography variant="h4">
                      {reportData.summary.paidBills}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatCurrency(reportData.summary.paidAmount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="error.main">
                      Outstanding
                    </Typography>
                    <Typography variant="h4">
                      {reportData.summary.pendingBills + reportData.summary.overdueBills}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatCurrency(reportData.summary.pendingAmount + reportData.summary.overdueAmount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Detailed Report Table */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detailed Report ({formatDate(startDate)} - {formatDate(endDate)})
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Bill Number</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.bills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell>{bill.billNumber}</TableCell>
                          <TableCell>{bill.customer?.name}</TableCell>
                          <TableCell>{formatDate(bill.billDate)}</TableCell>
                          <TableCell align="right">{formatCurrency(bill.totalAmount)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={bill.status} 
                              color={
                                bill.status === 'PAID' ? 'success' :
                                bill.status === 'PENDING' ? 'warning' : 'error'
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default SalesReport;