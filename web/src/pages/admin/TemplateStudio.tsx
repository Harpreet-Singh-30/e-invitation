import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/api';
import { resolveTemplate, registerThemeInCatalog } from '../../templates/registry';
import { adaptInvitationToTemplateData } from '../../templates/adapter';
import MobilePhoneMockup from '../../components/MobilePhoneMockup';

const DEFAULT_STARTER_TEMPLATE = {
  name: "Royal Tuscan Vineyard",
  slug: "royal-tuscan-vineyard",
  category: "wedding",
  description: "Sun-drenched Chianti hills, olive branch wreaths, rustic stone villa entrance, and acoustic mandolin serenades",
  templateComponent: "BotanicalRomanceTemplate",
  tags: ["tuscan", "vineyard", "rustic", "italy", "outdoor", "luxury"],
  priceTier: "premium" as const,
  priceAmount: 49900,
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
  ],
  sampleData: {
    couple: {
      groom: "Matteo Bellini",
      bride: "Chiara Rossi",
      tagline: "Under the Tuscan sun, two hearts become one"
    },
    welcomeMessage: "With immense joy and gratitude, we invite you to celebrate our union in the rolling hills of Tuscany.",
    storyContent: "From an autumn afternoon in Florence to a starry vineyard in Chianti, our journey has been filled with laughter, shared dreams, and boundless love.",
    familyInfo: "With blessings from the Bellini and Rossi families.",
    events: [
      {
        name: "Welcome Pizza & Wine Soirée",
        date: "2027-09-17",
        time: "6:30 PM",
        venueName: "Villa Tenuta del Sole Courtyard",
        venueAddress: "Via dei Vigneti 14, Greve in Chianti, Tuscany, Italy",
        dressCode: "Smart Casual Italian Linen",
        description: "Wood-fired Neapolitan pizzas, Chianti Classico wine tasting, and acoustic mandolin strings."
      },
      {
        name: "The Wedding Ceremony & Vows",
        date: "2027-09-18",
        time: "4:00 PM",
        venueName: "The Olive Grove Amphitheatre",
        venueAddress: "Greve in Chianti, Tuscany, Italy",
        dressCode: "Tuscan Garden Formal",
        description: "Vows exchanged amidst ancient olive trees followed by aperitivo on the panoramic terrace."
      },
      {
        name: "Candlelit Vineyard Gala Dinner",
        date: "2027-09-18",
        time: "7:30 PM",
        venueName: "Villa Tenuta Grand Loggia",
        venueAddress: "Greve in Chianti, Tuscany, Italy",
        dressCode: "Black Tie / Elegant Evening",
        description: "Four-course Tuscan tasting menu, fireworks over the hills, and dancing under the stars."
      }
    ]
  }
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
  { id: 'BotanicalRomanceTemplate', label: 'Botanical Romance (Floral, Garden, Rustic)', category: 'wedding' },
  { id: 'ImperialBurgundyTemplate', label: 'Imperial Burgundy (Grand Palace, Regal Heritage)', category: 'wedding' },
  { id: 'ArtDecoNoirTemplate', label: 'Art Deco Noir (1920s Gatsby, Dark Obsidian Gold)', category: 'wedding' },
  { id: 'PhulkariCelebrationTemplate', label: 'Phulkari Celebration (Festive, Cross-stitch, Colorful)', category: 'wedding' },
  { id: 'CoastalPearlTemplate', label: 'Coastal Pearl (Oceanic Waves, Pearl, Beach & Island)', category: 'wedding' },
  { id: 'GoldenMilestoneTemplate', label: 'Golden Milestone (Velvet Obsidian, Champagne Gold, Birthday)', category: 'birthday' },
  { id: 'RetroSynthArcadeTemplate', label: 'Retro Synthwave Arcade (80s Cyber Neon, Birthday)', category: 'birthday' },
  { id: 'SilverJubileeTemplate', label: 'Silver Jubilee (Polished Sterling, Milestones)', category: 'anniversary' },
  { id: 'CelestialLullabyTemplate', label: 'Celestial Lullaby (Pastel Clouds, Moon & Starlight)', category: 'baby_shower' },
  { id: 'HearthHeritageTemplate', label: 'Hearth & Heritage (Terracotta, Brass Diya)', category: 'housewarming' },
  { id: 'MidnightSoireeTemplate', label: 'Midnight Soirée (Ultraviolet Neon, VIP Pass, Party)', category: 'party' },
  { id: 'TropicalSunsetLuauTemplate', label: 'Tropical Sunset Luau (Beach Party, Sundowner)', category: 'party' },
  { id: 'PoolsideSunDrenchedBashTemplate', label: 'Poolside Sun-Drenched Bash (Summer Beach & Pool)', category: 'party' },
  { id: 'DivyaMandapTemplate', label: 'Divya Mandap (Vedic Saffron, Glowing Ghee Diyas)', category: 'religious' },
  { id: 'HeritageReunionTemplate', label: 'Heritage Reunion (Royal Emerald, Banyan Crest)', category: 'family_celebration' },
  { id: 'AuraGrandGalaTemplate', label: 'Aura Grand Gala (Sapphire Black-Tie, Honors Night)', category: 'other' },
];

