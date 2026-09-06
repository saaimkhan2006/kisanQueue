import React from 'react';
import { NavLink } from 'react-router-dom';
import { GOVT_METADATA } from '../../utils/constants';

const NAV_ITEMS = [
  { path: '/farmer/dashboard', label: 'Dashboard', icon: 'space_dashboard' },
  { path: '/farmer/queue', label: 'Live Queue', icon: 'timelapse', badge: 'LIVE', pulse: true },
  { path: '/farmer/centres', label: 'Find Centres & Mandis', icon: 'near_me' },
  { path: '/farmer/book', label: 'Slot Booking', icon: 'event_available' },
  { path: '/farmer/bookings', label: 'My Bookings & Tokens', icon: 'confirmation_number' },
  { path: '/farmer/procurement', label: 'Procurement Status', icon: 'conversion_path' },
  { path: '/farmer/payment', label: 'Payment Status (DBT)', icon: 'account_balance' },
  { path: '/farmer/notifications', label: 'Notifications & SMS', icon: 'sms' },
  { path: '/farmer/profile', label: 'Farmer Profile & Land', icon: 'badge' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-24 bottom-0 w-72 bg-surface-container-lowest z-40 hidden lg:flex flex-col justify-between overflow-y-auto shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container-high/60">
      <div className="p-4">
        {/* Active Procurement Status Badge */}
        <div className="px-3 py-2 mb-3 bg-surface-container-low rounded-xl flex items-center justify-between border border-surface-container">
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Active Procurement
          </span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isActive ? 'text-secondary-fixed' : 'text-on-surface-variant'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        item.pulse
                          ? 'bg-secondary-container text-on-secondary-container animate-pulse'
                          : 'bg-primary-fixed text-on-primary-fixed'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sovereign Mandi Helpline Support Card */}
      <div className="p-4 bg-surface-container-low m-3 rounded-xl border border-surface-container">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5">
            support_agent
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Kisan Mandi Helpline
            </p>
            <a
              href={`tel:${GOVT_METADATA.helpline}`}
              className="text-sm font-bold text-primary hover:underline mt-0.5 block"
            >
              {GOVT_METADATA.helpline}
            </a>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Toll-free 24x7 Sovereign Support
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
