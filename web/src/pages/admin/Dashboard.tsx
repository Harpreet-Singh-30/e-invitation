import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/admin/me');
      setUser(response.data.user);
    } catch (err) {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/admin/logout');
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Logged in as {user?.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/payments">Payments</NavLink>
            <NavLink to="/admin/orders">Orders</NavLink>
            <NavLink to="/admin/sites">Sites</NavLink>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="payments" element={<PaymentsView />} />
          <Route path="orders" element={<OrdersView />} />
          <Route path="sites" element={<SitesView />} />
          <Route path="/" element={<DashboardView />} />
        </Routes>
      </main>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="py-4 border-b-2 border-transparent hover:border-primary-600 transition-colors"
    >
      {children}
    </Link>
  );
}

function DashboardView() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get('/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>Failed to load stats</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Overview</h2>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.orders.total} />
        <StatCard title="Published Sites" value={stats.orders.published} color="green" />
        <StatCard title="Pending Payments" value={stats.payments.pending} color="yellow" />
        <StatCard title="Revenue" value={`₹${stats.revenue.totalRupees.toLocaleString()}`} color="blue" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Orders by State</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Draft</span><span className="font-bold">{stats.orders.draft}</span></div>
            <div className="flex justify-between"><span>Prebooked</span><span className="font-bold">{stats.orders.prebooked}</span></div>
            <div className="flex justify-between"><span>Purchased</span><span className="font-bold">{stats.orders.purchased}</span></div>
            <div className="flex justify-between"><span>Published</span><span className="font-bold">{stats.orders.published}</span></div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Templates</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Available</span><span className="font-bold text-green-600">{stats.templates.available}</span></div>
            <div className="flex justify-between"><span>Reserved</span><span className="font-bold text-yellow-600">{stats.templates.reserved}</span></div>
            <div className="flex justify-between"><span>Sold</span><span className="font-bold text-red-600">{stats.templates.sold}</span></div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Payments</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Pending</span><span className="font-bold text-yellow-600">{stats.payments.pending}</span></div>
            <div className="flex justify-between"><span>Verified</span><span className="font-bold text-green-600">{stats.payments.verified}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentsView() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await axios.get('/admin/payments');
      setPayments(response.data.payments);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (paymentId: number) => {
    if (!confirm('Confirm that you have verified this payment in your bank/UPI app?')) {
      return;
    }

    try {
      await axios.post(`/admin/payments/${paymentId}/verify`);
      alert('Payment verified!');
      loadPayments();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to verify payment');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Pending Payments</h2>

      {payments.length === 0 ? (
        <div className="card text-center text-gray-600">No pending payments</div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="card">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">Payment #{payment.id}</div>
                  <div className="font-bold text-xl">₹{payment.amountRupees}</div>
                  <div className="text-sm">{payment.paymentType} - {payment.method}</div>
                  <div className="text-sm text-gray-600">Ref: {payment.referenceId}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Customer: {payment.email} • {payment.phone}
                    {payment.groomName && payment.brideName && (
                      <> • {payment.groomName} & {payment.brideName}</>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Template: {payment.templateName}</div>
                </div>
                <button onClick={() => handleVerify(payment.id)} className="btn btn-primary">
                  Verify Payment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersView() {
  return <div className="card">Orders view - Coming soon</div>;
}

function SitesView() {
  return <div className="card">Sites view - Coming soon</div>;
}

function StatCard({ title, value, color = 'primary' }: { title: string; value: any; color?: string }) {
  const colors: Record<string, string> = {
    primary: 'bg-primary-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    blue: 'bg-blue-600'
  };

  return (
    <div className="card">
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className={`text-3xl font-bold ${colors[color] ? 'text-' + color + '-600' : 'text-primary-600'}`}>
        {value}
      </div>
    </div>
  );
}
