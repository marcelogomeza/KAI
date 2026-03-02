import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, hasRole } = useAuth();

    // Redirect to login if not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to unauthorized or home if role doesn't match
    if (allowedRoles && !hasRole(allowedRoles)) {
        return <Navigate to="/" replace />;
    }

    // Render child routes
    return <Outlet />;
};
