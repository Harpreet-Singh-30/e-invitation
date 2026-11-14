import { useState } from 'react';
import api from '../../lib/api';

interface TemplateImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
}

const SAMPLE_STARTER_TEMPLATE = {
  name: "Royal Tuscan Vineyard",
  slug: "royal-tuscan-vineyard",
  category: "wedding",
  description: "Sun-drenched Chianti hills, olive branch wreaths, rustic stone villa entrance, and acoustic mandolin serenades",
  templateComponent: "BotanicalRomanceTemplate",
  tags: ["tuscan", "vineyard", "rustic", "italy", "outdoor", "luxury"],
  priceTier: "premium",
  priceAmount: 59900,
  currency: "INR",
  isActive: true,
  isFeatured: true,
  previewImageUrl: "/templates/botanical-romance-preview.jpg",
  defaultColors: {
    primary: "#556B2F",
    secondary: "#C2A649",
    accent: "#D4AF37",
    background: "#FBF9F5",
    surface: "#FFFFFF",
    text: "#2C2C2A"
  },
  defaultFonts: {
    heading: "Cinzel",
    body: "Cormorant Garamond",
    accent: "Great Vibes"
  },
  features: [
    "animated_gate",
    "audio_player",
    "interactive_rsvp",
    "countdown",
    "event_schedule",
    "photo_gallery"
  ]
};

const CATEGORIES = [
  { id: 'wedding', label: 'Wedding 💒' },
  { id: 'birthday', label: 'Birthday 🎂' },
  { id: 'anniversary', label: 'Anniversary 💝' },
  { id: 'baby_shower', label: 'Baby Shower 👶' },
  { id: 'housewarming', label: 'Housewarming 🏠' },
  { id: 'party', label: 'Party 🎉' },
  { id: 'religious', label: 'Religious 🙏' },
  { id: 'family_celebration', label: 'Family Celebration 👨‍👩‍👧‍👦' },
  { id: 'other', label: 'Other 🎊' },
];

const ARCHETYPES = [
  { id: 'ImperialBurgundyTemplate', label: 'Imperial Burgundy (Grand Palace, Regal Heritage)' },
  { id: 'BotanicalRomanceTemplate', label: 'Botanical Romance (Floral, Garden, Rustic)' },
  { id: 'ArtDecoNoirTemplate', label: 'Art Deco Noir (1920s Gatsby, Dark Obsidian Gold)' },
  { id: 'PhulkariCelebrationTemplate', label: 'Phulkari Celebration (Festive, Cross-stitch, Colorful)' },
  { id: 'CoastalPearlTemplate', label: 'Coastal Pearl (Oceanic, Pearl, Minimalist Elegance)' },
  { id: 'CelestialLullabyTemplate', label: 'Celestial Lullaby (Whimsical, Pastel, Starlight)' },
  { id: 'HearthHeritageTemplate', label: 'Hearth & Heritage (Terracotta, Auspicious Warmth)' },
  { id: 'MidnightSoireeTemplate', label: 'Midnight Soirée (Cocktail, Neon, Disco Glamour)' },
  { id: 'AuraGrandGalaTemplate', label: 'Aura Grand Gala (Black-Tie, VIP Red Carpet)' },
];

const PROMPT_SUGGESTIONS = [
  {
    title: '🏰 Royal Udaipur Palace',
    prompt: 'Royal Udaipur Lake Palace Wedding with deep ruby maroon and antique gold accents, lotus jharokha arches, live countdown, and starlight sangeet.',
    category: 'wedding',
  },
  {
    title: '🌺 Goan Coastal Sundowner',
    prompt: 'Beachside Goan sunset celebration with pastel corals, sage green foliage, acoustic chill waves, and breezy sea salt romance.',
    category: 'wedding',
  },
  {
    title: '🍸 Art Deco 1920s Speakeasy',
    prompt: 'Roaring twenties Gatsby VIP cocktail celebration with obsidian black, geometric brushed brass, jazz vinyl tunes, and champagne towers.',
    category: 'party',
  },
  {
    title: '🪔 Punjabi Anand Karaj',
    prompt: 'Vibrant Punjabi wedding with royal indigo blue, marigold saffron, phulkari cross-stitch embroidery motifs, and spirited dhol beats.',
    category: 'wedding',
  },
  {
    title: '🍼 Whimsical Starlight Shower',
    prompt: 'Enchanted nursery baby shower with soft lavender clouds, watercolor moons, gold foil stardust, and lullaby harps.',
    category: 'baby_shower',
  },
  {
    title: '🎂 Neon Synth Arcade 80s',
    prompt: 'Retro 80s arcade birthday bash with hot magenta, electric cyan wireframes, pixel art badges, and synthwave beats.',
    category: 'birthday',
  },
];

