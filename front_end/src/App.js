import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Login from './components/auth/Login';
import BillList from './components/bills/BillList';
import BillForm from './components/bills/BillForm';
import CustomerList from './components/customers/CustomerList';
import Dashboard from './components/dashboard/Dashboard';
import ItemList from './components/items/ItemList';
import ItemForm from './components/items/ItemForm';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// ⚠ Keeping your original JWT check
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token)); // unchanged
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/customers"
            element={isAuthenticated() ? <CustomerList /> : <Navigate to="/login" />}
          />

          {/* Items */}
          <Route
            path="/items"
            element={isAuthenticated() ? <ItemList /> : <Navigate to="/login" />}
          />
          <Route
            path="/items/new"
            element={isAuthenticated() ? <ItemForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/items/:id"
            element={isAuthenticated() ? <ItemForm /> : <Navigate to="/login" />}
          />

          {/* Bills (✅ added consistency with Items) */}
          <Route
            path="/bills"
            element={isAuthenticated() ? <BillList /> : <Navigate to="/login" />}
          />
          <Route
            path="/bills/new"
            element={isAuthenticated() ? <BillForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/bills/:id"
            element={isAuthenticated() ? <BillForm /> : <Navigate to="/login" />}
          />

          {/* Default Redirect */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;