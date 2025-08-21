// components/help/Help.js
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const Help = () => {
  const helpSections = [
    {
      title: 'Getting Started',
      content: (
        <List>
          <ListItem>
            <ListItemText 
              primary="Login to the System"
              secondary="Use your username and password to access the billing system. Contact your administrator if you need credentials."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Navigate the Dashboard"
              secondary="Use the sidebar menu to access different sections: Customers, Items, Bills, and Help."
            />
          </ListItem>
        </List>
      )
    },
    {
      title: 'Customer Management',
      content: (
        <List>
          <ListItem>
            <ListItemText 
              primary="Add New Customer"
              secondary="Click 'Add Customer' button, fill in required details including name, address, and contact information."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Edit Customer Information"
              secondary="Click the edit icon next to any customer to modify their details."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Search Customers"
              secondary="Use the search bar to find customers by name, account number, or phone number."
            />
          </ListItem>
        </List>
      )
    },
    {
      title: 'Item Management',
      content: (
        <List>
          <ListItem>
            <ListItemText 
              primary="Add New Items"
              secondary="Register books, stationery, and other products with item codes, prices, and stock quantities."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Update Stock"
              secondary="Regularly update stock quantities to maintain accurate inventory levels."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Categorize Items"
              secondary="Organize items by category (Books, Stationery, etc.) for better management."
            />
          </ListItem>
        </List>
      )
    },
    {
      title: 'Billing Process',
      content: (
        <List>
          <ListItem>
            <ListItemText 
              primary="Create New Bill"
              secondary="Select customer, add items with quantities, and the system will automatically calculate totals including tax."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Print Bills"
              secondary="Generated bills can be printed or saved as PDF for customer records."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Track Payment Status"
              secondary="Monitor which bills are pending, paid, or overdue for better financial management."
            />
          </ListItem>
        </List>
      )
    },
    {
      title: 'System Features',
      content: (
        <List>
          <ListItem>
            <ListItemText 
              primary="Automatic Calculations"
              secondary="The system automatically calculates subtotals, tax amounts, and final totals."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Data Validation"
              secondary="Built-in validation ensures data integrity and prevents errors."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Search and Filter"
              secondary="Advanced search functionality across all modules for quick data retrieval."
            />
          </ListItem>
        </List>
      )
    },
    {
      title: 'Troubleshooting',
      content: (
        <List>
          <ListItem>
            <ListItemText 
              primary="Login Issues"
              secondary="Ensure your username and password are correct. Contact administrator if problems persist."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Data Not Saving"
              secondary="Check your internet connection and ensure all required fields are filled correctly."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Performance Issues"
              secondary="Clear your browser cache or try using a different browser if the system runs slowly."
            />
          </ListItem>
        </List>
      )
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Pahana Edu Billing System - Help Guide
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            Welcome to the Help Center
          </Typography>
          <Typography variant="body1">
            This comprehensive guide will help you navigate and use all features of the Pahana Edu Online Billing System. 
            The system is designed to streamline your bookshop operations, from customer management to billing and inventory tracking.
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mb: 3 }}>
        {helpSections.map((section, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">{section.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {section.content}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Need Additional Help?
          </Typography>
          <Typography variant="body1">
            If you need further assistance or encounter any issues not covered in this guide, 
            please contact the system administrator or IT support team.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            System Version: 1.0.0 | Last Updated: {new Date().toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Help;