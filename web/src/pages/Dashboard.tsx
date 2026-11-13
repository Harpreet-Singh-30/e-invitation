import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import PaymentModal from '../components/PaymentModal';

interface Invitation {
  id: string;
  title: string;
  slug: string;
  occasionType: string;
  isPublished: boolean;
  isLive: boolean;
  createdAt: string;
  stats: {
    eventCount: number;
    guestCount: number;
  };
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePaymentInvitation, setActivePaymentInvitation] = useState<Invitation | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/host/invitations');
      setInvitations(response.data.invitations);
    } catch (err: any) {
      console.error('Failed to fetch invitations:', err);
      setError('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getOccasionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'wedding':
        return '💒';
      case 'birthday':
        return '🎂';
      case 'anniversary':
        return '💝';
      case 'baby_shower':
        return '👶';
      case 'housewarming':
        return '🏠';
      case 'party':
        return '🎉';
      case 'religious':
        return '🙏';
      default:
        return '✨';
    }
  };

  const getOccasionLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const stats = {
    total: invitations.length,
    published: invitations.filter(i => i.isPublished).length,
    draft: invitations.filter(i => !i.isPublished).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out z-30`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent hover:opacity-90 transition block">
              InviteHub
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 text-gray-900 bg-rose-50 rounded-lg font-medium"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/invitations/new"
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              <span>➕</span>
              <span>Create Invitation</span>
            </Link>
            <Link
              to="/templates"
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              <span>✨</span>
              <span>Browse Templates</span>
            </Link>
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              <span>🏠</span>
              <span>Home Page</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-purple-500 flex items-center justify-center text-white font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600 mt-1">Manage your invitations and create new ones</p>
            </div>
            <Link
              to="/invitations/new"
              className="hidden sm:flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 transition"
            >
              <span>➕</span>
              <span>Create Invitation</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Invitations</h3>
                <span className="text-2xl">📨</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Published</h3>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Drafts</h3>
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
            </div>
          </div>

          {/* Invitations List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Invitations</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading invitations...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchInvitations}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                >
                  Try Again
                </button>
              </div>
            ) : invitations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No invitations yet</h3>
                <p className="text-gray-600 mb-6">Create your first invitation to get started</p>
                <Link
                  to="/invitations/new"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 transition"
                >
                  <span>➕</span>
                  <span>Create Your First Invitation</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="p-6 hover:bg-gray-50/80 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1.5">
                          <span className="text-2xl">{getOccasionIcon(invitation.occasionType)}</span>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{invitation.title}</h3>
                            <p className="text-xs text-gray-500 font-medium">{getOccasionLabel(invitation.occasionType)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
                          <span>📅 {invitation.stats.eventCount} events</span>
                          <span>👥 {invitation.stats.guestCount} guests</span>
                          {invitation.isPublished ? (
                            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-mono text-[11px] border border-emerald-200">
                              <span>🔗 /i/{invitation.slug}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(`${window.location.origin}/i/${invitation.slug}`);
                                  setCopiedSlug(invitation.slug);
                                  setTimeout(() => setCopiedSlug(null), 2500);
                                }}
                                className="text-emerald-700 hover:text-emerald-900 font-bold ml-1 hover:underline"
                              >
                                {copiedSlug === invitation.slug ? '✓ Copied' : 'Copy'}
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-slate-400">🔗 Slug: {invitation.slug}</span>
                          )}
                        </div>
                      </div>

                      {/* Right: Status & Actions */}
                      <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                        {invitation.isPublished ? (
                          <>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              ✓ Live Site
                            </span>

                            <a
                              href={`/i/${invitation.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                            >
                              <span>Open Site</span>
                              <span>↗</span>
                            </a>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Draft (Unpublished)
                            </span>

                            <button
                              type="button"
                              onClick={() => setActivePaymentInvitation(invitation)}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 rounded-lg text-xs font-extrabold transition shadow-sm flex items-center gap-1 cursor-pointer"
                            >
                              <span>🚀 Pay &amp; Publish</span>
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => navigate(`/invitations/${invitation.id}/edit`)}
                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                        >
                          <span>✏️ Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Payment Gateway Modal */}
      {activePaymentInvitation && (
        <PaymentModal
          isOpen={Boolean(activePaymentInvitation)}
          onClose={() => setActivePaymentInvitation(null)}
          invitationId={activePaymentInvitation.id}
          invitationTitle={activePaymentInvitation.title}
          invitationSlug={activePaymentInvitation.slug}
          occasionType={activePaymentInvitation.occasionType}
          onPaymentSuccess={() => {
            fetchInvitations();
          }}
        />
      )}
    </div>
  );
}
