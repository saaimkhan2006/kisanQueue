import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQueueStore } from '../../store/queueStore';

export default function StaffLogin() {
  const [staffId, setStaffId] = useState('STAFF-409');
  const [password, setPassword] = useState('staff1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginStaff = useAuthStore((s) => s.loginStaff);
  const showToast = useQueueStore((s) => s.showToast);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!staffId || !password) {
      setError('Please enter your Staff ID and Password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await loginStaff(staffId, password);
      showToast('Logged in successfully as M. Kumar (Inspector #409)', 'verified');
      navigate('/staff/dashboard', { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid Staff ID or Password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setStaffId('STAFF-409');
    setPassword('staff1234');
    setLoading(true);
    setError('');
    try {
      await loginStaff('STAFF-409', 'staff1234');
      showToast('Demo Staff Login: Welcome Inspector M. Kumar!', 'verified');
      navigate('/staff/dashboard', { replace: true });
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl shadow-lg mb-4">
          <span className="material-symbols-outlined text-[36px]">badge</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          APMC Staff &amp; Operator Portal
        </h2>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          National APMC Network &bull; Agricultural Produce Market Committee
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-700 sm:px-10 space-y-6">
          {/* Official Yard Banner */}
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/80 flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-[24px]">location_on</span>
            <div>
              <p className="text-xs font-bold text-slate-200">Central APMC Procurement Yard</p>
              <p className="text-[11px] text-slate-400 font-mono">Procurement Station #APMC-MAIN-01</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Staff Official ID / Email
              </label>
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="e.g. STAFF-409 or staff@apmc.in"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-700 text-sm font-semibold focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-700 text-sm font-semibold focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">login</span>
              )}
              <span>Login to Staff Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-4 border-t border-slate-700/80">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-3 bg-slate-700 hover:bg-slate-600 text-amber-300 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-600"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Demo Login: M. Kumar (Inspector #409)</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
              Are you a farmer? <span className="text-amber-400 underline font-semibold">Farmer Portal Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

