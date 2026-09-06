import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQueueStore } from '../../store/queueStore';

export default function AdminLogin() {
  const [adminId, setAdminId] = useState('ADMIN-001');
  const [password, setPassword] = useState('admin1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginAdmin = useAuthStore((s) => s.loginAdmin);
  const showToast = useQueueStore((s) => s.showToast);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!adminId || !password) {
      setError('Please enter your Admin ID and Password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await loginAdmin(adminId, password);
      showToast('Welcome, District APMC Director! Full DoCA Command Access Granted.', 'verified');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid Admin ID or Credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setAdminId('ADMIN-001');
    setPassword('admin1234');
    setLoading(true);
    setError('');
    try {
      await loginAdmin('ADMIN-001', 'admin1234');
      showToast('Demo Admin Login: Welcome District APMC Director!', 'verified');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500 text-slate-950 font-black text-2xl shadow-xl mb-4 ring-4 ring-sky-500/20">
          <span className="material-symbols-outlined text-[36px]">shield</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          DoCA Central Command Console
        </h2>
        <p className="mt-1 text-xs text-sky-400 font-semibold uppercase tracking-wider">
          National APMC Regional Administration &amp; Governance Grid
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10 space-y-6">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
            <span className="material-symbols-outlined text-sky-400 text-[24px]">monitoring</span>
            <div>
              <p className="text-xs font-bold text-slate-200">District APMC Procurement Oversight</p>
              <p className="text-[11px] text-slate-400 font-mono">Mysore Regional APMC Cluster (4 Mandis)</p>
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
                Admin Official ID / Email
              </label>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="ADMIN-001 or admin@doca.gov.in"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm font-semibold focus:outline-none focus:border-sky-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Security Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm font-semibold focus:outline-none focus:border-sky-400 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">key</span>
              )}
              <span>Authenticate DoCA Central Command</span>
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>1-Click Demo Login: District Director APMC</span>
            </button>
          </div>

          <div className="text-center pt-2 flex items-center justify-center gap-3 text-xs text-slate-400">
            <Link to="/staff/login" className="hover:text-slate-200 transition-colors">
              Staff Login
            </Link>
            <span>&bull;</span>
            <Link to="/login" className="hover:text-slate-200 transition-colors">
              Farmer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
