import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm font-medium">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-red-500/20">
            🔒
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Restricted Admin Access</h2>
          <p className="text-sm text-slate-400 mb-6">
            Your account (<span className="text-slate-200 font-mono">{user?.email}</span>) does not have administrator privileges.
          </p>
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition"
            >
              Return to Host Dashboard
            </Link>
            <Link
              to="/admin/login"
              className="block w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
            >
              Sign In with Admin Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;

