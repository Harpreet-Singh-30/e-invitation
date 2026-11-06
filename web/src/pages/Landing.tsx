import { useState, useEffect } from 'react';
import axios from 'axios';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  pricePaise: number;
  prebookPricePaise: number;
  priceRupees: number;
  prebookPriceRupees: number;
  demoSlug: string;
  posterImage: string;
  previewData: any;
}

export default function Landing() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await axios.get('/api/templates');
      setTemplates(response.data.templates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowOrderModal(true);
  };

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
    setShowPreviewModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <header className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Perfect Wedding
            <br />
            <span className="text-primary-600">Invitation Website</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose a beautiful template, customize it with your details, 
            and share your special day with loved ones.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#templates" className="btn btn-primary text-lg">
              Browse Templates
            </a>
            <a href="#how-it-works" className="btn btn-outline text-lg">
              How It Works
            </a>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon="🎨"
              title="Beautiful Templates"
              description="Professionally designed templates that look stunning on all devices"
            />
            <Feature
              icon="⚡"
              title="Quick Setup"
              description="Get your invitation site ready in minutes, not days"
            />
            <Feature
              icon="💰"
              title="Affordable"
              description="Starting at just ₹2,000 to reserve, ₹3,000 total"
            />
            <Feature
              icon="📱"
              title="WhatsApp Ready"
              description="Perfect previews when shared on WhatsApp and social media"
            />
            <Feature
              icon="🔒"
              title="Exclusive Design"
              description="Each template sold only once - your design stays unique"
            />
            <Feature
              icon="✏️"
              title="Easy to Edit"
              description="Simple form-based editor, no technical skills needed"
            />
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Choose Your Template</h2>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <p>No templates available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => handleSelectTemplate(template)}
                  onPreview={() => handlePreviewTemplate(template)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Step number="1" title="Choose" description="Select your favorite template from our collection" />
            <Step number="2" title="Pay" description="Reserve with ₹2,000 or buy directly for ₹3,000" />
            <Step number="3" title="Edit" description="Customize with your event details and photos" />
            <Step number="4" title="Share" description="Get your unique link and share with guests" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-4">© 2026 Wedding Invitations. All rights reserved.</p>
          <div className="flex gap-6 justify-center text-gray-400">
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/refund" className="hover:text-white">Refund Policy</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Order Modal */}
      {showOrderModal && selectedTemplate && (
        <OrderModal
          template={selectedTemplate}
          onClose={() => setShowOrderModal(false)}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TemplateCard({ template, onSelect, onPreview }: { template: Template; onSelect: () => void; onPreview: () => void }) {
  return (
    <div className="card group hover:shadow-xl transition-shadow">
      <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-gold-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        <div className="text-6xl">{getTemplateCategoryIcon(template.category)}</div>
      </div>
      <h3 className="text-2xl font-semibold mb-2">{template.name}</h3>
      <p className="text-gray-600 mb-4">{template.description}</p>
      <div className="mb-4">
        <div className="text-sm text-gray-500">Full Price</div>
        <div className="text-2xl font-bold text-primary-600">₹{template.priceRupees}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={onPreview} className="btn btn-outline flex-1 group-hover:scale-105 transition-transform">
          Preview
        </button>
        <button onClick={onSelect} className="btn btn-primary flex-1 group-hover:scale-105 transition-transform">
          Select
        </button>
      </div>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function OrderModal({ template, onClose }: { template: Template; onClose: () => void }) {
  const [orderType, setOrderType] = useState<'PREBOOK' | 'FULL'>('PREBOOK');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    groomName: '',
    brideName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/orders', {
        ...formData,
        templateId: template.id,
        orderType
      });

      setSuccess(true);
      setPaymentInstructions(response.data.paymentInstructions);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (success && paymentInstructions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-2xl font-bold mb-4">Payment Instructions</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">Order created successfully!</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono font-bold">#{paymentInstructions.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount to Pay</p>
              <p className="text-3xl font-bold text-primary-600">₹{paymentInstructions.amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Pay via UPI</p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-mono text-lg">{paymentInstructions.upiId}</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">{paymentInstructions.instructions}</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-6">
            After payment, submit your transaction ID on the next screen. We'll verify and send you the edit link within 24 hours.
          </div>
          
          <button onClick={onClose} className="btn btn-primary w-full">
            I've Made the Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold mb-4">Order {template.name}</h3>
        
        {/* Order Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Choose Payment Option</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`p-4 border-2 rounded-lg ${orderType === 'PREBOOK' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}
              onClick={() => setOrderType('PREBOOK')}
            >
              <div className="font-semibold">Reserve Now</div>
              <div className="text-2xl font-bold text-primary-600">₹{template.prebookPriceRupees}</div>
              <div className="text-xs text-gray-600 mt-1">Pay ₹1,000 later</div>
            </button>
            <button
              className={`p-4 border-2 rounded-lg ${orderType === 'FULL' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}
              onClick={() => setOrderType('FULL')}
            >
              <div className="font-semibold">Buy Now</div>
              <div className="text-2xl font-bold text-primary-600">₹{template.priceRupees}</div>
              <div className="text-xs text-gray-600 mt-1">One-time payment</div>
            </button>
          </div>
        </div>

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
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              className="input"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Groom's Name (Optional)</label>
            <input
              type="text"
              className="input"
              value={formData.groomName}
              onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bride's Name (Optional)</label>
            <input
              type="text"
              className="input"
              value={formData.brideName}
              onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PreviewModal({ template, onClose }: { template: Template; onClose: () => void }) {
  // Import templates dynamically
  const [TemplateComponent, setTemplateComponent] = useState<any>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        let component;
        switch (template.id) {
          case 'royal-maroon-01':
            component = (await import('../templates/royal-maroon-01/Template')).default;
            break;
          case 'modern-floral-02':
            component = (await import('../templates/modern-floral-02/Template')).default;
            break;
          case 'classic-gold-03':
            component = (await import('../templates/classic-gold-03/Template')).default;
            break;
          default:
            component = null;
        }
        setTemplateComponent(() => component);
      } catch (error) {
        console.error('Failed to load template:', error);
      }
    };
    loadTemplate();
  }, [template.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Template Header */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{template.name}</h2>
            <p className="text-sm text-gray-600">Preview Mode - Sample Data</p>
          </div>
          <button onClick={onClose} className="btn btn-secondary">
            Close Preview
          </button>
        </div>
      </div>

      {/* Template Preview */}
      <div className="bg-white">
        {TemplateComponent ? (
          <TemplateComponent data={template.previewData} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Loading preview...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getTemplateCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    traditional: '🪔',
    modern: '💐',
    classic: '👑',
    floral: '🌸'
  };
  return icons[category] || '💑';
}