export default function TemplateImportModal({
  isOpen,
  onClose,
  onImportSuccess,
}: TemplateImportModalProps) {
  const [activeMode, setActiveMode] = useState<'ai' | 'json' | 'form'>('ai');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  // AI Studio State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCategory, setAiCategory] = useState('wedding');
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const [creativeDirection, setCreativeDirection] = useState<any>(null);
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null);
  const [adjustmentFeedback, setAdjustmentFeedback] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState<'design' | 'content' | 'json'>('design');

  // JSON Mode State
  const [jsonContent, setJsonContent] = useState(JSON.stringify(SAMPLE_STARTER_TEMPLATE, null, 2));

  // Form Mode State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('wedding');
  const [formArchetype, setFormArchetype] = useState('BotanicalRomanceTemplate');
  const [formDescription, setFormDescription] = useState('');
  const [formPriceTier, setFormPriceTier] = useState('premium');
  const [formPriceAmount, setFormPriceAmount] = useState('499');
  const [formPrimaryColor, setFormPrimaryColor] = useState('#B8860B');
  const [formBgColor, setFormBgColor] = useState('#0B0F19');
  const [formIsFeatured, setFormIsFeatured] = useState(true);

  if (!isOpen) return null;

  // AI Workflow Handlers
  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a description or idea for your template.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setValidationErrors([]);

      setLoadingStep('🧠 Step 1/2: Consulting Gemini AI to refine your design brief...');
      await new Promise((r) => setTimeout(r, 400));

      const res = await api.post('/api/admin/ai/generate-template', {
        prompt: aiPrompt.trim(),
        category: aiCategory,
      });

      setLoadingStep('🎨 Step 2/2: Harmonizing palette, typography & celebration itinerary...');
      await new Promise((r) => setTimeout(r, 300));

      setRefinedPrompt(res.data.refinedPrompt);
      setCreativeDirection(res.data.creativeDirection);
      setGeneratedTemplate(res.data.template);
      setActiveAiTab('design');
    } catch (err: any) {
      console.error('AI generation failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate template with Gemini AI');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleAdjustWithAi = async () => {
    if (!adjustmentFeedback.trim() || !generatedTemplate) return;

    try {
      setAdjusting(true);
      setError(null);

      const res = await api.post('/api/admin/ai/adjust-template', {
        currentTemplate: generatedTemplate,
        feedback: adjustmentFeedback.trim(),
      });

      setGeneratedTemplate(res.data.updatedTemplate);
      setAdjustmentFeedback('');
    } catch (err: any) {
      console.error('Adjustment failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to apply adjustment');
    } finally {
      setAdjusting(false);
    }
  };

  const handleApproveAndSaveAiTemplate = async () => {
    if (!generatedTemplate) return;

    try {
      setLoading(true);
      setError(null);

      // Create theme directly in catalog
      await api.post('/api/admin/themes', generatedTemplate);
      onImportSuccess(1);
      onClose();
    } catch (err: any) {
      console.error('Save failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add template to catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = (s: typeof PROMPT_SUGGESTIONS[0]) => {
    setAiPrompt(s.prompt);
    setAiCategory(s.category);
    setError(null);
  };

  // Form Mode Handlers
  const handleNameChange = (name: string) => {
    setFormName(name);
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormSlug(generatedSlug);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        JSON.parse(text);
        setJsonContent(text);
        setError(null);
      } catch {
        setError('Uploaded file contains invalid JSON. Please check file formatting.');
      }
    };
    reader.readAsText(file);
  };

  const handleImportJson = async () => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors([]);

      let parsed: any;
      try {
        parsed = JSON.parse(jsonContent);
      } catch (err: any) {
        setError(`JSON Syntax Error: ${err.message}`);
        setLoading(false);
        return;
      }

      const res = await api.post('/api/admin/themes/import', parsed);
      onImportSuccess(res.data.importedCount || 1);
      onClose();
    } catch (err: any) {
      console.error('Import failed:', err);
      const data = err.response?.data;
      setError(data?.message || err.message || 'Failed to import template');
      if (data?.validationErrors) {
        setValidationErrors(data.validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setValidationErrors([]);

      const themeManifest = {
        name: formName.trim(),
        slug: formSlug.trim(),
        category: formCategory,
        description: formDescription.trim(),
        templateComponent: formArchetype,
        tags: [formCategory, 'custom', 'curated'],
        priceTier: formPriceTier,
        priceAmount: parseInt(formPriceAmount) * 100,
        currency: 'INR',
        isActive: true,
        isFeatured: formIsFeatured,
        previewImageUrl: '/templates/preview-placeholder.jpg',
        defaultColors: {
          primary: formPrimaryColor,
          background: formBgColor,
          surface: '#1E293B',
          text: '#F8FAFC',
        },
        defaultFonts: {
          heading: 'Cinzel',
          body: 'Cormorant Garamond',
          accent: 'Great Vibes',
        },
        features: ['countdown', 'interactive_rsvp', 'event_schedule', 'audio_player'],
      };

      await api.post('/api/admin/themes', themeManifest);
      onImportSuccess(1);
      onClose();
    } catch (err: any) {
      console.error('Create theme failed:', err);
      const data = err.response?.data;
      setError(data?.message || err.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden animate-scaleIn">
        
        {/* Glow ambient header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-gradient-to-b from-amber-500/20 via-rose-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-lg shadow-lg">
              ✨
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Template Creation &amp; Import Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] uppercase font-bold tracking-wider">
                  Gemini AI Powered
                </span>
              </h2>
              <p className="text-xs text-slate-400">Generate, refine, review, and import designs into the platform catalog</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-4 pb-0 flex gap-2 border-b border-slate-800/80 bg-slate-950/40">
          <button
            type="button"
            onClick={() => setActiveMode('ai')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeMode === 'ai'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>✨</span>
            <span>Gemini AI Studio</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('json')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeMode === 'json'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>📄</span>
            <span>JSON Manifest</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('form')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeMode === 'form'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>✏️</span>
            <span>Manual Form</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 relative z-10 max-h-[72vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              {validationErrors.length > 0 && (
                <ul className="list-disc list-inside mt-2 text-[11px] text-red-400">
                  {validationErrors.map((v, i) => (
                    <li key={i}>{typeof v === 'string' ? v : v.message || JSON.stringify(v)}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 1: GEMINI AI STUDIO */}
          {/* ============================================================== */}
          {activeMode === 'ai' && (
            <div className="space-y-6">
              {!generatedTemplate ? (
                /* Step 1: Input Prompt */
                <div className="space-y-5">
                  <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-purple-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-amber-300">How Gemini AI Import Works: </span>
                    Provide any idea or celebration theme in plain words. In the background, Gemini first
                    <strong className="text-white"> refines your prompt</strong> into an architectural art brief, selects harmonious colors &amp; typography, and builds the full template contract. You can review it, chat with AI to adjust it, and publish it with 1 click!
                  </div>

                  {/* Quick Starter Inspiration */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      💡 1-Click Starter Inspirations:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PROMPT_SUGGESTIONS.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplySuggestion(s)}
                          className="p-2.5 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-left text-xs transition group"
                        >
                          <div className="font-semibold text-slate-200 group-hover:text-amber-300 transition">
                            {s.title}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Target Occasion Category
                    </label>
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Main Prompt Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Describe Your Theme / Visual Concept
                    </label>
                    <textarea
                      rows={4}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Royal Jaipur palace celebration with jharokha arches, pastel rose gold and peacock blue accents, live countdown, and starlight sangeet..."
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition leading-relaxed"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={handleGenerateWithAi}
                    disabled={loading || !aiPrompt.trim()}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-extrabold rounded-xl text-sm transition shadow-[0_0_25px_rgba(245,158,11,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
                        <span>{loadingStep || 'Designing Template with Gemini...'}</span>
                      </>
                    ) : (
                      <>
                        <span>✨ Refine Prompt &amp; Synthesize Template</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Step 2: Review & Adjustment Studio */
                <div className="space-y-5 animate-fadeIn">
                  {/* Generated Header Banner */}
                  <div className="p-4 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/30 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        <h3 className="text-base font-bold text-white">{generatedTemplate.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                          AI Generated
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {generatedTemplate.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGeneratedTemplate(null)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                      >
                        ← Start Over
                      </button>
                      <button
                        type="button"
                        onClick={handleApproveAndSaveAiTemplate}
                        disabled={loading}
                        className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold rounded-lg text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        {loading ? 'Adding...' : '✅ Approve & Add to Catalog'}
                      </button>
                    </div>
                  </div>

                  {/* Studio Sub-Tabs */}
                  <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveAiTab('design')}
                      className={`px-3 py-1 rounded-lg transition ${
                        activeAiTab === 'design' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🎨 Design &amp; Palette
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveAiTab('content')}
                      className={`px-3 py-1 rounded-lg transition ${
                        activeAiTab === 'content' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📅 Sample Itinerary
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveAiTab('json')}
                      className={`px-3 py-1 rounded-lg transition ${
                        activeAiTab === 'json' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      💻 JSON Manifest
                    </button>
                  </div>

                  {/* TAB 1: DESIGN & PALETTE */}
                  {activeAiTab === 'design' && (
                    <div className="space-y-4">
                      {/* Refined AI Brief Explanation */}
                      {refinedPrompt && (
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
                          <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block">
                            🧠 Gemini Architectural Refinement:
                          </span>
                          <p className="line-clamp-4 leading-relaxed">{refinedPrompt}</p>
                          {creativeDirection?.mood && (
                            <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300">
                              ✨ <strong>Creative Direction:</strong> <span className="text-slate-300">{creativeDirection.mood}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Color Palette Swatches */}
                      <div>
                        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Harmonized Color Palette
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {Object.entries(generatedTemplate.defaultColors || {}).map(([key, val]: any) => (
                            <div key={key} className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-center">
                              <div
                                className="w-full h-8 rounded-lg mb-1.5 shadow-inner border border-white/10"
                                style={{ backgroundColor: val }}
                              />
                              <span className="block text-[10px] font-bold text-slate-300 uppercase truncate">
                                {key}
                              </span>
                              <span className="block text-[9px] text-slate-500 font-mono">
                                {val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Meta Information Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <span className="text-[10px] text-slate-500 block uppercase">Slug</span>
                          <span className="font-mono text-slate-300 text-[11px] truncate block">
                            {generatedTemplate.slug}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <span className="text-[10px] text-slate-500 block uppercase">Archetype</span>
                          <span className="font-semibold text-slate-300 text-[11px] truncate block">
                            {generatedTemplate.templateComponent}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <span className="text-[10px] text-slate-500 block uppercase">Price</span>
                          <span className="font-bold text-emerald-400 text-xs">
                            ₹{(generatedTemplate.priceAmount / 100).toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <span className="text-[10px] text-slate-500 block uppercase">Category</span>
                          <span className="font-semibold text-amber-300 capitalize text-xs">
                            {generatedTemplate.category}
                          </span>
                        </div>
                      </div>

                      {/* Fonts & Features */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                            Typography Pairings
                          </span>
                          <div className="flex gap-2 text-slate-300">
                            <span>Heading: <strong>{generatedTemplate.defaultFonts?.heading}</strong></span>
                            <span>•</span>
                            <span>Body: <strong>{generatedTemplate.defaultFonts?.body}</strong></span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                            Active Features
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(generatedTemplate.features || []).map((f: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-md text-[10px]"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SAMPLE CONTENT */}
                  {activeAiTab === 'content' && (
                    <div className="space-y-4 text-xs">
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-300">
                            {generatedTemplate.sampleData?.couple?.groom} &amp; {generatedTemplate.sampleData?.couple?.bride}
                          </span>
                          <span className="text-slate-500 text-[11px] italic">
                            {generatedTemplate.sampleData?.couple?.tagline}
                          </span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                          {generatedTemplate.sampleData?.welcomeMessage}
                        </p>
                      </div>

                      {/* Events list */}
                      <div className="space-y-2">
                        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                          Generated Itinerary Events:
                        </span>
                        {(generatedTemplate.sampleData?.events || []).map((evt: any, i: number) => (
                          <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-start">
                            <div>
                              <span className="font-bold text-amber-300 block">{evt.name}</span>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                📍 {evt.venueName} — {evt.venueAddress}
                              </span>
                              {evt.dressCode && (
                                <span className="text-[10px] text-slate-500 block mt-0.5">
                                  👔 Dress Code: {evt.dressCode}
                                </span>
                              )}
                            </div>
                            <div className="text-right text-[11px] text-slate-300 font-mono">
                              <div>{evt.date}</div>
                              <div className="text-slate-500">{evt.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: JSON MANIFEST */}
                  {activeAiTab === 'json' && (
                    <div>
                      <textarea
                        readOnly
                        rows={12}
                        value={JSON.stringify(generatedTemplate, null, 2)}
                        className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-amber-200/90 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* AI Adjustment Chat Box */}
                  <div className="p-4 bg-slate-950 border border-amber-500/20 rounded-2xl space-y-2">
                    <label className="block text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <span>💬</span>
                      <span>Ask Gemini AI for Adjustments:</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={adjustmentFeedback}
                        onChange={(e) => setAdjustmentFeedback(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdjustWithAi()}
                        placeholder="e.g. 'Make the background darker #050811', 'Rename to Royal Lakeview', 'Change price to ₹699'..."
                        className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAdjustWithAi}
                        disabled={adjusting || !adjustmentFeedback.trim()}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                      >
                        {adjusting ? 'Adjusting...' : 'Apply ✨'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 2: JSON MANIFEST IMPORT */}
          {/* ============================================================== */}
          {activeMode === 'json' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Paste JSON or upload specification file:</span>
                <label className="text-amber-400 hover:underline cursor-pointer">
                  📁 Upload .json
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                rows={12}
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl font-mono text-xs text-amber-200/90 focus:outline-none focus:ring-2 focus:ring-amber-500 transition leading-relaxed"
                placeholder="Paste valid template JSON manifest..."
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportJson}
                  disabled={loading}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Validating...' : 'Validate & Import'}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 3: VISUAL FORM BUILDER */}
          {/* ============================================================== */}
          {activeMode === 'form' && (
            <form onSubmit={handleCreateFromForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Template Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Royal Tuscan Vineyard"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Slug Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Base Archetype *</label>
                  <select
                    value={formArchetype}
                    onChange={(e) => setFormArchetype(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {ARCHETYPES.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short description highlighting theme aesthetics..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formPrimaryColor}
                      onChange={(e) => setFormPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <span className="font-mono text-slate-300">{formPrimaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formBgColor}
                      onChange={(e) => setFormBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <span className="font-mono text-slate-300">{formBgColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Price Tier</label>
                  <select
                    value={formPriceTier}
                    onChange={(e) => setFormPriceTier(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="free">Free</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formPriceAmount}
                    onChange={(e) => setFormPriceAmount(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-800">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Mark as Featured in Host Gallery</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold rounded-xl transition shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Template'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
