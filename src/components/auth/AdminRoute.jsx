import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AdminRoute({ children }) {
  const { isAuthenticated, role, user } = useAuthStore();

  const isAdminRole = role === 'admin' || user?.role === 'admin';

  if (!isAuthenticated || !isAdminRole) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
}
