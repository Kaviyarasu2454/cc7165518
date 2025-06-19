// client/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie'; // Using js-cookie for more robust token storage

// Create the AuthContext
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State to hold user information and token
  // Initialize from cookies for persistence across sessions
  const [user, setUser] = useState(() => {
    const token = Cookies.get('token');
    const username = Cookies.get('username');
    if (token && username) {
      return { username, token };
    }
    return null; // No user logged in initially
  });

  // Login function: stores user info and token in state and cookies
  const login = (userData) => {
    setUser(userData);
    // Set cookie expiry for 7 days, adjust as needed
    // secure: true ensures cookie is only sent over HTTPS (for deployed version)
    // sameSite: 'Lax' helps with CSRF protection
    Cookies.set('token', userData.token, { expires: 7, secure: window.location.protocol === 'https:', sameSite: 'Lax' }); 
    Cookies.set('username', userData.username, { expires: 7, secure: window.location.protocol === 'https:', sameSite: 'Lax' });
    console.log("User logged in:", userData.username);
  };

  // Logout function: clears user info from state and cookies
  const logout = () => {
    setUser(null);
    Cookies.remove('token');
    Cookies.remove('username');
    console.log("User logged out.");
  };

  // Provide the auth state and functions to children components
  const value = {
    user,
    isAuthenticated: !!user, // Convenience boolean for checking login status
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
