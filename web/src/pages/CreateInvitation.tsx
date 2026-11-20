import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';

const OCCASION_TYPES = [
  { value: 'wedding', label: 'Wedding', icon: '💒', desc: 'Luxury multi-event wedding suites & traditions' },
  { value: 'birthday', label: 'Birthday', icon: '🎂', desc: 'Milestone celebrations, kids parties & soirées' },
  { value: 'anniversary', label: 'Anniversary', icon: '💝', desc: 'Silver, golden & romantic milestones' },
  { value: 'baby_shower', label: 'Baby Shower', icon: '👶', desc: 'Warm blessings & starlight lullabies' },
  { value: 'housewarming', label: 'Housewarming', icon: '🏠', desc: 'Griha Pravesh & new home celebrations' },
  { value: 'party', label: 'Party', icon: '🎉', desc: 'Cocktail evenings, retro disco & VIP bashes' },
  { value: 'religious', label: 'Religious Celebration', icon: '🙏', desc: 'Poojas, Kirtans, Communions & Eid Galas' },
  { value: 'family_celebration', label: 'Family Celebration', icon: '👨‍👩‍👧‍👦', desc: 'Reunions, picnics & Diwali Milan' },
  { value: 'other', label: 'Other', icon: '✨', desc: 'Galas, summits, honors & special gatherings' },
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

  // Check for pre-selected template, occasion, and title from preview/storage
  useEffect(() => {
    const preselectedTemplate = sessionStorage.getItem('selectedTemplate');
    const preselectedOccasion = sessionStorage.getItem('selectedOccasion');
    const preselectedThemeId = sessionStorage.getItem('selectedThemeId');
    const preselectedTitle = sessionStorage.getItem('invitationTitle');

    if (preselectedTemplate) {
      setSelectedTemplate(preselectedTemplate);
    }

    if (preselectedOccasion) {
      setOccasionType(preselectedOccasion);
    }

    if (preselectedThemeId) {
      setSelectedThemeId(preselectedThemeId);
    }

    if (preselectedTitle) {
      setTitle(preselectedTitle);
    }
  }, []);

  const handleCategorySelect = (categoryValue: string) => {
    setOccasionType(categoryValue);
    if (title.trim()) {
      sessionStorage.setItem('invitationTitle', title.trim());
    }
    sessionStorage.setItem('selectedOccasion', categoryValue);
    // Explicitly navigate to the category templates page as requested
    navigate(`/templates?category=${categoryValue}`);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (newTitle.trim()) {
      sessionStorage.setItem('invitationTitle', newTitle.trim());
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // If no template is selected yet, redirect to category templates page
    if (!selectedTemplate) {
      if (occasionType) {
        handleCategorySelect(occasionType);
      } else {
        navigate('/templates');
      }
      return;
    }

    // Client-side validation
    if (!title.trim() || !occasionType) {
      setError('Please provide an invitation title');
      return;
    }

    if (title.trim().length < 3) {
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
        title: title.trim(),
        occasionType,
      };

      if (selectedTemplate) {
        payload.themeId = selectedTemplate;
      } else if (selectedThemeId) {
        payload.themeId = selectedThemeId;
      }

      const response = await api.post('/api/host/invitations', payload);

      // Clear session storage on successful creation
      sessionStorage.removeItem('selectedTemplate');
      sessionStorage.removeItem('selectedOccasion');
      sessionStorage.removeItem('selectedThemeId');
      sessionStorage.removeItem('invitationTitle');

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2 text-slate-400 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium text-sm">Back to Dashboard</span>
            </Link>
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
              InviteHub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Step Indicator */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                !selectedTemplate ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20' : 'bg-emerald-500 text-white'
              }`}>
                {selectedTemplate ? '✓' : '1'}
              </span>
              <span className={`text-xs font-medium ${!selectedTemplate ? 'text-amber-400' : 'text-slate-300'}`}>
                1. Select Category
              </span>
            </div>
            <div className={`h-0.5 flex-1 mx-3 ${selectedTemplate ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
            <div className="flex items-center space-x-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                selectedTemplate ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20' : 'bg-slate-800 text-slate-500'
              }`}>
                2
              </span>
              <span className={`text-xs font-medium ${selectedTemplate ? 'text-amber-400' : 'text-slate-500'}`}>
                2. Choose Template
              </span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-slate-800" />
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span className="text-xs font-medium text-slate-500">
                3. Customize
              </span>
            </div>
          </div>
        </div>

        {/* STATE A: A Template has already been selected */}
        {selectedTemplate ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">
                Step 2 Complete • Design Selected
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-2 font-serif">
                Name Your Invitation
              </h1>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Give your invitation a title to start customizing your guests, itinerary, and venue details.
              </p>
            </div>

            {/* Template Summary Card */}
            <div className="mb-8 p-5 bg-slate-950/80 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-2xl shadow-lg">
                  {OCCASION_TYPES.find(o => o.value === occasionType)?.icon || '✨'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Selected Design</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 capitalize">
                      {occasionType.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {TEMPLATE_NAMES[selectedTemplate] || selectedTemplate}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/templates?category=${occasionType || 'all'}`)}
                  className="px-4 py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition"
                >
                  Change Template ↻
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="title-input" className="block text-sm font-semibold text-slate-200 mb-2">
                  Invitation Title <span className="text-rose-400">*</span>
                </label>
                <input
                  id="title-input"
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Sarah & James Wedding, Aarav's 30th Birthday Bash"
                  disabled={loading}
                  autoFocus
                  maxLength={255}
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-base"
                />
                <p className="mt-2 text-xs text-slate-400">
                  This will be the main title displayed on your live invitation and guest gate screen.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(null);
                    sessionStorage.removeItem('selectedTemplate');
                    sessionStorage.removeItem('selectedThemeId');
                  }}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition"
                >
                  ← Pick Different Occasion
                </button>

                <button
                  type="submit"
                  disabled={loading || !title.trim() || title.trim().length < 3}
                  className="px-7 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Invitation...</span>
                    </span>
                  ) : (
                    <span>Create Invitation & Open Editor →</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* STATE B: User is picking an Occasion Category */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">
                Step 1 • Select Category
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-2 font-serif">
                Select Your Occasion
              </h1>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Pick the type of event you are hosting. We will immediately navigate you to our handcrafted templates tailored for that occasion.
              </p>
            </div>

            {/* Optional Title Input */}
            <div className="max-w-xl mx-auto mb-10">
              <label htmlFor="pre-title-input" className="block text-xs font-semibold text-slate-300 mb-2">
                Event Title <span className="text-slate-500 font-normal">(Optional for now, e.g. "Aarav's 30th Birthday")</span>
              </label>
              <input
                id="pre-title-input"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter event name or leave blank to decide later"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
              />
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {OCCASION_TYPES.map((occasion) => (
                <button
                  key={occasion.value}
                  type="button"
                  onClick={() => handleCategorySelect(occasion.value)}
                  className="group relative p-6 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl text-left transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                      {occasion.icon}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {occasion.label}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {occasion.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>Browse {occasion.label} Templates</span>
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Browse All Link */}
            <div className="mt-10 text-center pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-400">
                Want to explore the entire catalog across all categories?{' '}
                <Link to="/templates" className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4">
                  Browse All Templates →
                </Link>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
