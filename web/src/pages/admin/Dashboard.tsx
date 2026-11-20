import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import TemplateImportModal from '../../components/admin/TemplateImportModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'invitations' | 'themes'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [invitationsList, setInvitationsList] = useState<any[]>([]);
  const [themesList, setThemesList] = useState<any[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filters & Search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userTierFilter, setUserTierFilter] = useState('all');

  const [invitationSearch, setInvitationSearch] = useState('');
  const [invitationCategoryFilter, setInvitationCategoryFilter] = useState('all');
  const [invitationStatusFilter, setInvitationStatusFilter] = useState('all');

  const [themeCategoryFilter, setThemeCategoryFilter] = useState('all');
  const [themeSearch, setThemeSearch] = useState('');

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'overview') {
        const res = await api.get('/api/admin/stats');
        setStats(res.data.stats);
      } else if (activeTab === 'users') {
        await fetchUsers();
      } else if (activeTab === 'invitations') {
        await fetchInvitations();
      } else if (activeTab === 'themes') {
        await fetchThemes();
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const params: any = {};
    if (userSearch) params.search = userSearch;
    if (userRoleFilter !== 'all') params.role = userRoleFilter;
    if (userTierFilter !== 'all') params.tier = userTierFilter;
    const res = await api.get('/api/admin/users', { params });
    setUsersList(res.data.users);
  };

  const fetchInvitations = async () => {
    const params: any = {};
    if (invitationSearch) params.search = invitationSearch;
    if (invitationCategoryFilter !== 'all') params.category = invitationCategoryFilter;
    if (invitationStatusFilter !== 'all') params.status = invitationStatusFilter;
    const res = await api.get('/api/admin/invitations', { params });
    setInvitationsList(res.data.invitations);
  };

  const fetchThemes = async () => {
    const params: any = {};
    if (themeCategoryFilter !== 'all') params.category = themeCategoryFilter;
    if (themeSearch) params.search = themeSearch;
    const res = await api.get('/api/admin/themes', { params });
    setThemesList(res.data.themes);
  };

  const handleToggleUserRole = async (targetUser: any) => {
    const newRole = targetUser.role === 'admin' ? 'host' : 'admin';
    try {
      await api.put(`/api/admin/users/${targetUser.id}`, { role: newRole });
      showToast(`User ${targetUser.email} role updated to ${newRole}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleChangeUserTier = async (targetUser: any, tier: string) => {
    try {
      await api.put(`/api/admin/users/${targetUser.id}`, { subscriptionTier: tier });
      showToast(`Subscription tier for ${targetUser.email} set to ${tier}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update tier');
    }
  };

  const handleToggleInvitationStatus = async (invitationId: string, field: 'isPublished' | 'isLive', currentVal: boolean) => {
    try {
      await api.put(`/api/admin/invitations/${invitationId}/toggle-status`, {
        field,
        value: !currentVal,
      });
      showToast(`Invitation status updated`);
      fetchInvitations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update invitation status');
    }
  };

  const handleDeleteInvitation = async (invitationId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete invitation "${title}"?`)) {
      return;
    }
    try {
      await api.delete(`/api/admin/invitations/${invitationId}`);
      showToast(`Invitation deleted`);
      fetchInvitations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete invitation');
    }
  };

  const handleToggleThemeActive = async (themeId: string, currentVal: boolean) => {
    try {
      await api.put(`/api/admin/themes/${themeId}/toggle-active`, {
        isActive: !currentVal,
      });
      showToast(`Theme status updated`);
      fetchThemes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update theme status');
    }
  };

  const handleExportTheme = async (theme: any) => {
    try {
      const res = await api.get(`/api/admin/themes/${theme.id}/export`);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template-${theme.slug}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported "${theme.name}" manifest`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleDeleteTheme = async (themeId: string, themeName: string) => {
    if (!confirm(`Are you sure you want to delete template "${themeName}"?`)) return;
    try {
      await api.delete(`/api/admin/themes/${themeId}`);
      showToast(`Deleted template "${themeName}"`);
      fetchThemes();
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.message || 'Failed to delete template');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-xl shadow-lg">
              🛡️
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-wide">InviteHub</h1>
              <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">Admin Console</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>📊</span>
              <span>Overview &amp; Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>👥</span>
              <span>Users Management</span>
            </button>

            <button
              onClick={() => setActiveTab('invitations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'invitations'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>💌</span>
              <span>Invitations &amp; Sites</span>
            </button>

            <button
              onClick={() => setActiveTab('themes')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'themes'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🎨</span>
              <span>Themes &amp; Catalog</span>
            </button>
          </nav>
        </div>

        {/* Footer / User Profile & Logout */}
        <div className="pt-6 border-t border-slate-800 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Master Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              to="/dashboard"
              className="block w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium text-center transition"
            >
              🌐 Public Host Site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold text-center transition cursor-pointer"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {activeTab === 'overview' && 'Executive Overview & Platform KPIs'}
              {activeTab === 'users' && 'User Accounts & Access Control'}
              {activeTab === 'invitations' && 'Celebration Invitations & Live Sites'}
              {activeTab === 'themes' && 'Theme Catalog & Template Library'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live operational metrics and system configurations
            </p>
          </div>

          <button
            onClick={loadDashboardData}
            className="px-3.5 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-lg text-xs text-slate-300 flex items-center gap-1.5 transition"
          >
            <span>🔄 Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-400 border-t-transparent mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading system data...</p>
          </div>
        ) : (
          <>
            {/* VIEW 1: OVERVIEW & STATS */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-8">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Users</span>
                      <span className="text-xl">👥</span>
                    </div>
                    <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
                    <p className="text-[11px] text-emerald-400 mt-1">Registered host accounts</p>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Invitations</span>
                      <span className="text-xl">💌</span>
                    </div>
                    <p className="text-3xl font-black text-white">{stats.totalInvitations}</p>
                    <p className="text-[11px] text-amber-400 mt-1">
                      {stats.publishedInvitations} Published • {stats.liveInvitations} Live
                    </p>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Themes</span>
                      <span className="text-xl">🎨</span>
                    </div>
                    <p className="text-3xl font-black text-white">{stats.totalThemes}</p>
                    <p className="text-[11px] text-cyan-400 mt-1">Across 9 occasion categories</p>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Categories</span>
                      <span className="text-xl">✨</span>
                    </div>
                    <p className="text-3xl font-black text-white">9</p>
                    <p className="text-[11px] text-fuchsia-400 mt-1">Weddings, Birthdays, etc.</p>
                  </div>
                </div>

                {/* Occasion Distribution Progress Bars */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                    Invitations Distribution by Category
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.categoryDistribution.map((item: any) => (
                      <div key={item.category} className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                          <span className="capitalize text-slate-300">{item.category.replace('_', ' ')}</span>
                          <span className="text-amber-400 font-mono font-bold">{item.count}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.max(10, (item.count / (stats.totalInvitations || 1)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity: Users & Invitations Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Users */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Recent Users</h3>
                      <button onClick={() => setActiveTab('users')} className="text-xs text-amber-400 hover:underline">
                        View All →
                      </button>
                    </div>
                    <div className="divide-y divide-slate-800">
                      {stats.recentUsers.map((u: any) => (
                        <div key={u.id} className="py-3 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-white">{u.name}</p>
                            <p className="text-slate-400 font-mono text-[11px]">{u.email}</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                              {u.subscriptionTier.toUpperCase()}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-1">{new Date(u.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Invitations */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Recent Invitations</h3>
                      <button onClick={() => setActiveTab('invitations')} className="text-xs text-amber-400 hover:underline">
                        View All →
                      </button>
                    </div>
                    <div className="divide-y divide-slate-800">
                      {stats.recentInvitations.map((inv: any) => (
                        <div key={inv.id} className="py-3 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-white">{inv.title}</p>
                            <p className="text-slate-400 text-[11px]">{inv.user?.name} • <span className="text-amber-400 capitalize">{inv.eventType}</span></p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.isPublished ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {inv.isPublished ? 'PUBLISHED' : 'DRAFT'}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-1">{new Date(inv.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: USERS MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <select
                      value={userRoleFilter}
                      onChange={(e) => { setUserRoleFilter(e.target.value); }}
                      className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="all">All Roles</option>
                      <option value="host">Host</option>
                      <option value="admin">Admin</option>
                    </select>

                    <select
                      value={userTierFilter}
                      onChange={(e) => { setUserTierFilter(e.target.value); }}
                      className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="all">All Tiers</option>
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="business">Business</option>
                    </select>

                    <button
                      onClick={fetchUsers}
                      className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition"
                    >
                      Filter
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">User Details</th>
                          <th className="py-3.5 px-4 font-semibold">Role</th>
                          <th className="py-3.5 px-4 font-semibold">Subscription</th>
                          <th className="py-3.5 px-4 font-semibold">Invitations</th>
                          <th className="py-3.5 px-4 font-semibold">Created At</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200">
                        {usersList.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-white">{u.name}</p>
                              <p className="text-slate-400 font-mono text-[11px]">{u.email}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'admin'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={u.subscriptionTier}
                                onChange={(e) => handleChangeUserTier(u, e.target.value)}
                                className="bg-slate-950 border border-slate-700 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none"
                              >
                                <option value="free">FREE</option>
                                <option value="pro">PRO</option>
                                <option value="business">BUSINESS</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                              {u._count?.invitations || 0}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleToggleUserRole(u)}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-medium transition cursor-pointer"
                              >
                                {u.role === 'admin' ? 'Demote to Host' : 'Promote to Admin'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: INVITATIONS & SITES */}
            {activeTab === 'invitations' && (
              <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="Search title, slug, or host..."
                      value={invitationSearch}
                      onChange={(e) => setInvitationSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchInvitations()}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto flex-wrap">
                    <select
                      value={invitationCategoryFilter}
                      onChange={(e) => setInvitationCategoryFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none capitalize"
                    >
                      <option value="all">All Categories</option>
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="baby_shower">Baby Shower</option>
                      <option value="housewarming">Housewarming</option>
                      <option value="party">Party</option>
                      <option value="religious">Religious</option>
                      <option value="family_celebration">Family Celebration</option>
                      <option value="other">Other</option>
                    </select>

                    <select
                      value={invitationStatusFilter}
                      onChange={(e) => setInvitationStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="live">Live</option>
                    </select>

                    <button
                      onClick={fetchInvitations}
                      className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition"
                    >
                      Filter
                    </button>
                  </div>
                </div>

                {/* Invitations Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">Invitation &amp; Slug</th>
                          <th className="py-3.5 px-4 font-semibold">Category</th>
                          <th className="py-3.5 px-4 font-semibold">Host Account</th>
                          <th className="py-3.5 px-4 font-semibold">Theme</th>
                          <th className="py-3.5 px-4 font-semibold">Status</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200">
                        {invitationsList.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-white">{inv.title}</p>
                              <p className="text-slate-400 font-mono text-[11px]">/{inv.slug}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold capitalize bg-slate-800 text-amber-300 border border-slate-700">
                                {inv.eventType.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="text-white font-medium">{inv.user?.name}</p>
                              <p className="text-slate-400 font-mono text-[10px]">{inv.user?.email}</p>
                            </td>
                            <td className="py-3.5 px-4 text-slate-300">
                              {inv.theme?.name || 'Default Theme'}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  inv.isPublished ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {inv.isPublished ? 'PUBLISHED' : 'DRAFT'}
                                </span>
                                {inv.isLive && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                                    LIVE
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => handleToggleInvitationStatus(inv.id, 'isPublished', inv.isPublished)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] font-medium transition cursor-pointer"
                              >
                                {inv.isPublished ? 'Unpublish' : 'Publish'}
                              </button>
                              <Link
                                to={`/invitation/${inv.slug}`}
                                target="_blank"
                                className="inline-block px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-medium transition"
                              >
                                Preview ↗
                              </Link>
                              <button
                                onClick={() => handleDeleteInvitation(inv.id, inv.title)}
                                className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg text-[10px] font-medium transition cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: THEMES & CATALOG */}
            {activeTab === 'themes' && (
              <div className="space-y-6">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">Theme Catalog &amp; Template Library</h2>
                    <p className="text-xs text-slate-400">Manage, export, and build product templates with real-time live preview &amp; AI</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/admin/studio"
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>✨</span>
                      <span>Open AI Template Studio</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsImportModalOpen(true)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>📥</span>
                      <span>Import JSON</span>
                    </button>
                  </div>
                </div>

                {/* Search & Category Filter */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="Search themes by name or slug..."
                      value={themeSearch}
                      onChange={(e) => setThemeSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchThemes()}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    {['all', 'wedding', 'birthday', 'anniversary', 'baby_shower', 'housewarming', 'party', 'religious', 'family_celebration', 'other'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setThemeCategoryFilter(cat); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition ${
                          themeCategoryFilter === cat
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {cat.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Themes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {themesList.map((t) => (
                    <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {t.category.replace('_', ' ')}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            t.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {t.isActive ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mb-1">{t.name}</h4>
                        <p className="text-[11px] font-mono text-slate-400 mb-2">slug: {t.slug}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4">{t.description || 'Premium interactive invitation theme'}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          Used in <strong className="text-white">{t._count?.invitations || 0}</strong> invites
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/admin/studio/${t.id}`}
                            title="Edit in Template Studio"
                            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                          >
                            <span>✏️</span>
                            <span>Studio</span>
                          </Link>
                          <button
                            title="Export JSON Manifest"
                            onClick={() => handleExportTheme(t)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                          >
                            💾
                          </button>
                          <Link
                            to={`/templates/${t.slug}/preview`}
                            target="_blank"
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                          >
                            Preview
                          </Link>
                          <button
                            onClick={() => handleToggleThemeActive(t.id, t.isActive)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                              t.isActive
                                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            }`}
                          >
                            {t.isActive ? 'Disable' : 'Enable'}
                          </button>
                          {(!t._count || t._count.invitations === 0) && (
                            <button
                              title="Delete Template"
                              onClick={() => handleDeleteTheme(t.id, t.name)}
                              className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs rounded-lg transition cursor-pointer"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Template Import Modal */}
      <TemplateImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(count) => {
          showToast(`Successfully imported ${count} template(s)!`);
          fetchThemes();
        }}
      />
    </div>
  );
}
