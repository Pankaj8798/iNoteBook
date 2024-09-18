import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from '../components/Home';

const AuthGuard = () => {
    // If has token, return outlet in other case return navigate to login page
    return localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY) ? <Home /> : <Navigate to="/login" />;
}

export default AuthGuard