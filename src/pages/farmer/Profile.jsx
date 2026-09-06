import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER } from '../../utils/mockData';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  // Ensure safe fallback to demo farmer profile if fields are missing or user is staff
  const farmerUser = {
    ...MOCK_USER,
    ...user,
    name: user?.name || MOCK_USER.name,
    kisanId: user?.kisanId || MOCK_USER.kisanId,
    phone: user?.phone || MOCK_USER.phone,
    aadhaarMasked: user?.aadhaarMasked || MOCK_USER.aadhaarMasked,
    village: user?.village || MOCK_USER.village,
    district: user?.district || MOCK_USER.district,
    state: user?.state || MOCK_USER.state,
    landHoldingAcres: user?.landHoldingAcres || MOCK_USER.landHoldingAcres,
    cropsGrown:
      user?.cropsGrown && Array.isArray(user.cropsGrown) && user.cropsGrown.length > 0
        ? user.cropsGrown
        : MOCK_USER.cropsGrown,
    bankAccount: {
      ...MOCK_USER.bankAccount,
      ...(user?.bankAccount || {}),
    },
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Farmer Profile &amp; Land Records
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Sovereign agrarian registry under PM-KISAN and DoCA DBT grid.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-error/10 hover:bg-error/20 text-error rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Logout
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-surface-container">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-on-primary text-3xl font-headline font-bold">
            {farmerUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                Verified Aadhaar eKYC
              </span>
              <span className="text-xs font-mono text-on-surface-variant">
                Kisan ID: {farmerUser.kisanId}
              </span>
            </div>
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
              {farmerUser.name}
            </h2>
            <p className="text-xs text-on-surface-variant">
              {farmerUser.village}, {farmerUser.district}, {farmerUser.state}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Registered Mobile Number</span>
            <span className="font-bold text-on-surface block mt-1">{farmerUser.phone}</span>
            <span className="text-[11px] text-emerald-700 font-semibold">SMS &amp; WhatsApp Alerts Active</span>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Aadhaar Identity</span>
            <span className="font-bold text-on-surface block mt-1">{farmerUser.aadhaarMasked}</span>
            <span className="text-[11px] text-on-surface-variant">Masked for Sovereign Security</span>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Agricultural Land Records</span>
            <span className="font-bold text-on-surface block mt-1">{farmerUser.landHoldingAcres} Acres</span>
            <span className="text-[11px] text-on-surface-variant">Pahani / RTC Verified in Karnataka Bhoomi Portal</span>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Primary Crops Grown</span>
            <span className="font-bold text-on-surface block mt-1">{farmerUser.cropsGrown.join(', ')}</span>
            <span className="text-[11px] text-primary font-semibold">Ragi, Paddy &amp; Maize Procurement Eligible</span>
          </div>
        </div>

        {/* Bank & DBT Details */}
        <div className="p-4 bg-primary-fixed/20 rounded-xl border border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              DBT Bank Account for MSP Disbursal
            </h4>
            <span className="text-[10px] bg-primary text-on-primary font-bold px-2 py-0.5 rounded-full uppercase">
              NPCI Mapped
            </span>
          </div>
          <p className="text-sm font-bold text-on-surface">{farmerUser.bankAccount.bankName}</p>
          <p className="text-xs font-mono text-on-surface-variant mt-0.5">
            A/C: {farmerUser.bankAccount.accountMasked} • IFSC: {farmerUser.bankAccount.ifsc}
          </p>
        </div>
      </div>
    </div>
  );
}
