import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';

const OCCASION_TYPES = [
  { value: 'wedding', label: 'Wedding', icon: '💒' },
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'anniversary', label: 'Anniversary', icon: '💝' },
  { value: 'baby_shower', label: 'Baby Shower', icon: '👶' },
  { value: 'housewarming', label: 'Housewarming', icon: '🏠' },
  { value: 'party', label: 'Party', icon: '🎉' },
  { value: 'religious', label: 'Religious Celebration', icon: '🙏' },
  { value: 'family_celebration', label: 'Family Celebration', icon: '👨‍👩‍👧‍👦' },
  { value: 'other', label: 'Other', icon: '✨' },
];

const TEMPLATE_NAMES: Record<string, string> = {
  'art-deco-noir': 'Art Deco Noir',
  'imperial-burgundy': 'Imperial Burgundy',
  'botanical-romance': 'Botanical Romance',
  'phulkari-celebration': 'Phulkari Celebration',
  'coastal-pearl': 'Coastal Pearl',
  'ivory-kayal': 'Ivory Kayal',
  'marigold-courtyard': 'Marigold Courtyard',
  'midnight-vows': 'Midnight Vows',
  // Birthday
  'golden-milestone': 'Golden Milestone Soirée',
  'retro-synth-arcade': 'Neon 80s Arcade Blast',
  'enchanted-storybook-birthday': 'Enchanted Storybook Garden',
  'safari-wild-one': 'Safari Little Explorer',
  'vintage-distillery-milestone': 'Aged to Perfection',
  'birthday-joy': 'Golden Milestone Soirée',
  // Anniversary
  'silver-jubilee': 'Silver Jubilee Elegance',
  'golden-jubilee-50th': '50th Golden Jubilee',
  'ruby-romance-40th': 'Ruby Romance 40th',
  'boho-sunset-vows': 'Bohemian Sunset Vows',
  'monochrome-film-noir-anniversary': 'Cinematic Noir Anniversary',
  // Baby Shower
  'celestial-lullaby': 'Celestial Lullaby',
  'woodland-fable-shower': 'Woodland Fable Shower',
  'royal-little-prince-princess': 'Royal Nursery Crown',
  'sunshine-meadow-shower': 'Here Comes The Sun',
  'boho-rainbow-miracle': 'Boho Rainbow Miracle',
  // Housewarming
  'hearth-heritage': 'Hearth & Heritage',
  'scandi-minimal-haven': 'Scandi Minimalist Sanctuary',
  'rajasthani-jharokha-griha': 'Rajasthani Jharokha Griha',
  'urban-terrace-soiree': 'Urban Terrace Loft',
  'coastal-breeze-home': 'Coastal Sea Breeze Haven',
  // Party
  'midnight-soiree': 'Velvet Midnight Soirée',
  'tropical-sunset-luau': 'Tropical Sunset Luau',
  'studio54-disco-glam': 'Studio 54 Disco Glam',
  'speakeasy-roaring-twenties': 'Roaring 20s Speakeasy',
  'poolside-sun-drenched-bash': 'Palm Springs Poolside Bash',
  // Religious
  'divya-mandap': 'Divya Mandap',
  'shree-ganesh-vandana': 'Shree Ganesh Sthapana',
  'waheguru-anand-blessings': 'Akhand Path & Kirtan Darbar',
  'cathedral-grace-communion': 'Sacred Holy Communion',
  'noor-e-mehfil-nikah-eid': 'Noor-e-Mehfil Islamic Gala',
  // Family Celebration
  'heritage-reunion': 'Heritage Family Reunion',
  'vintage-roots-family-archive': 'Vintage Roots Family Archive',
  'sunlit-picnic-carnival': 'Sunlit Lawn Carnival',
  'festive-diwali-family-milan': 'Diwali Sneh Milan',
  'generations-anchored-reunion': 'Nautical Generations Anchorage',
  // Other
  'aura-grand-gala': 'Aura Grand Gala',
  'commencement-excellence': 'Commencement Academic Honors',
  'philanthropy-crystal-ball': 'Crystal Philanthropy Ball',
  'tech-summit-future-vision': 'Executive Tech Vision Summit',
  'bon-voyage-wanderlust': 'Bon Voyage & Wanderlust',
  // Legacy
  'royal-maroon': 'Imperial Burgundy (Legacy)',
  'modern-floral': 'Botanical Romance (Legacy)',
  'classic-gold': 'Art Deco Noir (Legacy)',
};

export default function CreateInvitation() {
  const [title, setTitle] = useState('');
  const [occasionType, setOccasionType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check for pre-selected template and occasion from preview
  useEffect(() => {
    const preselectedTemplate = sessionStorage.getItem('selectedTemplate');
    const preselectedOccasion = sessionStorage.getItem('selectedOccasion');
    const preselectedThemeId = sessionStorage.getItem('selectedThemeId');
    
    if (preselectedTemplate) {
      setSelectedTemplate(preselectedTemplate);
    }
    
    if (preselectedOccasion) {
      setOccasionType(preselectedOccasion);
    }

    if (preselectedThemeId) {
      setSelectedThemeId(preselectedThemeId);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!title || !occasionType) {
      setError('Please fill in all required fields');
      return;
    }

    if (title.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    if (title.length > 255) {
      setError('Title must be less than 255 characters');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        title,
        occasionType,
      };

      // Include themeId or selectedTemplate as themeId
      if (selectedThemeId) {
        payload.themeId = selectedThemeId;
      } else if (selectedTemplate) {
        payload.themeId = selectedTemplate;
      }

      const response = await api.post('/api/host/invitations', payload);

      // Clear the session storage after successful creation
      sessionStorage.removeItem('selectedTemplate');
      sessionStorage.removeItem('selectedOccasion');
      sessionStorage.removeItem('selectedThemeId');

      // Redirect to editor for the newly created invitation
      const invitationId = response.data.invitation.id;
      navigate(`/invitations/${invitationId}/edit`, { replace: true });
    } catch (err: any) {
      console.error('Create invitation error:', err);
      const message = err.response?.data?.message || 'Failed to create invitation. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              InviteHub
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Create New Invitation</h1>
          <p className="text-lg text-gray-600">Choose an occasion and give your invitation a title</p>
        </div>

        {selectedTemplate && (
          <div className="mb-8 bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Template Selected</p>
                <p className="text-sm text-gray-600">{TEMPLATE_NAMES[selectedTemplate] || selectedTemplate}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedTemplate(null);
                sessionStorage.removeItem('selectedTemplate');
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Invitation Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-semibold text-gray-900 mb-3">
                Invitation Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                placeholder="e.g., Sarah & James Wedding"
                disabled={loading}
                autoFocus
                maxLength={255}
              />
              <p className="mt-2 text-sm text-gray-500">
                This will be the main heading of your invitation
              </p>
            </div>

            {/* Occasion Type */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Occasion Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {OCCASION_TYPES.map((occasion) => (
                  <button
                    key={occasion.value}
                    type="button"
                    onClick={() => setOccasionType(occasion.value)}
                    disabled={loading}
                    className={`relative p-6 rounded-xl border-2 transition ${
                      occasionType === occasion.value
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{occasion.icon}</div>
                      <div className="font-medium text-gray-900">{occasion.label}</div>
                    </div>
                    {occasionType === occasion.value && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                to="/dashboard"
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !title || !occasionType}
                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </span>
                ) : (
                  'Create Invitation'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            You'll be able to add events, guests, and customize your invitation after creation
          </p>
        </div>
      </main>
    </div>
  );
}
