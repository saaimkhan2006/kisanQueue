import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useLocationStore } from '../../store/locationStore';
import Toast from '../common/Toast';

export default function AdminLayout() {
  const location = useLocationStore();
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Admin Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-sm border-b border-surface-container">
        <div className="bg-primary text-on-primary px-4 lg:px-6 py-1 flex items-center justify-between text-[11px] font-semibold">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">shield</span> DoCA Central Control Grid
            </span>
            <span className="text-primary-fixed-dim">|</span>
            <span className="text-primary-fixed">National Mandi Remote Queue &amp; Congestion Monitor</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/farmer/dashboard"
              className="text-primary-fixed hover:text-white transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
              <span>Farmer View</span>
            </Link>
            <span className="text-primary-fixed-dim">|</span>
            <Link
              to="/staff/dashboard"
              className="text-primary-fixed hover:text-white transition-colors"
            >
              Staff View
            </Link>
          </div>
        </div>

        <div className="h-16 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-fixed shadow-sm">
              <span className="material-symbols-outlined text-[24px]">monitoring</span>
            </div>
            <div>
              <h1 className="font-headline text-lg font-bold text-on-surface leading-tight">
                National APMC Grid Administration
              </h1>
              <p className="text-xs text-on-surface-variant">
                {location.district} Agricultural Procurement Cluster ({location.state})
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Operations KPI</span>
            </NavLink>

            <NavLink
              to="/admin/centres"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Capacity &amp; Mandi Config</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      <Toast />
    </div>
  );
}
