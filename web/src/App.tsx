import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import Home from './pages/Home';
import Landing from './pages/Landing';
import TemplateGallery from './pages/TemplateGallery';
import TemplatePreview from './pages/TemplatePreview';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateInvitation from './pages/CreateInvitation';
import InvitationEditor from './pages/InvitationEditor';
import Editor from './pages/Editor';
import PublishedSite from './pages/PublishedSite';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import TemplateStudio from './pages/admin/TemplateStudio';
import PublicInvitationView from './pages/PublicInvitationView';

declare global {
  interface Window {
    __SITE_DATA__?: {
      slug: string;
      templateId: string;
      data: any;
    };
    __PAGE_DATA__?: any;
  }
}

function App() {
  // Check if this is a published site (has site data injected)
  const siteData = window.__SITE_DATA__;
  
  if (siteData) {
    return <PublishedSite data={siteData} />;
  }
  
  // Main app routing
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/old-landing" element={<Landing />} />
          <Route path="/templates" element={<TemplateGallery />} />
          <Route path="/templates/:slug" element={<TemplatePreview />} />
          <Route path="/templates/:slug/preview" element={<TemplatePreview />} />
          <Route path="/templates/:slug/use" element={<TemplatePreview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invitations/new"
            element={
              <ProtectedRoute>
                <CreateInvitation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invitations/:id/edit"
            element={
              <ProtectedRoute>
                <InvitationEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invitations/:id"
            element={
              <ProtectedRoute>
                <InvitationEditor />
              </ProtectedRoute>
            }
          />
          <Route path="/i/new" element={<Navigate to="/invitations/new" replace />} />
          <Route path="/i/:slug" element={<PublicInvitationView />} />
          <Route path="/invites/:slug" element={<PublicInvitationView />} />
          <Route path="/edit/:token" element={<Editor />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/studio"
            element={
              <AdminProtectedRoute>
                <TemplateStudio />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/studio/:id"
            element={
              <AdminProtectedRoute>
                <TemplateStudio />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a href="/" className="btn btn-primary">
          Go Home
        </a>
      </div>
    </div>
  );
}

export default App;
