import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { GOVT_METADATA } from '../../utils/constants';
import Toast from '../common/Toast';

export default function StaffLayout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Sovereign Staff Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-sm border-b border-surface-container">
        <div className="bg-primary text-on-primary px-4 lg:px-6 py-1 flex items-center justify-between text-[11px] font-semibold">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">badge</span> APMC Officer Console
            </span>
            <span className="text-primary-fixed-dim">|</span>
            <span className="text-primary-fixed">Central APMC Procurement Yard &bull; Weighbridge Counter 02</span>
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
            <button
              onClick={handleLogout}
              className="text-amber-300 hover:text-white transition-colors font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="h-16 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">scale</span>
            </div>
            <div>
              <h1 className="font-headline text-lg font-bold text-on-surface leading-tight">
                Mandi Queue &amp; Procurement Operator Console
              </h1>
              <p className="text-xs text-on-surface-variant">
                Official Staff: M. Kumar (Procurement Inspector #409)
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/staff/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">queue</span>
              <span>Live Queue Dispatch</span>
            </NavLink>

            <NavLink
              to="/staff/procurement"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>Record Weighbridge Slip</span>
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

