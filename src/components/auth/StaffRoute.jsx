import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function StaffRoute({ children }) {
  const { isAuthenticated, role, user } = useAuthStore();

  const isStaffRole = role === 'staff' || user?.role === 'staff';

  if (!isAuthenticated || !isStaffRole) {
    return <Navigate to="/staff/login" replace />;
  }

  return children ? children : <Outlet />;
}

