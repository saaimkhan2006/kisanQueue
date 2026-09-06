import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StaffLayout from '../components/layout/StaffLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import StaffLogin from '../pages/auth/StaffLogin';
import StaffRoute from '../components/auth/StaffRoute';

// Farmer Pages
import Dashboard from '../pages/farmer/Dashboard';
import Centres from '../pages/farmer/Centres';
import CentreDetails from '../pages/farmer/CentreDetails';
import BookSlot from '../pages/farmer/BookSlot';
import BookingConfirmation from '../pages/farmer/BookingConfirmation';
import BookingsList from '../pages/farmer/BookingsList';
import LiveQueue from '../pages/farmer/LiveQueue';
import Procurement from '../pages/farmer/Procurement';
import Payment from '../pages/farmer/Payment';
import Notifications from '../pages/farmer/Notifications';
import Profile from '../pages/farmer/Profile';

// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard';
import StaffProcurement from '../pages/staff/StaffProcurement';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCentres from '../pages/admin/AdminCentres';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/staff/login" element={<StaffLogin />} />

      {/* Farmer Portal */}
      <Route path="/farmer" element={<Layout />}>
        <Route index element={<Navigate to="/farmer/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="centres" element={<Centres />} />
        <Route path="centres/:id" element={<CentreDetails />} />
        <Route path="book" element={<BookSlot />} />
        <Route path="booking/:id" element={<BookingConfirmation />} />
        <Route path="bookings" element={<BookingsList />} />
        <Route path="queue" element={<LiveQueue />} />
        <Route path="procurement" element={<Procurement />} />
        <Route path="payment" element={<Payment />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Staff Portal */}
      <Route
        path="/staff"
        element={
          <StaffRoute>
            <StaffLayout />
          </StaffRoute>
        }
      >
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="procurement" element={<StaffProcurement />} />
      </Route>

      {/* Admin Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="centres" element={<AdminCentres />} />
      </Route>

      {/* Fallback routes */}
      <Route path="/" element={<Navigate to="/farmer/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/farmer/dashboard" replace />} />
    </Routes>
  );
}