const PROMPT_SUGGESTIONS = [
  {
    title: '🏰 Royal Udaipur Palace',
    prompt: 'Royal Udaipur Lake Palace Wedding with deep ruby maroon and antique gold accents, lotus jharokha arches, live countdown, and 3-day royal sangeet.',
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

const FONTS_HEADING = ['Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Montserrat', 'Great Vibes', 'Merriweather', 'Jost'];
const FONTS_BODY = ['Cormorant Garamond', 'Inter', 'Plus Jakarta Sans', 'Mulish', 'Lato', 'Merriweather'];
const FONTS_ACCENT = ['Great Vibes', 'Alex Brush', 'Dancing Script', 'Cinzel', 'Parisienne'];

export default function TemplateStudio() {
  const { id } = useParams<{ id: string }>();

  // Template State
  const [template, setTemplate] = useState<any>(DEFAULT_STARTER_TEMPLATE);
  const [isNew, setIsNew] = useState(true);

  // Studio UI state
  const [activeTab, setActiveTab] = useState<'ai' | 'product' | 'styling' | 'content' | 'events' | 'features' | 'json'>('ai');
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('mobile');
  const [previewKey, setPreviewKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // AI Chat & Iteration State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCategory, setAiCategory] = useState('wedding');
  const [aiFeedback, setAiFeedback] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Welcome to the Template Product Studio! Describe your vision or pick a preset prompt to generate a new invitation product.',
      time: 'Just now'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load existing theme if ID param is present
  useEffect(() => {
    if (id) {
      loadTheme(id);
    }
  }, [id]);

  const loadTheme = async (themeIdOrSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/api/admin/themes/${themeIdOrSlug}`);
      const fetched = res.data.theme;
      
      const hydrated = {
        ...DEFAULT_STARTER_TEMPLATE,
        ...fetched,
        defaultColors: { ...DEFAULT_STARTER_TEMPLATE.defaultColors, ...(fetched.defaultColors || {}) },
        defaultFonts: { ...DEFAULT_STARTER_TEMPLATE.defaultFonts, ...(fetched.defaultFonts || {}) },
        sampleData: fetched.sampleData || DEFAULT_STARTER_TEMPLATE.sampleData,
      };

      setTemplate(hydrated);
      setIsNew(false);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Loaded existing template product: "${fetched.name}". You can now customize properties or ask AI to iterate on it.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error('Failed to load theme:', err);
      setError(err.response?.data?.message || 'Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  // AI Prompt Generation
  const handleGenerateTemplate = async () => {
    if (!aiPrompt.trim()) {
      setError('Please provide a prompt or pick one of the suggestions below.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLoadingStep('🧠 Step 1/2: Consulting Gemini AI for design direction & mood...');

      const userQuery = aiPrompt.trim();
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: userQuery, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);

      const res = await api.post('/api/admin/ai/generate-template', {
        prompt: userQuery,
        category: aiCategory,
      });

      setLoadingStep('🎨 Step 2/2: Composing color palette, typography & itinerary...');
      await new Promise(r => setTimeout(r, 400));

      const generated = res.data.template;
      const merged = {
        ...DEFAULT_STARTER_TEMPLATE,
        ...generated,
        defaultColors: { ...DEFAULT_STARTER_TEMPLATE.defaultColors, ...(generated.defaultColors || {}) },
        defaultFonts: { ...DEFAULT_STARTER_TEMPLATE.defaultFonts, ...(generated.defaultFonts || {}) },
        sampleData: generated.sampleData || DEFAULT_STARTER_TEMPLATE.sampleData,
      };

      setTemplate(merged);
      setPreviewKey(k => k + 1);

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Generated "${merged.name}"! Archetype: ${merged.templateComponent}. Category: ${merged.category}. Check the live preview on the right or ask for adjustments.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      showToast(`Generated "${merged.name}" successfully!`);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err.response?.data?.message || 'AI generation failed');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // Conversational AI Adjustment
  const handleApplyAiFeedback = async () => {
    if (!aiFeedback.trim() || !template) return;

    const feedbackText = aiFeedback.trim();
    setAiFeedback('');

    try {
      setAdjusting(true);
      setError(null);

      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: feedbackText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);

      const res = await api.post('/api/admin/ai/adjust-template', {
        currentTemplate: template,
        feedback: feedbackText,
      });

      const updated = res.data.updatedTemplate;
      const changesSummary = res.data.changesSummary || 'Template updated';

      const merged = {
        ...template,
        ...updated,
        defaultColors: { ...template.defaultColors, ...(updated.defaultColors || {}) },
        defaultFonts: { ...template.defaultFonts, ...(updated.defaultFonts || {}) },
        sampleData: updated.sampleData || template.sampleData,
      };

      setTemplate(merged);
      setPreviewKey(k => k + 1);

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Applied change: ${changesSummary}. Live preview updated.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      showToast('AI adjustment applied!');
    } catch (err: any) {
      console.error('Adjustment failed:', err);
      setError(err.response?.data?.message || 'AI adjustment failed');
    } finally {
      setAdjusting(false);
    }
  };

  // Quick preset feedback
  const handleQuickChip = (instruction: string) => {
    setAiFeedback(instruction);
  };

  // Save / Publish
  const handleSaveToCatalog = async (publishLive: boolean = true) => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...template,
        isActive: publishLive,
      };

      const targetId = template.id || id;
      if (!isNew && targetId) {
        await api.put(`/api/admin/themes/${targetId}`, payload);
        showToast(`Template "${template.name}" updated successfully!`);
      } else {
        const res = await api.post('/api/admin/themes', payload);
        const savedTheme = res.data?.theme;
        if (savedTheme?.id) {
          setTemplate((prev: any) => ({ ...prev, id: savedTheme.id }));
          setIsNew(false);
        }
        showToast(`Template "${template.name}" published to catalog!`);
      }

      // Register in local registry so preview is immediate across app
      registerThemeInCatalog(payload);
    } catch (err: any) {
      console.error('Save failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save template to catalog');
    } finally {
      setSaving(false);
    }
  };

  // Direct manual field updates
  const updateField = (field: string, val: any) => {
    setTemplate((prev: any) => ({
      ...prev,
      [field]: val,
    }));
    if (field === 'templateComponent' || field === 'category') {
      setPreviewKey(k => k + 1);
    }
  };

  const updateNestedField = (parent: string, child: string, val: any) => {
    setTemplate((prev: any) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [child]: val,
      },
    }));
  };

  const updateCoupleField = (field: string, val: string) => {
    setTemplate((prev: any) => ({
      ...prev,
      sampleData: {
        ...(prev.sampleData || {}),
        couple: {
          ...(prev.sampleData?.couple || {}),
          [field]: val,
        },
      },
    }));
    setPreviewKey(k => k + 1);
  };

  const handleAddEvent = () => {
    const newEvent = {
      name: "New Celebration Event",
      date: "2027-10-15",
      time: "6:00 PM",
      venueName: "Grand Ballroom",
      venueAddress: "City Center",
      dressCode: "Festive Formal",
      description: "Music, dining, and celebration with family and friends."
    };

    setTemplate((prev: any) => ({
      ...prev,
      sampleData: {
        ...(prev.sampleData || {}),
        events: [...(prev.sampleData?.events || []), newEvent],
      },
    }));
    setPreviewKey(k => k + 1);
  };

  const handleUpdateEvent = (index: number, field: string, val: string) => {
    setTemplate((prev: any) => {
      const currentEvents = [...(prev.sampleData?.events || [])];
      if (currentEvents[index]) {
        currentEvents[index] = {
          ...currentEvents[index],
          [field]: val,
        };
      }
      return {
        ...prev,
        sampleData: {
          ...(prev.sampleData || {}),
          events: currentEvents,
        },
      };
    });
    setPreviewKey(k => k + 1);
  };

  const handleDeleteEvent = (index: number) => {
    setTemplate((prev: any) => {
      const currentEvents = [...(prev.sampleData?.events || [])];
      currentEvents.splice(index, 1);
      return {
        ...prev,
        sampleData: {
          ...(prev.sampleData || {}),
          events: currentEvents,
        },
      };
    });
    setPreviewKey(k => k + 1);
  };

  const toggleFeature = (featureName: string) => {
    setTemplate((prev: any) => {
      const list = prev.features || [];
      const next = list.includes(featureName)
        ? list.filter((f: string) => f !== featureName)
        : [...list, featureName];
      return { ...prev, features: next };
    });
  };

  // Live Component Resolver
  const resolvedTemplateDef = useMemo(() => {
    const componentIdentifier = template.templateComponent || template.slug;
    return resolveTemplate(componentIdentifier);
  }, [template.templateComponent, template.slug, previewKey]);

  // Adapted Live Preview Data
  const adaptedPreviewData = useMemo(() => {
    const occasion = (template.category || '').toLowerCase();
    const isCoupleOccasion = ['wedding', 'anniversary'].includes(occasion);
    const couple = {
      groom: template.sampleData?.couple?.groom || (isCoupleOccasion ? 'Groom' : 'Host / Honoree'),
      bride: isCoupleOccasion ? (template.sampleData?.couple?.bride ?? 'Bride') : '',
      tagline: template.sampleData?.couple?.tagline || template.name,
    };
    const rawEvents = template.sampleData?.events || [];

    const mappedEvents = rawEvents.map((ev: any, idx: number) => ({
      key: `ev-${idx}`,
      title: ev.name || ev.title || `Event ${idx + 1}`,
      name: ev.name || ev.title || `Event ${idx + 1}`,
      date: ev.date || '2027-09-18',
      eventDate: ev.date || '2027-09-18',
      time: ev.time || '6:00 PM',
      startTime: ev.time || '6:00 PM',
      venue: ev.venueName || 'Grand Palace',
      venueName: ev.venueName || 'Grand Palace',
      address: ev.venueAddress || 'Palace Grounds',
      venueAddress: ev.venueAddress || 'Palace Grounds',
      dressCode: ev.dressCode,
      description: ev.description,
    }));

    return adaptInvitationToTemplateData({
      title: template.name,
      groomName: couple.groom,
      brideName: couple.bride,
      tagline: couple.tagline || template.description,
      welcomeMessage: template.sampleData?.welcomeMessage || template.description,
      storyContent: template.sampleData?.storyContent,
      familyInfo: template.sampleData?.familyInfo,
      events: mappedEvents,
      occasionType: template.category,
    });
  }, [template, previewKey]);

  // Injected CSS variables for real-time live preview theme colors & fonts across all archetypes
  const previewCustomStyle = useMemo(() => {
    const colors = template.defaultColors || {};
    const fonts = template.defaultFonts || {};
    const primary = colors.primary || '#8B0000';
    const secondary = colors.secondary || '#D4AF37';
    const accent = colors.accent || '#E5C158';
    const background = colors.background || '#0B0F19';
    const surface = colors.surface || '#151D2A';
    const text = colors.text || '#FFFFFF';
    const fontHeading = fonts.heading || 'Cinzel';
    const fontBody = fonts.body || 'Cormorant Garamond';
    const fontAccent = fonts.accent || 'Great Vibes';

    return {
      '--color-primary': primary,
      '--color-secondary': secondary,
      '--color-accent': accent,
      '--color-bg': background,
      '--color-surface': surface,
      '--color-text': text,
      '--primary': primary,
      '--secondary': secondary,
      '--accent': accent,
      '--background': background,
      '--surface': surface,
      '--text': text,
      '--burg': primary,
      '--wine': secondary,
      '--gold': accent,
      '--deep': background,
      '--cream': surface,
      '--ivory': surface,
      '--char': text,
      '--ih-teal': primary,
      '--ih-coral': accent,
      '--ih-sand': surface,
      '--ih-deep': background,
      '--ih-champagne': accent,
      '--ih-surface': surface,
      '--ih-ink': text,
      '--font-heading': fontHeading,
      '--font-body': fontBody,
      '--font-accent': fontAccent,
      '--serif': `'${fontHeading}', serif`,
      '--cinzel': `'${fontHeading}', serif`,
      '--f-display': `'${fontHeading}', serif`,
      '--f-body': `'${fontBody}', sans-serif`,
      '--ih-serif': `'${fontHeading}', serif`,
      '--ih-sans': `'${fontBody}', sans-serif`,
    } as React.CSSProperties;
  }, [template.defaultColors, template.defaultFonts]);

  const RenderedTemplateComponent = resolvedTemplateDef?.component;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. TOP HEADER & PRODUCT ACTIONS */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <span>←</span>
            <span>Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <span className="text-base font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
              ✨ Template Studio
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {template.name || 'Untitled Template'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {template.category}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              template.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {template.isActive ? 'LIVE IN CATALOG' : 'DRAFT'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-xs text-rose-400 font-medium px-2 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20 max-w-xs truncate">
              ⚠️ {error}
            </span>
          )}

          <Link
            to={`/templates/${template.slug}/preview`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
          >
            <span>Catalog Link</span>
            <span>↗</span>
          </Link>

          <button
            onClick={() => handleSaveToCatalog(false)}
            disabled={saving}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={() => handleSaveToCatalog(true)}
            disabled={saving}
            className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🚀</span>
            <span>{saving ? 'Publishing...' : 'Publish to Catalog'}</span>
          </button>
        </div>
      </header>

      {/* 2. SPLIT WORKSPACE: LEFT (AI & PRODUCT CONTROL) / RIGHT (LIVE PREVIEW) */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= LEFT PANEL ================= */}
        <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col border-r border-slate-800 bg-slate-900/60 overflow-hidden">
          {/* Subtabs Header */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-800 bg-slate-950/40 overflow-x-auto text-xs shrink-0">
            {[
              { id: 'ai', label: '🤖 AI Copilot', icon: '✨' },
              { id: 'product', label: 'Product Info', icon: '🏷️' },
              { id: 'styling', label: 'Design & Colors', icon: '🎨' },
              { id: 'content', label: 'Showcase Content', icon: '✍️' },
              { id: 'events', label: 'Itinerary Events', icon: '📅' },
              { id: 'features', label: 'Features & Seals', icon: '⚡' },
              { id: 'json', label: 'Raw Manifest', icon: '💻' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Subtab Body Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* TAB 1: AI COPILOT & PROMPT LOOP */}
            {activeTab === 'ai' && (
              <div className="space-y-4">
                {/* Generation Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <span>✨</span> Gemini AI Template Generator
                    </span>
                    <select
                      value={aiCategory}
                      onChange={e => setAiCategory(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Describe your template theme, mood, color palette, and cultural details..."
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />

                  {/* Preset prompt pills */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium text-slate-400">Quick Inspiration Presets:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {PROMPT_SUGGESTIONS.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setAiPrompt(s.prompt);
                            setAiCategory(s.category);
                          }}
                          className="px-2 py-1 bg-slate-800/80 hover:bg-slate-800 text-[11px] text-slate-300 rounded-lg border border-slate-700/80 transition"
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateTemplate}
                    disabled={loading || !aiPrompt.trim()}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>{loadingStep || 'Generating template with AI...'}</span>
                      </>
                    ) : (
                      <>
                        <span>✨ Generate Template Product</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Conversational Iteration Chat Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>💬</span> Conversational Iteration (Lovable Mode)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Real-time reactive</span>
                  </div>

                  {/* Chat Stream */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl ${
                          msg.sender === 'user'
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-200 ml-4'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold">{msg.sender === 'user' ? 'Admin' : 'Gemini AI'}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick feedback chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      'Change palette to emerald green and antique gold',
                      'Make it a coastal sunset beach vibe',
                      'Add a Sufi Sangeet night event',
                      'Switch couple names to Kabir and Rhea',
                      'Make it standard free tier',
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickChip(chip)}
                        className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 rounded-md border border-slate-800 transition"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>

                  {/* Feedback Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask AI to change colors, fonts, couple, itinerary, or archetype..."
                      value={aiFeedback}
                      onChange={e => setAiFeedback(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplyAiFeedback()}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleApplyAiFeedback}
                      disabled={adjusting || !aiFeedback.trim()}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {adjusting ? <span className="animate-spin">⏳</span> : <span>Apply</span>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCT METADATA */}
            {activeTab === 'product' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                  Product Commercials &amp; Catalog Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Template Display Name</label>
                    <input
                      type="text"
                      value={template.name || ''}
                      onChange={e => updateField('name', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">URL Slug (Catalog Route)</label>
                    <input
                      type="text"
                      value={template.slug || ''}
                      onChange={e => updateField('slug', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono text-amber-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Category</label>
                    <select
                      value={template.category}
                      onChange={e => updateField('category', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Price Tier</label>
                    <select
                      value={template.priceTier}
                      onChange={e => updateField('priceTier', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Price (INR / Paisa)</label>
                    <input
                      type="number"
                      value={template.priceAmount ?? 49900}
                      onChange={e => updateField('priceAmount', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Marketing Description (for Hosts)</label>
                  <textarea
                    rows={2}
                    value={template.description || ''}
                    onChange={e => updateField('description', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Search Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={(template.tags || []).join(', ')}
                    onChange={e => updateField('tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                    placeholder="royal, palace, heritage, gold, traditional"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.isActive}
                      onChange={e => updateField('isActive', e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-white font-medium">Active in Public Catalog</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.isFeatured}
                      onChange={e => updateField('isFeatured', e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-white font-medium">Featured Product Badge</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: STYLING & DESIGN TOKENS */}
            {activeTab === 'styling' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                  Design System, Archetype &amp; Color Tokens
                </h3>

                {/* Base Archetype */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Underlying React Archetype Component</label>
                  <select
                    value={template.templateComponent}
                    onChange={e => updateField('templateComponent', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-semibold"
                  >
                    {ARCHETYPES.map(a => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>
                </div>

                {/* Color Palette Grid with Pickers */}
                <div>
                  <label className="block text-slate-400 mb-2 font-medium">Palette Color Tokens</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'primary', label: 'Primary Accent' },
                      { key: 'secondary', label: 'Secondary Tone' },
                      { key: 'accent', label: 'Highlight / Gold' },
                      { key: 'background', label: 'Background Dark' },
                      { key: 'surface', label: 'Card Surface' },
                      { key: 'text', label: 'Text / Heading' },
                    ].map(c => {
                      const currentColor = template.defaultColors?.[c.key] || '#B8860B';
                      return (
                        <div key={c.key} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                          <span className="text-[11px] text-slate-400 font-medium block">{c.label}</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentColor}
                              onChange={e => updateNestedField('defaultColors', c.key, e.target.value)}
                              className="w-7 h-7 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0"
                            />
                            <input
                              type="text"
                              value={currentColor}
                              onChange={e => updateNestedField('defaultColors', c.key, e.target.value)}
                              className="w-full font-mono text-[11px] bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-white uppercase"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Typography Selectors */}
                <div>
                  <label className="block text-slate-400 mb-2 font-medium">Typography Pairings</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Heading Font</span>
                      <select
                        value={template.defaultFonts?.heading || 'Cinzel'}
                        onChange={e => updateNestedField('defaultFonts', 'heading', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      >
                        {FONTS_HEADING.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Body Font</span>
                      <select
                        value={template.defaultFonts?.body || 'Cormorant Garamond'}
                        onChange={e => updateNestedField('defaultFonts', 'body', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      >
                        {FONTS_BODY.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Accent Script Font</span>
                      <select
                        value={template.defaultFonts?.accent || 'Great Vibes'}
                        onChange={e => updateNestedField('defaultFonts', 'accent', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                      >
                        {FONTS_ACCENT.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SHOWCASE SAMPLE CONTENT */}
            {activeTab === 'content' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                  Showcase Content ({template.category === 'birthday' ? 'Birthday Honoree & Details' : template.category === 'wedding' ? 'Couple & Story' : 'Hosts & Celebration Details'})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">
                      {template.category === 'birthday'
                        ? 'Birthday Person / Honoree Name'
                        : template.category === 'baby_shower'
                        ? 'Parents / Mother-to-be Name'
                        : template.category === 'housewarming'
                        ? 'Family / Homeowner Name'
                        : template.category === 'wedding'
                        ? 'Groom / Partner 1 Name'
                        : 'Host / Celebrant Name'}
                    </label>
                    <input
                      type="text"
                      value={template.sampleData?.couple?.groom || ''}
                      onChange={e => updateCoupleField('groom', e.target.value)}
                      placeholder={template.category === 'birthday' ? 'Aarav Sharma' : 'Groom Name'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">
                      {template.category === 'wedding'
                        ? 'Bride / Partner 2 Name'
                        : template.category === 'anniversary'
                        ? 'Spouse / Partner 2 Name'
                        : 'Co-Host / Partner Name (Optional - leave blank for single honoree)'}
                    </label>
                    <input
                      type="text"
                      value={template.sampleData?.couple?.bride || ''}
                      onChange={e => updateCoupleField('bride', e.target.value)}
                      placeholder={template.category === 'wedding' ? 'Bride Name' : 'Leave empty for single celebrant'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    {template.category === 'birthday'
                      ? 'Birthday Celebration Tagline'
                      : template.category === 'wedding'
                      ? 'Romantic Couple Tagline'
                      : 'Celebration Tagline / Slogan'}
                  </label>
                  <input
                    type="text"
                    value={template.sampleData?.couple?.tagline || ''}
                    onChange={e => updateCoupleField('tagline', e.target.value)}
                    placeholder={template.category === 'birthday' ? 'Turning 30 under the Goan sun and stars' : 'Tagline'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Welcome &amp; Invitation Narrative</label>
                  <textarea
                    rows={2}
                    value={template.sampleData?.welcomeMessage || ''}
                    onChange={e => updateNestedField('sampleData', 'welcomeMessage', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Love Story / Celebration Journey</label>
                  <textarea
                    rows={2}
                    value={template.sampleData?.storyContent || ''}
                    onChange={e => updateNestedField('sampleData', 'storyContent', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Family / Host Information</label>
                  <input
                    type="text"
                    value={template.sampleData?.familyInfo || ''}
                    onChange={e => updateNestedField('sampleData', 'familyInfo', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            )}

            {/* TAB 5: ITINERARY EVENTS */}
            {activeTab === 'events' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-white text-sm">Sample Itinerary &amp; Celebration Schedule</h3>
                  <button
                    onClick={handleAddEvent}
                    className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg border border-amber-500/30 transition cursor-pointer"
                  >
                    + Add Event
                  </button>
                </div>

                <div className="space-y-3">
                  {(template.sampleData?.events || []).map((ev: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">Event #{idx + 1}</span>
                        <button
                          onClick={() => handleDeleteEvent(idx)}
                          className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                        >
                          ✕ Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-slate-400">Event Title</label>
                          <input
                            type="text"
                            value={ev.name || ''}
                            onChange={e => handleUpdateEvent(idx, 'name', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400">Time</label>
                          <input
                            type="text"
                            value={ev.time || ''}
                            onChange={e => handleUpdateEvent(idx, 'time', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400">Venue Name</label>
                          <input
                            type="text"
                            value={ev.venueName || ''}
                            onChange={e => handleUpdateEvent(idx, 'venueName', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400">Dress Code</label>
                          <input
                            type="text"
                            value={ev.dressCode || ''}
                            onChange={e => handleUpdateEvent(idx, 'dressCode', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: FEATURES & SEALS */}
            {activeTab === 'features' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                  Interactive Features, Seals &amp; Widgets
                </h3>

                <div className="space-y-3">
                  {[
                    { id: 'animated_gate', title: 'Wax Seal & Gate Animation', desc: 'Simulated envelope seal, sliding palace door or gate reveal on entrance' },
                    { id: 'audio_player', title: 'Ambient Background Audio', desc: 'Auto-playing ambient acoustic soundtrack or sangeet loop with mute button' },
                    { id: 'interactive_rsvp', title: 'Interactive RSVP System', desc: 'Guest attendance counter, meal preferences, and WhatsApp dispatch' },
                    { id: 'countdown', title: 'Live Countdown Timer', desc: 'Day, hour, minute countdown leading to main muhurat ceremony' },
                    { id: 'event_schedule', title: 'Interactive Itinerary', desc: 'Multi-day agenda timeline with Google Maps links and dress codes' },
                    { id: 'photo_gallery', title: 'Pre-wedding Photo Gallery', desc: 'Responsive carousel and light-box photo collage for the couple' },
                  ].map(f => {
                    const isEnabled = (template.features || []).includes(f.id);
                    return (
                      <div
                        key={f.id}
                        onClick={() => toggleFeature(f.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          isEnabled
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-white">{f.title}</p>
                          <p className="text-[11px] text-slate-400">{f.desc}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isEnabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isEnabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 7: RAW JSON MANIFEST */}
            {activeTab === 'json' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Raw JSON Specification</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(template, null, 2));
                      showToast('Copied JSON to clipboard!');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[11px]"
                  >
                    📋 Copy JSON
                  </button>
                </div>
                <textarea
                  rows={16}
                  value={JSON.stringify(template, null, 2)}
                  onChange={e => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setTemplate(parsed);
                    } catch {
                      // ignore parse error while typing
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-emerald-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL: LIVE REACTIVE PREVIEW ================= */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
          {/* Preview Viewport Toolbar */}
          <div className="h-10 border-b border-slate-800 bg-slate-900/60 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">Viewport:</span>
              <button
                onClick={() => setViewport('mobile')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                  viewport === 'mobile'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📱</span>
                <span>Mobile Frame</span>
              </button>
              <button
                onClick={() => setViewport('desktop')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                  viewport === 'desktop'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>💻</span>
                <span>Expanded Desktop</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                Archetype: <strong className="text-amber-300">{template.templateComponent}</strong>
              </span>
              <button
                title="Force Refresh Preview"
                onClick={() => setPreviewKey(k => k + 1)}
                className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded text-xs transition"
              >
                🔄
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-radial from-slate-900 to-slate-950">
            {viewport === 'mobile' ? (
              <div className="my-auto py-2">
                <MobilePhoneMockup width={380} height={760}>
                  <div
                    key={previewKey}
                    style={previewCustomStyle}
                    className="min-h-full w-full bg-slate-950 text-slate-100 overflow-x-hidden"
                  >
                    {RenderedTemplateComponent ? (
                      <RenderedTemplateComponent data={adaptedPreviewData} />
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        <p className="text-base font-bold text-rose-400">Archetype Component Not Found</p>
                        <p className="text-xs mt-1">Component: {template.templateComponent}</p>
                      </div>
                    )}
                  </div>
                </MobilePhoneMockup>
              </div>
            ) : (
              <div
                key={previewKey}
                style={previewCustomStyle}
                className="w-full h-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-y-auto transform-gpu relative isolate"
              >
                {RenderedTemplateComponent ? (
                  <RenderedTemplateComponent data={adaptedPreviewData} />
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <p className="text-base font-bold text-rose-400">Archetype Component Not Found</p>
                    <p className="text-xs mt-1">Component: {template.templateComponent}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
