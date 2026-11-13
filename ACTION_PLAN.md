# 🚀 IMMEDIATE ACTION PLAN

**Date:** November 6, 2026, 4:40 PM IST  
**Status:** Backend ✅ Ready | Frontend ⚠️ Needs Migration  
**Goal:** Connect frontend to backend and create working MVP

---

## 🎯 EXECUTIVE SUMMARY

**We are on the RIGHT PATH!** ✅

The backend is production-ready with excellent architecture. The challenge now is **frontend migration** from OLD to NEW business model.

**What's Working:**
- ✅ PostgreSQL database (16 tables)
- ✅ JWT authentication (7 endpoints)
- ✅ Security infrastructure
- ✅ Complete documentation

**What's Missing:**
- ❌ Frontend authentication integration
- ❌ Host dashboard
- ❌ 42 API endpoints (invitation, guest, RSVP, etc.)

**Timeline to MVP:** 14 weeks remaining (realistic)

---

## ⚡ THIS WEEK (Week 3): Frontend Authentication

**GOAL:** Connect React frontend to working auth backend

### Task 1: Create Authentication Context (4-6 hours)

**File:** `web/src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subscriptionTier: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedUser = localStorage.getItem('user');

    if (savedAccessToken && savedUser) {
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!accessToken) return;

    // Refresh 5 minutes before expiry (token lasts 1 hour)
    const interval = setInterval(() => {
      refreshTokenFunc();
    }, 55 * 60 * 1000); // 55 minutes

    return () => clearInterval(interval);
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      email,
      password,
    });

    const { user, accessToken, refreshToken } = response.data;

    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
      email,
      password,
      name,
    });

    const { user, accessToken, refreshToken } = response.data;

    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const refreshTokenFunc = async () => {
    if (!refreshToken) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
        refreshToken,
      });

      const { accessToken: newAccessToken } = response.data;
      setAccessToken(newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);
    } catch (error) {
      // Refresh token invalid, logout
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, signup, logout, refreshToken: refreshTokenFunc }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Task 2: Create Axios Interceptor (1 hour)

**File:** `web/src/lib/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Task 3: Create Signup Page (2 hours)

**File:** `web/src/pages/Signup.tsx`

```typescript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">Create Your Account</h1>
        <p className="text-gray-600 text-center mb-6">Start creating beautiful invitations</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="input"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="input"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="input"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be 8+ characters with uppercase, lowercase, and number
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### Task 4: Create Login Page (2 hours)

**File:** `web/src/pages/Login.tsx`

```typescript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-6">Log in to your account</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="input"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="input"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-primary-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">Or test with:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>test@example.com / test123</p>
            <p>free@example.com / free123</p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### Task 5: Create Protected Route (30 mins)

**File:** `web/src/components/ProtectedRoute.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredTier?: string;
}

export default function ProtectedRoute({ children, requiredRole, requiredTier }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredTier && user.subscriptionTier !== requiredTier) {
    return <Navigate to="/upgrade" replace />;
  }

  return <>{children}</>;
}
```

### Task 6: Update App.tsx with New Routes (30 mins)

**File:** `web/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected pages (to be created)
import Dashboard from './pages/Dashboard';

// Guest pages
import PublishedSite from './pages/PublishedSite';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Guest invitation view */}
          <Route path="/invite/:slug/:token" element={<PublishedSite />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="text-xl text-gray-600 mt-4">Page not found</p>
        <a href="/" className="btn btn-primary mt-6">Go Home</a>
      </div>
    </div>
  );
}

export default App;
```

### Task 7: Create Basic Dashboard (2 hours)

**File:** `web/src/pages/Dashboard.tsx`

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.subscriptionTier} Plan</p>
            </div>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Invitations" value="0" icon="📨" />
          <StatCard title="Total Guests" value="0" icon="👥" />
          <StatCard title="RSVPs" value="0" icon="✅" />
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard!</h2>
          <p className="text-gray-600 mb-6">
            You haven't created any invitations yet. Let's get started!
          </p>
          <button className="btn btn-primary" disabled>
            Create Your First Invitation (Coming Soon)
          </button>
          <p className="text-xs text-gray-500 mt-4">
            Note: This is a basic dashboard. Full features coming in next phase.
          </p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
