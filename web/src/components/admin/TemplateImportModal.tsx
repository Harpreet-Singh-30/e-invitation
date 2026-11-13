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
  { id: 'BotanicalRomanceTemplate', label: 'Botanical Romance (Floral, Garden, Rustic)' },
  { id: 'ImperialBurgundyTemplate', label: 'Imperial Burgundy (Grand Palace, Regal Heritage)' },
  { id: 'ArtDecoNoirTemplate', label: 'Art Deco Noir (1920s Gatsby, Dark Obsidian Gold)' },
  { id: 'PhulkariCelebrationTemplate', label: 'Phulkari Celebration (Festive, Cross-stitch, Colorful)' },
  { id: 'CoastalPearlTemplate', label: 'Coastal Pearl (Oceanic, Pearl, Minimalist Elegance)' },
  { id: 'CelestialLullabyTemplate', label: 'Celestial Lullaby (Whimsical, Pastel, Starlight)' },
  { id: 'HearthHeritageTemplate', label: 'Hearth & Heritage (Terracotta, Auspicious Warmth)' },
  { id: 'MidnightSoireeTemplate', label: 'Midnight Soirée (Cocktail, Neon, Disco Glamour)' },
  { id: 'AuraGrandGalaTemplate', label: 'Aura Grand Gala (Black-Tie, VIP Red Carpet)' },
];

export default function TemplateImportModal({
  isOpen,
  onClose,
  onImportSuccess,
}: TemplateImportModalProps) {
  const [activeMode, setActiveMode] = useState<'json' | 'form'>('json');
  const [jsonContent, setJsonContent] = useState(JSON.stringify(SAMPLE_STARTER_TEMPLATE, null, 2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

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

  const handleNameChange = (name: string) => {
    setFormName(name);
    // Auto-generate slug
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
        // Verify valid JSON
        JSON.parse(text);
        setJsonContent(text);
        setError(null);
      } catch (err) {
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

      const payload = {
        name: formName,
        slug: formSlug,
        category: formCategory,
        description: formDescription,
        templateComponent: formArchetype,
        tags: [formCategory, 'custom', 'imported'],
        priceTier: formPriceTier,
        priceAmount: formPriceTier === 'free' ? 0 : parseInt(formPriceAmount || '499') * 100,
        currency: 'INR',
        isActive: true,
        isFeatured: formIsFeatured,
        previewImageUrl: '/templates/default-preview.jpg',
        defaultColors: {
          primary: formPrimaryColor,
          background: formBgColor,
        },
        defaultFonts: {
          heading: 'Cinzel',
          body: 'Cormorant Garamond',
        },
        features: ['animated_gate', 'audio_player', 'interactive_rsvp'],
      };

      await api.post('/api/admin/themes', payload);
      onImportSuccess(1);
      onClose();
    } catch (err: any) {
      console.error('Create template failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create template');
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors.map((msg: string) => ({ errors: [msg] })));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden animate-scaleIn">
        
        {/* Glow ambient header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-gradient-to-b from-amber-500/20 via-rose-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-lg shadow-lg">
              📥
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Import New Invitation Template</h2>
              <p className="text-xs text-slate-400">Add custom designs to the platform catalog</p>
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
            onClick={() => setActiveMode('json')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition ${
              activeMode === 'json'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📄 JSON Manifest Import
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('form')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition ${
              activeMode === 'form'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            ✏️ Visual Form Builder
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 relative z-10 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              {validationErrors.length > 0 && (
                <ul className="list-disc pl-5 text-[11px] space-y-0.5 mt-1 text-red-400">
                  {validationErrors.map((v, i) => (
                    <li key={i}>{v.name ? `${v.name}: ` : ''}{v.errors?.join(', ') || JSON.stringify(v)}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* MODE 1: JSON IMPORT */}
          {activeMode === 'json' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-200 transition flex items-center gap-1.5">
                    <span>📁 Upload .json File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setJsonContent(JSON.stringify(SAMPLE_STARTER_TEMPLATE, null, 2))}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs transition"
                  >
                    Load Sample Template
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  Accepts single object or array of templates
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Template Manifest JSON Payload:
                </label>
                <textarea
                  rows={14}
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-amber-200 font-mono text-xs p-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500 selection:bg-amber-500 selection:text-slate-950"
                  placeholder="Paste template manifest JSON here..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleImportJson}
                  disabled={loading || !jsonContent.trim()}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
                      <span>Validating &amp; Ingesting...</span>
                    </>
                  ) : (
                    <>
                      <span>📥 Ingest Template into Catalog</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: FORM BUILDER */}
          {activeMode === 'form' && (
            <form onSubmit={handleCreateFromForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Template Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Royal Tuscan Vineyard"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Unique URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="royal-tuscan-vineyard"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Occasion Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Component Archetype *
                  </label>
                  <select
                    value={formArchetype}
                    onChange={(e) => setFormArchetype(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Design Description &amp; Theme Narrative
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Sun-drenched Chianti hills, olive branch wreaths, rustic stone entrance..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Price Tier
                  </label>
                  <select
                    value={formPriceTier}
                    onChange={(e) => setFormPriceTier(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="premium">Premium (₹)</option>
                    <option value="free">Free</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    disabled={formPriceTier === 'free'}
                    value={formPriceAmount}
                    onChange={(e) => setFormPriceAmount(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white disabled:opacity-40"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-amber-500"
                  />
                  <label htmlFor="isFeatured" className="text-xs text-slate-300 cursor-pointer">
                    Feature on Home
                  </label>
                </div>
              </div>

              {/* Theme Palette Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formPrimaryColor}
                      onChange={(e) => setFormPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={formPrimaryColor}
                      onChange={(e) => setFormPrimaryColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formBgColor}
                      onChange={(e) => setFormBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={formBgColor}
                      onChange={(e) => setFormBgColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !formName.trim() || !formSlug.trim()}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
                      <span>Creating Template...</span>
                    </>
                  ) : (
                    <>
                      <span>✨ Save &amp; Publish Template</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
