// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   Grid,
//   MenuItem,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';
// import { itemService } from '../../services/itemService';

// const ItemForm = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);
  
//   const [item, setItem] = useState({
//     itemCode: '',
//     name: '',
//     description: '',
//     unitPrice: '',
//     category: '',
//     stockQuantity: 0
//   });
  
//   const [errors, setErrors] = useState({});
//   const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

//   const categories = [
//     'Books',
//     'Stationery',
//     'Electronics',
//     'Accessories',
//     'Software',
//     'Other'
//   ];

//   useEffect(() => {
//     if (isEdit) {
//       fetchItem();
//     }
//   }, [id, isEdit]);

//   const fetchItem = async () => {
//     try {
//       const response = await itemService.getItemById(id);
//       setItem(response.data);
//     } catch (error) {
//       showNotification('Error fetching item', 'error');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setItem(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!item.name.trim()) {
//       newErrors.name = 'Name is required';
//     }
    
//     if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) {
//       newErrors.unitPrice = 'Unit price must be greater than 0';
//     }
    
//     if (item.stockQuantity < 0) {
//       newErrors.stockQuantity = 'Stock quantity cannot be negative';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     try {
//       const itemData = {
//         ...item,
//         unitPrice: parseFloat(item.unitPrice),
//         stockQuantity: parseInt(item.stockQuantity)
//       };
      
//       if (isEdit) {
//         await itemService.updateItem(id, itemData);
//         showNotification('Item updated successfully', 'success');
//       } else {
//         await itemService.createItem(itemData);
//         showNotification('Item created successfully', 'success');
//       }
      
//       setTimeout(() => navigate('/items'), 1500);
//     } catch (error) {
//       showNotification('Error saving item', 'error');
//     }
//   };

//   const showNotification = (message, severity) => {
//     setNotification({ open: true, message, severity });
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         {isEdit ? 'Edit Item' : 'Add New Item'}
//       </Typography>
      
//       <Card>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Item Code"
//                   name="itemCode"
//                   value={item.itemCode}
//                   onChange={handleChange}
//                   disabled={isEdit}
//                   error={!!errors.itemCode}
//                   helperText={errors.itemCode}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Name"
//                   name="name"
//                   value={item.name}
//                   onChange={handleChange}
//                   required
//                   error={!!errors.name}
//                   helperText={errors.name}
//                 />
//               </Grid>
              
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Description"
//                   name="description"
//                   value={item.description}
//                   onChange={handleChange}
//                   multiline
//                   rows={3}
//                   error={!!errors.description}
//                   helperText={errors.description}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Unit Price"
//                   name="unitPrice"
//                   type="number"
//                   value={item.unitPrice}
//                   onChange={handleChange}
//                   required
//                   inputProps={{ min: 0, step: 0.01 }}
//                   error={!!errors.unitPrice}
//                   helperText={errors.unitPrice}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Category"
//                   name="category"
//                   select
//                   value={item.category}
//                   onChange={handleChange}
//                   error={!!errors.category}
//                   helperText={errors.category}
//                 >
//                   {categories.map((category) => (
//                     <MenuItem key={category} value={category}>
//                       {category}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Stock Quantity"
//                   name="stockQuantity"
//                   type="number"
//                   value={item.stockQuantity}
//                   onChange={handleChange}
//                   inputProps={{ min: 0 }}
//                   error={!!errors.stockQuantity}
//                   helperText={errors.stockQuantity}
//                 />
//               </Grid>
              
//               <Grid item xs={12}>
//                 <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//                   <Button
//                     variant="outlined"
//                     onClick={() => navigate('/items')}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                   >
//                     {isEdit ? 'Update' : 'Create'} Item
//                   </Button>
//                 </Box>
//               </Grid>
//             </Grid>
//           </form>
//         </CardContent>
//       </Card>

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

// export default ItemForm;

// components/items/ItemForm.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';
import { itemService } from '../../services/itemService';

const categories = ['Books', 'Stationery', 'Electronics', 'Accessories', 'Software', 'Other'];

const ItemForm = ({ onClose, onSuccess, initialValues }) => {
  const [item, setItem] = useState({
    itemCode: '',
    name: '',
    description: '',
    unitPrice: '',
    category: '',
    stockQuantity: 0,
  });

  useEffect(() => {
    if (initialValues) {
      setItem(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        ...item,
        unitPrice: parseFloat(item.unitPrice),
        stockQuantity: parseInt(item.stockQuantity),
      };
      if (initialValues) {
        await itemService.updateItem(initialValues.id, itemData);
      } else {
        await itemService.createItem(itemData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Item Code"
            name="itemCode"
            value={item.itemCode}
            onChange={handleChange}
            disabled={!!initialValues}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={item.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={item.description}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Unit Price"
            name="unitPrice"
            type="number"
            value={item.unitPrice}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={item.category}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={item.stockQuantity}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemForm;