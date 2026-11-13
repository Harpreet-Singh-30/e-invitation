import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { resolveTemplate } from '../templates/registry';
import { adaptInvitationToTemplateData, extractCoupleNames } from '../templates/adapter';
import MobilePhoneMockup from '../components/MobilePhoneMockup';
import { getCategoryFormConfig } from './categoryFormConfig';
import PaymentModal from '../components/PaymentModal';

interface EventItem {
  id?: string;
  name: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  venueName?: string;
  venueAddress?: string;
  mapLink?: string;
  dressCode?: string;
  description?: string;
}

export default function InvitationEditor() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'events' | 'story' | 'media'>('details');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Publication and payment state
  const [isPublished, setIsPublished] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [tagline, setTagline] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [familyInfo, setFamilyInfo] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [invitationSlug, setInvitationSlug] = useState('');

  // Events list
  const [events, setEvents] = useState<EventItem[]>([]);

  // Template/theme data
  const [templateIdentifier, setTemplateIdentifier] = useState('');
  const [occasionType, setOccasionType] = useState('wedding');
  const formConfig = getCategoryFormConfig(occasionType);

  // Desktop preview scaling container
  const desktopWrapperRef = useRef<HTMLDivElement>(null);
  const [desktopContainerWidth, setDesktopContainerWidth] = useState(600);

  useEffect(() => {
    if (!desktopWrapperRef.current) return;
    const updateWidth = () => {
      if (desktopWrapperRef.current) {
        setDesktopContainerWidth(desktopWrapperRef.current.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(desktopWrapperRef.current);
    return () => ro.disconnect();
  }, [previewMode]);

  const desktopScale = desktopContainerWidth > 0 ? Math.min(1, desktopContainerWidth / 1200) : 0.5;

  useEffect(() => {
    loadInvitation();
  }, [id]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/api/host/invitations/${id}`);
      const invitation = response.data.invitation;

      // Populate form fields
      const loadedTitle = invitation.title || '';
      setTitle(loadedTitle);
      setTagline(invitation.tagline || '');
      setWelcomeMessage(invitation.welcomeMessage || '');
      setStoryContent(invitation.storyContent || '');
      setFamilyInfo(invitation.familyInfo || '');
      setMusicUrl(invitation.musicUrl || '');
      setHeroImageUrl(invitation.heroImageUrl || '');
      setInvitationSlug(invitation.slug || '');
      setIsPublished(Boolean(invitation.isPublished));
      const occasion = invitation.occasionType || invitation.eventType || invitation.theme?.category || 'wedding';
      setOccasionType(occasion);
      const categoryConfig = getCategoryFormConfig(occasion);

      // Populate events
      const rawEvents = (invitation.events || []).map((e: any) => ({
        id: e.id,
        name: e.name || categoryConfig.defaultEventName,
        eventDate: e.eventDate ? (typeof e.eventDate === 'string' ? e.eventDate.split('T')[0] : new Date(e.eventDate).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
        startTime: e.startTime ? (typeof e.startTime === 'string' ? e.startTime.substring(11, 16) || e.startTime : '18:00') : '18:00',
        endTime: e.endTime ? (typeof e.endTime === 'string' ? e.endTime.substring(11, 16) || e.endTime : '22:00') : '22:00',
        venueName: e.venueName || '',
        venueAddress: e.venueAddress || '',
        mapLink: e.mapLink || '',
        dressCode: e.dressCode || '',
        description: e.description || '',
      }));

      if (rawEvents.length === 0) {
        // Provide a default event tailored to this occasion
        setEvents([
          {
            name: categoryConfig.defaultEventName,
            eventDate: new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0],
            startTime: '18:00',
            endTime: '22:00',
            venueName: categoryConfig.defaultVenuePlaceholder,
            venueAddress: '123 Celebration Boulevard',
            mapLink: 'https://maps.google.com',
            dressCode: categoryConfig.defaultDressCode,
            description: `Join us for an unforgettable ${categoryConfig.badgeLabel.toLowerCase()}!`,
          },
        ]);
      } else {
        setEvents(rawEvents);
      }

      // Extract names
      const extracted = extractCoupleNames(loadedTitle);
      if (extracted.groom !== 'Groom Name') {
        setGroomName(extracted.groom);
      } else if (loadedTitle) {
        setGroomName(loadedTitle.replace(/(birthday|celebration|party|reunion|griha pravesh|shower|invitation|gala)/gi, '').trim());
      }
      if (extracted.bride !== 'Bride Name') {
        setBrideName(extracted.bride);
      }

      // Set template identifier from theme object
      const resolvedIdentifier =
        invitation.theme?.templateComponent ||
        invitation.theme?.slug ||
        invitation.theme?.id ||
        'art-deco-noir';
      setTemplateIdentifier(resolvedIdentifier);
    } catch (err: any) {
      console.error('Load invitation error:', err);
      if (err.response?.status === 404) {
        setError('Invitation not found or you do not have permission to edit it');
      } else {
        setError(err.response?.data?.message || 'Failed to load invitation');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (occasionType === 'wedding' && newTitle.includes('&')) {
      const parts = newTitle.split('&');
      const g = parts[0]?.trim();
      const b = parts[1]?.trim();
      if (g) setGroomName(g);
      if (b) setBrideName(b);
    }
  };

  const handleGroomChange = (newGroom: string) => {
    setGroomName(newGroom);
    if (occasionType === 'wedding') {
      const currentBride = brideName || 'Bride';
      setTitle(`${newGroom || 'Groom'} & ${currentBride}`);
    }
  };

  const handleBrideChange = (newBride: string) => {
    setBrideName(newBride);
    if (occasionType === 'wedding') {
      const currentGroom = groomName || 'Groom';
      setTitle(`${currentGroom} & ${newBride || 'Bride'}`);
    }
  };

  const handleAddEvent = () => {
    const defaultDate = events[0]?.eventDate || new Date().toISOString().split('T')[0];
    setEvents([
      ...events,
      {
        name: 'New Celebration Event',
        eventDate: defaultDate,
        startTime: '19:00',
        endTime: '23:00',
        venueName: 'Palace Pavilion',
        venueAddress: 'Palace Grounds',
        dressCode: 'Evening Elegant',
        description: 'Music, dinner, and cocktails.',
      },
    ]);
  };

  const handleRemoveEvent = (index: number) => {
    if (events.length <= 1) {
      alert('You must have at least one event in your invitation.');
      return;
    }
    setEvents(events.filter((_, i) => i !== index));
  };

  const handleEventChange = (index: number, field: keyof EventItem, value: string) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: value };
    setEvents(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      let finalTitle = title;
      if (occasionType === 'wedding' && groomName && brideName) {
        finalTitle = `${groomName} & ${brideName}`;
        setTitle(finalTitle);
      }

      const updates: any = {
        title: finalTitle,
        tagline: tagline || null,
        welcomeMessage: welcomeMessage || null,
        storyContent: storyContent || null,
        familyInfo: familyInfo || null,
        musicUrl: musicUrl || null,
        heroImageUrl: heroImageUrl || null,
        events: events.map((e, idx) => ({
          name: e.name || `Event ${idx + 1}`,
          eventDate: e.eventDate,
          startTime: e.startTime || null,
          endTime: e.endTime || null,
          venueName: e.venueName || null,
          venueAddress: e.venueAddress || null,
          mapLink: e.mapLink || null,
          dressCode: e.dressCode || null,
          description: e.description || null,
          orderIndex: idx,
        })),
      };

      await api.put(`/api/host/invitations/${id}`, updates);

      setSuccess('Invitation changes saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Generate real-time preview data via adapter
  const previewData = adaptInvitationToTemplateData({
    title,
    groomName,
    brideName,
    tagline,
    welcomeMessage,
    storyContent,
    familyInfo,
    events,
    occasionType,
    heroImageUrl: heroImageUrl || undefined,
    musicUrl: musicEnabled && musicUrl ? musicUrl : undefined,
  });

  const resolvedTemplate = resolveTemplate(templateIdentifier);
  const TemplatePreview = resolvedTemplate?.component;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading invitation editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition flex items-center space-x-1 font-medium text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Dashboard</span>
            </Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-md">
                {title || 'Untitled Invitation'}
              </span>
              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
                {resolvedTemplate?.name || formConfig.badgeLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile View / Form Toggle (only on small screens) */}
            <div className="flex lg:hidden bg-gray-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setMobileTab('form')}
                className={`px-3 py-1.5 rounded-md transition ${
                  mobileTab === 'form' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
                }`}
              >
                ✏️ Edit Form
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('preview')}
                className={`px-3 py-1.5 rounded-md transition ${
                  mobileTab === 'preview' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
                }`}
              >
                👁️ Live Preview
              </button>
            </div>

            {/* Publish & Pay OR Share Live Link */}
            {isPublished ? (
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs sm:text-sm transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <span>✓ Live</span>
                <span>•</span>
                <span>Share Link 🔗</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPaymentModalOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-extrabold rounded-lg text-xs sm:text-sm transition shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center space-x-1.5 cursor-pointer"
              >
                <span>🚀</span>
                <span>Publish &amp; Pay (₹1,499)</span>
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 transition disabled:opacity-50 flex items-center space-x-2 text-sm shadow-sm"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notifications */}
      {success && (
        <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-4 py-2.5 text-center text-sm font-medium animate-fadeIn">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-rose-50 border-b border-rose-200 text-rose-800 px-4 py-2.5 text-center text-sm font-medium animate-fadeIn">
          ❌ {error}
        </div>
      )}

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Editor (8 cols on desktop) */}
          <div className={`lg:col-span-6 xl:col-span-6 space-y-6 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            {/* Editor Tab Navigation */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-1 flex space-x-1 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition text-center ${
                  activeTab === 'details'
                    ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                💍 Couple & Tagline
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('events')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition text-center ${
                  activeTab === 'events'
                    ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                🗓️ Events ({events.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('story')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition text-center ${
                  activeTab === 'story'
                    ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📖 Story & Family
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition text-center ${
                  activeTab === 'media'
                    ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                🎵 Music & Details
              </button>
            </div>

            {/* TAB 1: General & Host/Honoree Info */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{formConfig.badgeEmoji}</span>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {formConfig.tabDetailsTitle}
                      </h2>
                      <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                        {formConfig.badgeLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formConfig.titleLabel}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                    placeholder={formConfig.titlePlaceholder}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formConfig.titleHelp}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formConfig.primaryNameLabel}
                    </label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => handleGroomChange(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                      placeholder={formConfig.primaryNamePlaceholder}
                    />
                    {formConfig.primaryNameHelp && (
                      <p className="text-xs text-gray-400 mt-0.5">{formConfig.primaryNameHelp}</p>
                    )}
                  </div>
                  {formConfig.showSecondaryName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {formConfig.secondaryNameLabel}
                      </label>
                      <input
                        type="text"
                        value={brideName}
                        onChange={(e) => handleBrideChange(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                        placeholder={formConfig.secondaryNamePlaceholder}
                      />
                      {formConfig.secondaryNameHelp && (
                        <p className="text-xs text-gray-400 mt-0.5">{formConfig.secondaryNameHelp}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formConfig.taglineLabel}
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                    placeholder={formConfig.taglinePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formConfig.welcomeLabel}
                  </label>
                  <textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                    placeholder={formConfig.welcomePlaceholder}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Events Itinerary */}
            {activeTab === 'events' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{formConfig.eventsHeader}</h2>
                    <p className="text-xs text-gray-500">{formConfig.eventsSubheader}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEvent}
                    className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-sm font-semibold transition flex items-center space-x-1"
                  >
                    <span>{formConfig.addEventButton}</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {events.map((event, idx) => (
                    <div
                      key={idx}
                      className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-md">
                          Event #{idx + 1}
                        </span>
                        {events.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEvent(idx)}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded font-medium transition"
                          >
                            Remove 🗑️
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Event Title *
                          </label>
                          <input
                            type="text"
                            value={event.name}
                            onChange={(e) => handleEventChange(idx, 'name', e.target.value)}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-500"
                            placeholder="e.g., Sangeet & Reception"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Date *
                          </label>
                          <input
                            type="date"
                            value={event.eventDate}
                            onChange={(e) => handleEventChange(idx, 'eventDate', e.target.value)}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={event.startTime || '18:00'}
                              onChange={(e) => handleEventChange(idx, 'startTime', e.target.value)}
                              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={event.endTime || '22:00'}
                              onChange={(e) => handleEventChange(idx, 'endTime', e.target.value)}
                              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Venue Name
                          </label>
                          <input
                            type="text"
                            value={event.venueName || ''}
                            onChange={(e) => handleEventChange(idx, 'venueName', e.target.value)}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-500"
                            placeholder="e.g., The Taj Palace Ballroom"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Dress Code
                          </label>
                          <input
                            type="text"
                            value={event.dressCode || ''}
                            onChange={(e) => handleEventChange(idx, 'dressCode', e.target.value)}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-500"
                            placeholder="e.g., Traditional Festive / Royal Pastels"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Venue Address
                          </label>
                          <input
                            type="text"
                            value={event.venueAddress || ''}
                            onChange={(e) => handleEventChange(idx, 'venueAddress', e.target.value)}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-500"
                            placeholder="e.g., 1 Palace Road, Jaipur"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Google Maps Link
                          </label>
                          <input
                            type="url"
                            value={event.mapLink || ''}
                            onChange={(e) => handleEventChange(idx, 'mapLink', e.target.value)}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-rose-500"
                            placeholder="https://maps.google.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Story & Family / Hosts */}
            {activeTab === 'story' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  {formConfig.tabStoryTitle}
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formConfig.storyLabel}
                  </label>
                  <textarea
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder={formConfig.storyPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formConfig.familyLabel}
                  </label>
                  <textarea
                    value={familyInfo}
                    onChange={(e) => setFamilyInfo(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder={formConfig.familyPlaceholder}
                  />
                </div>
              </div>
            )}

            {/* TAB 4: Music & Media */}
            {activeTab === 'media' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  Background Music & Media
                </h2>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ambient Music
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={musicEnabled}
                        onChange={(e) => setMusicEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Plays soft ambient celebration music when guests tap the music button.
                  </p>
                  <input
                    type="url"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="Custom audio MP3 URL (optional, uses template soundtrack by default)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero / Portrait Image URL
                  </label>
                  <input
                    type="url"
                    value={heroImageUrl}
                    onChange={(e) => setHeroImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="https://images.unsplash.com/... (optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Custom couple photo displayed in the hero section.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Interactive Preview (6 cols on desktop) */}
          <div className={`lg:col-span-6 xl:col-span-6 ${mobileTab === 'form' ? 'hidden lg:block' : 'block'}`}>
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Preview Toolbar */}
                <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-semibold text-xs tracking-wider uppercase text-gray-200">
                      Live Preview
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Viewport Toggles */}
                    <div className="bg-gray-800 p-0.5 rounded-lg flex space-x-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewMode('mobile')}
                        className={`px-3 py-1 rounded transition ${
                          previewMode === 'mobile'
                            ? 'bg-rose-600 text-white font-medium shadow-xs'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        📱 Phone
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode('desktop')}
                        className={`px-3 py-1 rounded transition ${
                          previewMode === 'desktop'
                            ? 'bg-rose-600 text-white font-medium shadow-xs'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        💻 Desktop
                      </button>
                    </div>

                    {/* Open in Fullscreen link */}
                    {resolvedTemplate?.slug && (
                      <Link
                        to={invitationSlug ? `/i/${invitationSlug}` : `/templates/${resolvedTemplate.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 p-1.5 rounded-lg transition"
                        title="Open full page preview in new tab"
                      >
                        🔗
                      </Link>
                    )}
                  </div>
                </div>

                {/* Preview Stage Container */}
                <div className="p-4 sm:p-6 bg-gray-100 flex justify-center items-center overflow-x-hidden min-h-[700px]">
                  {TemplatePreview ? (
                    previewMode === 'mobile' ? (
                      /* Mobile Phone Frame Mockup with Isolated 375px Viewport */
                      <MobilePhoneMockup height={720} className="template-preview-container">
                        <TemplatePreview data={previewData} />
                      </MobilePhoneMockup>
                    ) : (
                      /* Desktop Monitor / Browser Window Mockup Frame */
                      <div
                        ref={desktopWrapperRef}
                        className="w-full h-[720px] rounded-2xl border border-gray-300 dark:border-gray-700 shadow-2xl bg-gray-900 flex flex-col overflow-hidden relative"
                      >
                        {/* Desktop Browser Chrome Header */}
                        <div className="h-10 bg-gray-800 border-b border-gray-700 px-4 flex items-center justify-between shrink-0 select-none">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1.5">
                              <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block shadow-xs" />
                              <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block shadow-xs" />
                              <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block shadow-xs" />
                            </div>
                            <span className="text-gray-400 text-xs ml-2 hidden sm:inline font-medium">Desktop Window</span>
                          </div>

                          <div className="bg-gray-900/90 text-gray-300 text-xs px-3 py-1 rounded-md border border-gray-700/80 flex items-center space-x-1.5 font-mono max-w-[240px] truncate shadow-inner">
                            <span className="text-emerald-400 text-[10px]">🔒</span>
                            <span className="truncate">invitehub.io/i/{invitationSlug || 'preview'}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono bg-gray-700/80 text-gray-300 px-2 py-0.5 rounded">
                              1200px ({Math.round(desktopScale * 100)}%)
                            </span>
                          </div>
                        </div>

                        {/* Scaled Desktop Viewport Canvas */}
                        <div
                          className="flex-1 overflow-y-auto overflow-x-hidden relative bg-white template-preview-container"
                          style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
                        >
                          <div
                            style={{
                              width: '1200px',
                              minWidth: '1200px',
                              transform: `scale(${desktopScale})`,
                              transformOrigin: '0 0',
                            }}
                          >
                            <TemplatePreview data={previewData} />
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <div className="text-4xl mb-3">⚠️</div>
                      <p className="font-semibold text-gray-700">Template Preview Not Available</p>
                      <p className="text-xs text-gray-400 mt-2">Component: {templateIdentifier || '(none)'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        invitationId={id || ''}
        invitationTitle={title || 'Celebration Invitation'}
        invitationSlug={invitationSlug || ''}
        occasionType={occasionType}
        onPaymentSuccess={() => {
          setIsPublished(true);
          setSuccess('🎉 Payment verified! Your invitation is now officially live for guests.');
        }}
      />

      {/* Share Modal (When Already Published) */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 relative animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💌</span>
                <div>
                  <h3 className="font-bold text-white text-base">Share Public Invitation</h3>
                  <p className="text-xs text-slate-400">Send this link to family and friends</p>
                </div>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl mb-5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                Public Shareable Link:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/i/${invitationSlug}`}
                  className="w-full bg-slate-900 border border-slate-700 text-white font-mono text-xs px-3 py-2 rounded-xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/i/${invitationSlug}`);
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 2500);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    shareCopied ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  }`}
                >
                  {shareCopied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`/i/${invitationSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5"
              >
                <span>Open Site</span>
                <span>↗</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `✨ You're warmly invited! View our celebration website here: ${window.location.origin}/i/${invitationSlug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5"
              >
                <span>WhatsApp</span>
                <span>💬</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
