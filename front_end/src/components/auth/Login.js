import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Hardcoded credentials for now
const HARDCODED_USERS = {
  'admin': 'admin123',
  'user': 'user123',
  'demo': 'demo123'
};

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check hardcoded credentials
      const { username, password } = credentials;
      
      if (HARDCODED_USERS[username] && HARDCODED_USERS[username] === password) {
        // Create fake JWT token
        const fakeToken = btoa(JSON.stringify({
          username: username,
          role: username === 'admin' ? 'ADMIN' : 'USER',
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));
        
        // Store in localStorage
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify({
          username: username,
          role: username === 'admin' ? 'ADMIN' : 'USER'
        }));
        
        console.log('Login successful:', username);
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom color="primary">
                Pahana Edu
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Billing System
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                margin="normal"
                required
                autoFocus
                placeholder="Enter username"
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                margin="normal"
                required
                placeholder="Enter password"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
                size="large"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
                <strong>Demo Credentials:</strong>
              </Typography>
              <Typography variant="body2" align="center">
                • <strong>Admin:</strong> admin / admin123<br/>
                • <strong>User:</strong> user / user123<br/>
                • <strong>Demo:</strong> demo / demo123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;