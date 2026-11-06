import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Editor from './pages/Editor';
import PublishedSite from './pages/PublishedSite';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/edit/:token" element={<Editor />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
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
