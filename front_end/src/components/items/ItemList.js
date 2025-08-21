// // components/items/ItemList.js
// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Typography,
//   Box,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Snackbar,
//   Alert,
//   Chip
// } from '@mui/material';
// import { Add, Edit, Delete, Search } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { itemService } from '../../services/itemService';
// import  ItemForm  from './ItemForm';

// const ItemList = () => {
//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [deleteDialog, setDeleteDialog] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
//   const [openForm, setOpenForm] = useState(false); 
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   useEffect(() => {
//     const filtered = items.filter(item =>
//       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//     setFilteredItems(filtered);
//   }, [items, searchTerm]);

//   const fetchItems = async () => {
//     try {
//       const response = await itemService.getAllItems();
//       setItems(response.data);
//     } catch (error) {
//       showNotification('Error fetching items', 'error');
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await itemService.deleteItem(selectedItem.id);
//       fetchItems();
//       setDeleteDialog(false);
//       showNotification('Item deleted successfully', 'success');
//     } catch (error) {
//       showNotification('Error deleting item', 'error');
//     }
//   };

//   const showNotification = (message, severity) => {
//     setNotification({ open: true, message, severity });
//   };

//   const getStockStatus = (quantity) => {
//     if (quantity === 0) return { label: 'Out of Stock', color: 'error' };
//     if (quantity <= 10) return { label: 'Low Stock', color: 'warning' };
//     return { label: 'In Stock', color: 'success' };
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" component="h1">
//           Item Management
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           onClick={() => setOpenForm(true)}
//         >
//           Add Item
//         </Button>
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Search items by name, code, or category..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           InputProps={{
//             startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
//           }}
//         />
//       </Box>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Item Code</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Unit Price</TableCell>
//               <TableCell>Stock Quantity</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredItems.map((item) => {
//               const stockStatus = getStockStatus(item.stockQuantity);
//               return (
//                 <TableRow key={item.id}>
//                   <TableCell>{item.itemCode}</TableCell>
//                   <TableCell>{item.name}</TableCell>
//                   <TableCell>{item.category}</TableCell>
//                   <TableCell>Rs. {item.unitPrice.toFixed(2)}</TableCell>
//                   <TableCell>{item.stockQuantity}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={stockStatus.label} 
//                       color={stockStatus.color} 
//                       size="small" 
//                     />
//                   </TableCell>
//                   <TableCell align="center">
//                     <IconButton
//                       color="primary"
//                       onClick={() => navigate(`/items/edit/${item.id}`)}
//                     >
//                       <Edit />
//                     </IconButton>
//                     <IconButton
//                       color="error"
//                       onClick={() => {
//                         setSelectedItem(item);
//                         setDeleteDialog(true);
//                       }}
//                     >
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete item "{selectedItem?.name}"?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
//           <Button onClick={handleDelete} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Item Dialog */}
//       <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
//         <DialogTitle>Add Item</DialogTitle>
//         <DialogContent>
//           <ItemForm onClose={() => setOpenForm(false)} onSuccess={fetchItems} />
//         </DialogContent>
//       </Dialog>

//       <Snackbar
//         open={notification.open}
//         autoHideDuration={6000}
//         onClose={() => setNotification({ ...notification, open: false })}
//       >
//         <Alert severity={notification.severity}>
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ItemList;

// components/items/ItemList.js
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Box, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar, Alert, Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { itemService } from '../../services/itemService';
import ItemForm from './ItemForm';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await itemService.getAllItems();
      setItems(response.data);
    } catch {
      showNotification('Error fetching items', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await itemService.deleteItem(selectedItem.id);
      fetchItems();
      setDeleteDialog(false);
      showNotification('Item deleted successfully', 'success');
    } catch {
      showNotification('Error deleting item', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' };
    if (quantity <= 10) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Item Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditingItem(null);
            setOpenForm(true);
          }}
        >
          Add Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Stock Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const stockStatus = getStockStatus(item.stockQuantity);
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.itemCode}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>Rs. {item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>{item.stockQuantity}</TableCell>
                  <TableCell>
                    <Chip label={stockStatus.label} color={stockStatus.color} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditingItem(item);
                        setOpenForm(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedItem(item);
                        setDeleteDialog(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{selectedItem?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Form */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <ItemForm
            onClose={() => setOpenForm(false)}
            onSuccess={fetchItems}
            initialValues={editingItem}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemList;