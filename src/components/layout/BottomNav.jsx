import React from 'react';
import { NavLink } from 'react-router-dom';

const MOBILE_ITEMS = [
  { path: '/farmer/dashboard', label: 'Home', icon: 'space_dashboard' },
  { path: '/farmer/centres', label: 'Centres', icon: 'near_me' },
  { path: '/farmer/queue', label: 'Queue', icon: 'timelapse', hasDot: true },
  { path: '/farmer/bookings', label: 'Bookings', icon: 'confirmation_number' },
  { path: '/farmer/profile', label: 'Profile', icon: 'badge' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest lg:hidden flex items-center justify-around py-2 border-t border-surface-container-high/60 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      {MOBILE_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 relative py-1 px-3 rounded-lg transition-colors ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive ? (item.hasDot ? 'text-secondary' : 'text-primary') : ''
                  }`}
                >
                  {item.icon}
                </span>
                {item.hasDot && (
                  <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-surface-container-lowest animate-pulse" />
                )}
              </div>
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
