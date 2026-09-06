import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LANGUAGES, GOVT_METADATA } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';
import { useQueueStore } from '../../store/queueStore';

export default function Navbar() {
  const [currentLang, setCurrentLang] = useState('en');
  const [highContrast, setHighContrast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const showToast = useQueueStore((s) => s.showToast);

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    document.documentElement.classList.toggle('high-contrast', next);
    showToast(next ? 'High Contrast Accessibility Mode Enabled' : 'Standard Display Mode Restored', 'contrast');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/farmer/centres?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Official Government Sovereign Top Banner */}
      <div className="w-full bg-primary text-on-primary px-4 lg:px-6 py-1 flex items-center justify-between text-[11px] font-semibold tracking-wider">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1 uppercase">
            <span className="material-symbols-outlined text-[14px]">flag</span> Digital India
          </span>
          <span className="text-primary-fixed-dim hidden sm:inline">|</span>
          <span className="hidden sm:inline text-primary-fixed font-normal">
            {GOVT_METADATA.department} • {GOVT_METADATA.ministry}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-primary-fixed transition-colors">
            <span className="material-symbols-outlined text-[14px]">language</span>
            <select
              value={currentLang}
              onChange={(e) => {
                setCurrentLang(e.target.value);
                showToast(`Language set to ${LANGUAGES.find(l => l.code === e.target.value)?.label}`, 'translate');
              }}
              className="bg-transparent text-on-primary text-[11px] font-semibold focus:outline-none cursor-pointer border-none py-0 pr-2"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-on-surface bg-surface">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={toggleContrast}
            aria-label="High Contrast Mode"
            className="flex items-center gap-1 hover:text-primary-fixed transition-colors text-[11px]"
          >
            <span className="material-symbols-outlined text-[14px]">contrast</span>
            <span className="hidden md:inline">A+ / A-</span>
          </button>

          {/* Screen Voice Reader */}
          <button
            type="button"
            onClick={() => showToast('Screen voice reader initialized (Accessibility Audio active)', 'volume_up')}
            aria-label="Screen Voice Reader"
            className="flex items-center gap-1 hover:text-primary-fixed transition-colors text-[11px]"
          >
            <span className="material-symbols-outlined text-[14px]">volume_up</span>
            <span className="hidden md:inline">Reader</span>
          </button>

          {/* Authenticated Farmer Badge */}
          {user && (
            <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-primary-container">
              <span className="material-symbols-outlined text-tertiary-fixed text-[14px]">verified</span>
              <span className="text-surface-container-lowest font-medium">{user.name}</span>
              <span className="text-primary-fixed-dim">({user.kisanId})</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between bg-surface-container-lowest">
        <Link to="/farmer/dashboard" className="flex items-center gap-3 lg:gap-4 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-fixed shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">agriculture</span>
          </div>
          <div className="h-8 w-px bg-surface-container-high hidden sm:block"></div>
          <div>
            <span className="font-headline text-[20px] font-bold text-primary tracking-tight block leading-tight">
              {GOVT_METADATA.portalName}
            </span>
            <span className="text-[12px] font-medium text-on-surface-variant hidden sm:block">
              {GOVT_METADATA.tagline}
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4 hidden md:block">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Mandi, Consignment ID, or Token No..."
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low text-on-surface rounded-xl text-sm focus:outline-none focus:bg-surface-container focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            to="/farmer/notifications"
            className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error rounded-full flex items-center justify-center text-[9px] font-bold">
              3
            </span>
          </Link>

          {/* User Profile Pill */}
          <Link
            to="/farmer/profile"
            className="flex items-center gap-2 pl-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-on-surface leading-tight">
                {user ? user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1]?.[0] || '') + '.' : 'Farmer'}
              </p>
              <p className="text-[11px] text-secondary font-semibold">Registered Farmer</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
