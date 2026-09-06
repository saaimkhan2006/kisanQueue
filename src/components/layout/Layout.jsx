import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Toast from '../common/Toast';
import DemoFloatingBar from '../demo/DemoFloatingBar';
import { useQueueStore } from '../../store/queueStore';
import { useBookingStore } from '../../store/bookingStore';

export default function Layout() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fetchLiveQueue = useQueueStore((s) => s.fetchLiveQueue);
  const fetchActiveBooking = useBookingStore((s) => s.fetchActiveBooking);

  useEffect(() => {
    fetchActiveBooking();
    fetchLiveQueue();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchActiveBooking, fetchLiveQueue]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Offline Alert Banner if network disconnects */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-semibold py-1 px-4 text-center fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-1.5 shadow-md">
          <span className="material-symbols-outlined text-[16px]">wifi_off</span>
          <span>You are currently offline. Showing cached Mandi data. Reconnecting to IoT grid...</span>
        </div>
      )}

      <Navbar />
      <Sidebar />
      
      <div className="lg:pl-72 flex-1 flex flex-col">
        <main className="flex-1 pt-24 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <BottomNav />
      <Toast />
      <DemoFloatingBar />
    </div>
  );
}
