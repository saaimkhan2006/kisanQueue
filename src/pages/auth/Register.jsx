import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLocationStore } from '../../store/locationStore';
import { GOVT_METADATA } from '../../utils/constants';

export default function Register() {
  const location = useLocationStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhaarMasked: '',
    village: '',
    district: location.district,
    state: location.state,
    landHoldingAcres: '',
    bankName: 'Canara Bank',
    accountNumber: '',
    ifsc: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        phone: '+91 ' + formData.phone,
        aadhaarMasked: 'XXXX-XXXX-' + (formData.aadhaarMasked.slice(-4) || '1234'),
        village: formData.village,
        district: formData.district,
        state: formData.state,
        landHoldingAcres: Number(formData.landHoldingAcres) || 3.5,
        bankAccount: {
          bankName: formData.bankName,
          accountMasked: 'XXXX' + (formData.accountNumber.slice(-4) || '8842'),
          ifsc: formData.ifsc || 'CNRB0001024',
          dbtLinked: true,
        },
      });
      navigate('/farmer/dashboard');
    } catch (err) {
      alert('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 py-12">
      {/* Official Banner */}
      <div className="w-full max-w-lg text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary text-primary-fixed mx-auto flex items-center justify-center shadow-md mb-2">
          <span className="material-symbols-outlined text-[32px]">how_to_reg</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Digital India &bull; {GOVT_METADATA.department}
        </span>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
          Farmer eKYC Registration
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Enroll in the Sovereign Mandi Remote Queue &amp; DBT Grid
        </p>
      </div>

      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-surface-container shadow-xl max-w-lg w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Full Name (as on Aadhaar)
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Balwinder Singh"
                className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Aadhaar Number (12 Digits)
              </label>
              <input
                type="password"
                maxLength={12}
                name="aadhaarMasked"
                required
                value={formData.aadhaarMasked}
                onChange={handleChange}
                placeholder="5521 8924 9901"
                className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Land Holding (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                name="landHoldingAcres"
                required
                value={formData.landHoldingAcres}
                onChange={handleChange}
                placeholder="e.g. 4.5"
                className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Village / Locality
              </label>
              <input
                type="text"
                name="village"
                required
                value={formData.village}
                onChange={handleChange}
                placeholder="e.g. Taraori Village"
                className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                District / State
              </label>
              <input
                type="text"
                disabled
                value={`${location.district}, ${location.state}`}
                className="w-full px-3.5 py-2.5 bg-surface-container text-on-surface-variant rounded-xl border border-surface-container text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Bank Account for DBT */}
          <div className="p-4 bg-primary-fixed/20 rounded-xl border border-primary/30 space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              Direct Benefit Transfer (DBT) Bank Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-on-surface-variant mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  required
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="000000000000"
                  className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface rounded-lg border border-surface-container text-xs focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-on-surface-variant mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifsc"
                  required
                  value={formData.ifsc}
                  onChange={handleChange}
                  placeholder="CNRB0001024"
                  className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface rounded-lg border border-surface-container text-xs focus:outline-none font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
            ) : (
              <>
                <span>Complete Registration &amp; Enter Portal</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-on-surface-variant">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
