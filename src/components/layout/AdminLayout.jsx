import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLocationStore } from '../../store/locationStore';
import Toast from '../common/Toast';

export default function AdminLayout() {
  const location = useLocationStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Admin Top Sovereign Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-sm border-b border-surface-container">
        <div className="bg-slate-900 text-white px-4 lg:px-6 py-1 flex items-center justify-between text-[11px] font-semibold">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider flex items-center gap-1 text-sky-400">
              <span className="material-symbols-outlined text-[14px]">shield</span> DoCA Central Control Grid
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">National Mandi Remote Queue &amp; MSP Procurement Governance</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/farmer/dashboard"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
              <span>Farmer Portal</span>
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              to="/staff/dashboard"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Staff Portal
            </Link>
          </div>
        </div>

        <div className="h-16 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">monitoring</span>
            </div>
            <div>
              <h1 className="font-headline text-lg font-bold text-on-surface leading-tight">
                National APMC Grid Administration
              </h1>
              <p className="text-xs text-on-surface-variant">
                {location.district} Regional Procurement Cluster ({location.state})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
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
                <span>Financial &amp; Operations KPI</span>
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
                <span>Mandi Capacity &amp; Scales</span>
              </NavLink>
            </nav>

            {/* Admin User Profile & Logout */}
            <div className="pl-4 border-l border-surface-container flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-on-surface leading-tight">
                  {user?.name || 'District Director APMC'}
                </p>
                <p className="text-[10px] font-mono text-secondary font-semibold">
                  {user?.badgeNo || '#ADM-01'} &bull; DoCA Admin
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                title="Logout from Admin Portal"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      <Toast />
    </div>
  );
}
