import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize state with a more robust check
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser && savedUser !== 'null' ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user'); // Clean up invalid data
      return null;
    }
  });

  // Add authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!user;
  });

  useEffect(() => {
    if (user && typeof user === 'object') {
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = (email) => {
    if (!email) {
      console.error('Login attempted with invalid email');
      return false;
    }
    try {
      const userData = { 
        email,
        lastLogin: new Date().toISOString(),
        isActive: true
      };
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  // Add function to check authentication status
  const checkAuth = () => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser && savedUser !== 'null' ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </UserContext.Provider>
  );
};