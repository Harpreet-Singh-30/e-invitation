import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Editor() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [site, setSite] = useState<any>(null);
  const [schema, setSchema] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [slug, setSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    loadSite();
  }, [token]);

  const loadSite = async () => {
    try {
      const response = await axios.get(`/api/edit/${token}/site`);
      setSite(response.data.site);
      setSchema(response.data.schema);
      setOrder(response.data.order);
      setFormData(response.data.site.data);
      setSlug(response.data.site.slug || '');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load site');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/edit/${token}/site`, { data: formData });
      alert('Saved successfully!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSlugCheck = async () => {
    if (!slug || slug.length < 3) return;
    
    setSlugStatus('checking');
    try {
      const response = await axios.post(`/api/edit/${token}/slug`, {
        slug,
        action: 'check'
      });
      
      setSlugStatus(response.data.available ? 'available' : 'taken');
    } catch (err: any) {
      setSlugStatus('taken');
    }
  };

  const handleSlugClaim = async () => {
    try {
      const response = await axios.post(`/api/edit/${token}/slug`, {
        slug,
        action: 'claim'
      });
      
      alert(`Slug claimed! Your URL: ${response.data.url}`);
      setSite({ ...site, slug: response.data.slug });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to claim slug');
    }
  };

  const handlePublish = async () => {
    if (!site?.slug) {
      alert('Please claim a subdomain first!');
      return;
    }

    if (!confirm('Ready to publish? Your site will go live immediately.')) {
      return;
    }

    try {
      const response = await axios.post(`/api/edit/${token}/publish`);
      alert(`Published! ${response.data.url}`);
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to publish');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Edit Your Invitation</h1>
            <p className="text-sm text-gray-600">Order #{order.id} • {order.state}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn btn-secondary">
              {saving ? 'Saving...' : 'Save'}
            </button>
            {order.canPublish && (
              <button onClick={handlePublish} className="btn btn-primary">
                Publish Site
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Form */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Couple Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Groom's Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.couple?.groom || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      couple: { ...formData.couple, groom: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Bride's Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.couple?.bride || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      couple: { ...formData.couple, bride: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tagline</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Two Hearts, One Soul"
                    value={formData.couple?.tagline || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      couple: { ...formData.couple, tagline: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Welcome Message</h2>
              <textarea
                className="input"
                rows={4}
                placeholder="We invite you to share in our joy..."
                value={formData.message || ''}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Choose Your URL</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subdomain</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="rahul-priya"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value.toLowerCase());
                        setSlugStatus('idle');
                      }}
                      disabled={!!site?.slug}
                    />
                    {!site?.slug && (
                      <button onClick={handleSlugCheck} className="btn btn-secondary">
                        Check
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Your URL will be: <span className="font-mono">{slug || 'your-name'}.example.com</span>
                  </p>
                  
                  {slugStatus === 'checking' && (
                    <p className="text-sm text-gray-600 mt-2">Checking...</p>
                  )}
                  {slugStatus === 'available' && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 mb-2">✓ Available!</p>
                      <button onClick={handleSlugClaim} className="btn btn-primary">
                        Claim This URL
                      </button>
                    </div>
                  )}
                  {slugStatus === 'taken' && (
                    <p className="text-sm text-red-600 mt-2">✗ Not available, try another</p>
                  )}
                  
                  {site?.slug && (
                    <p className="text-sm text-green-600 mt-2">✓ Claimed: {site.slug}</p>
                  )}
                </div>
              </div>
            </div>

            {!order.canPublish && (
              <div className="card bg-yellow-50 border-2 border-yellow-200">
                <h3 className="font-semibold text-yellow-900 mb-2">Payment Required</h3>
                <p className="text-sm text-yellow-800">
                  Complete your payment to publish your site. Check your email for payment instructions.
                </p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Preview</h2>
              <div className="aspect-[9/16] bg-gradient-to-br from-primary-100 to-gold-100 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <h1 className="text-4xl font-script mb-2">
                    {formData.couple?.groom || 'Groom'} & {formData.couple?.bride || 'Bride'}
                  </h1>
                  <p className="text-lg mb-8">{formData.couple?.tagline || 'Two Hearts, One Soul'}</p>
                  <div className="text-sm text-gray-600">
                    {formData.message || 'Your welcome message will appear here...'}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                This is a simplified preview. Your actual site will look better!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