```

### Task 8: Update Landing Page (1 hour)

**File:** `web/src/pages/Landing.tsx` (update hero section)

```typescript
// Replace the existing hero section buttons with:
<div className="flex gap-4 justify-center">
  <a href="/signup" className="btn btn-primary text-lg">
    Get Started Free
  </a>
  <a href="/login" className="btn btn-outline text-lg">
    Log In
  </a>
</div>
```

---

## ✅ TESTING CHECKLIST

After completing above tasks, test these flows:

1. **Signup Flow:**
   - [ ] Visit http://localhost:5173/signup
   - [ ] Create new account
   - [ ] Should redirect to /dashboard
   - [ ] Should see user name in header

2. **Login Flow:**
   - [ ] Visit http://localhost:5173/login
   - [ ] Login with test@example.com / test123
   - [ ] Should redirect to /dashboard
   - [ ] Should see "Pro Plan" in header

3. **Protected Routes:**
   - [ ] Logout
   - [ ] Try to visit /dashboard
   - [ ] Should redirect to /login

4. **Token Refresh:**
   - [ ] Login and stay logged in
   - [ ] Wait 1 hour (or mock token expiry)
   - [ ] Make an API call
   - [ ] Should auto-refresh token

5. **Logout:**
   - [ ] Click logout
   - [ ] Should redirect to /login
   - [ ] localStorage should be cleared

---

## 📅 NEXT WEEK (Week 4): Invitation APIs

### Backend: Create Invitation CRUD Endpoints

**File:** `server/src/routes/invitations.ts`

Implement these endpoints:
```typescript
POST   /api/host/invitations - Create invitation
GET    /api/host/invitations - List user's invitations
GET    /api/host/invitations/:id - Get single invitation
PUT    /api/host/invitations/:id - Update invitation
DELETE /api/host/invitations/:id - Delete invitation
PATCH  /api/host/invitations/:id/publish - Publish/unpublish
```

### Frontend: Create Invitation Management UI

Pages to build:
```
/invitations - List view
/invitations/new - Create wizard
/invitations/:id - Edit page
```

**Estimated time:** 3-4 days

---

## 🎯 SUCCESS CRITERIA

### End of Week 3:
- ✅ Users can signup via UI
- ✅ Users can login via UI
- ✅ Dashboard accessible after login
- ✅ Logout works
- ✅ Token refresh automatic
- ✅ Protected routes work

### End of Week 4:
- ✅ Users can create invitations
- ✅ Users can see list of invitations
- ✅ Users can edit invitation details
- ✅ Users can publish/unpublish
- ✅ Users can delete invitations

---

## 📊 PROGRESS TRACKING

**Overall Progress:**
- Week 0-2: ✅✅ Backend foundation (complete)
- Week 3: ⏳ Frontend auth (this week)
- Week 4: ⏳ Invitation APIs
- Week 5-16: ⏳ Remaining features

**Current Status:** 12% → 20% (after this week)

---

## 💡 TIPS FOR SUCCESS

1. **Focus on functionality first, polish later**
   - Get signup/login working
   - Don't spend time on animations yet

2. **Test as you build**
   - Test each component as you finish it
   - Use test accounts to verify flows

3. **Reuse existing components**
   - Copy button/input styles from old Landing page
   - Maintain consistent design

4. **Ask for help if stuck**
   - Documentation is comprehensive
   - Backend code has examples

5. **Commit frequently**
   - Commit after each task
   - Makes it easy to rollback if needed

---

## 🆘 TROUBLESHOOTING

### Common Issues:

**1. CORS Error:**
```
Solution: Check server/.env has CORS_ORIGIN="http://localhost:5173"
```

**2. 401 Unauthorized:**
```
Solution: Check token is being sent in Authorization header
```

**3. Token Expired:**
```
Solution: Implement auto-refresh logic (see axios interceptor)
```

**4. Can't access protected routes:**
```
Solution: Check ProtectedRoute wrapper is used correctly
```

---

## 📞 READY TO START?

**Everything is prepared:**
- ✅ Backend APIs working
- ✅ Database ready
- ✅ Code examples provided
- ✅ Test accounts available

**Start with Task 1** (AuthContext) and work through sequentially.

**Estimated completion:** 10-12 hours of focused work

**You've got this!** 🚀

---

**Document Version:** 1.0  
**Last Updated:** November 6, 2026, 4:45 PM IST  
**Status:** Ready to execute