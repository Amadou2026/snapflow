// src/components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../services/authService';

const PrivateRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    setIsAuth(auth);
    if (!auth) {
      window.location.href = '/login'; // redirection sans Navigate
    }
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return null; // ou un spinner/loading
  }

  return isAuth ? children : null;
};

export default PrivateRoute;
