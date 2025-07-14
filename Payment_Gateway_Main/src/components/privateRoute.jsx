// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // You can also decode token and check expiry or user type if needed
  return token ? children : <Navigate to="/user-login" />;
};

export default PrivateRoute;
