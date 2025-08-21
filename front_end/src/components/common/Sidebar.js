import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  Receipt,
  Help,
  Business
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
      disabled: true // Dashboard not implemented yet
    },
    {
      text: 'Customers',
      icon: <People />,
      path: '/customers'
    },
    {
      text: 'Items',
      icon: <Inventory />,
      path: '/items'
    },
    {
      text: 'Bills',
      icon: <Receipt />,
      path: '/bills'
    },
    {
      text: 'Help',
      icon: <Help />,
      path: '/help'
    }
  ];

  const handleNavigation = (path) => {
    if (onItemClick) onItemClick();
    navigate(path);
  };

  return (
    <Box sx={{ height: '100%', backgroundColor: '#fafafa' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business color="primary" />
          <Typography variant="h6" noWrap component="div" color="primary">
            Pahana Edu
          </Typography>
        </Box>
      </Toolbar>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              disabled={item.disabled}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
                '&:hover': {
                  backgroundColor: 'primary.light',
                  opacity: 0.8,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;