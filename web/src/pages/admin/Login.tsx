import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // Read updated user from localStorage
      const stored = localStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : null;

      if (user?.role !== 'admin') {
        setError('Access denied: This account does not have administrator privileges.');
        return;
      }

      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Admin login failed:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password. Please verify admin credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setFormData({
      email: 'admin@wedding-saas.com',
      password: 'admin123',
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-100 relative overflow-hidden select-none">
      {/* Background radial ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 shadow-[0_0_40px_rgba(245,158,11,0.3)] mb-4 border border-amber-300/30">
          <span className="text-3xl">🛡️</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          InviteHub Master Admin
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Centralized management console for platform operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="admin@wedding-saas.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Master Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-bold rounded-xl text-sm transition-all duration-200 shadow-[0_0_25px_rgba(245,158,11,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Admin</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Fill Pill */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500 mb-2 font-mono">Quick Development Access:</p>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-amber-300 font-mono transition flex items-center justify-center gap-1.5 mx-auto"
            >
              <span>🔑</span>
              <span>Fill Admin: admin@wedding-saas.com</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/dashboard"
              className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1"
            >
              <span>←</span>
              <span>Return to Public Site</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
