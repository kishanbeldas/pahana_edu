import api from './api';

export const authService = {
  login: (credentials) => {
    // This is now handled in the Login component
    // but keeping for API structure compatibility
    return Promise.resolve({
      data: {
        token: 'fake-token',
        user: { username: credentials.username }
      }
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  }
};
