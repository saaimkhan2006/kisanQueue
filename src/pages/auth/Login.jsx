import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { GOVT_METADATA } from '../../utils/constants';

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otp, setOtp] = useState('1234');
  const [otpSent, setOtpSent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(mobileNumber, otp);
      navigate('/farmer/dashboard');
    } catch (err) {
      alert('Login error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    await login('9876543210', '1234');
    setIsLoading(false);
    navigate('/farmer/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4">
      {/* Official Emblem Banner */}
      <div className="w-full max-w-md text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary text-primary-fixed mx-auto flex items-center justify-center shadow-md mb-3">
          <span className="material-symbols-outlined text-[36px]">agriculture</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Digital India &bull; {GOVT_METADATA.department}
        </span>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mt-1">
          {GOVT_METADATA.portalName}
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {GOVT_METADATA.tagline}
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-surface-container shadow-xl max-w-md w-full">
        <div className="mb-6">
          <h2 className="font-headline text-xl font-bold text-on-surface">
            Farmer Portal Login
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Sign in using your PM-KISAN registered mobile number or Aadhaar.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Mobile Number / Kisan ID
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                +91
              </span>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="98765 43210"
                className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          {otpSent && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  4-Digit OTP
                </label>
                <span className="text-xs text-secondary font-semibold">Demo OTP: 1234</span>
              </div>
              <input
                type="password"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="w-full px-4 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
            ) : (
              <>
                <span>Sign In to Mandi Queue</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Track Button */}
        <div className="mt-6 pt-6 border-t border-surface-container text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 bg-secondary-fixed text-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Instant Demo: Login as Rameshwar Singh</span>
          </button>
          <p className="text-[11px] text-on-surface-variant mt-2">
            Preloads active Token C-117 at Karnal Central Mandi
          </p>

          <div className="mt-4 pt-4 border-t border-surface-container text-xs text-on-surface-variant">
            New Farmer?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Register eKYC &amp; Land Records
            </Link>
          </div>
        </div>
      </div>

      {/* Sovereign Helpline Footer */}
      <div className="mt-8 text-center text-xs text-on-surface-variant">
        <p>Toll-Free Sovereign Mandi Support: <strong className="text-primary">{GOVT_METADATA.helpline}</strong></p>
        <p className="mt-0.5">{GOVT_METADATA.orderRef}</p>
      </div>
    </div>
  );
}
