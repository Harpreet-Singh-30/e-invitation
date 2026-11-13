import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { createAmbientPlayer } from '../common/audio';

interface TemplateProps {
  data: {
    couple: {
      groom: string;
      bride: string;
      tagline?: string;
    };
    events: Array<{
      key: string;
      title: string;
      date: string;
      time?: string;
      venue: string;
      address?: string;
      mapUrl?: string;
    }>;
    gallery?: string[];
    music?: {
      enabled: boolean;
      trackId?: string;
    };
    message?: string;
    previewOpened?: boolean;
  };
}

// Function color presets based on traditional event themes
const EVENT_THEME_MAP: Record<string, { badge: string; accent: string; icon: string; defaultVibe: string }> = {
  haldi: {
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    accent: '#f59e0b',
    icon: '☀️',
    defaultVibe: 'Yellow & Mustard Traditional'
  },
  mehendi: {
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    accent: '#059669',
    icon: '🌿',
    defaultVibe: 'Henna Green & Bohemian Chic'
  },
  sangeet: {
    badge: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300',
    accent: '#c026d3',
    icon: '🪕',
    defaultVibe: 'Glitz, Glamour & Indo-Western'
  },
  wedding: {
    badge: 'bg-red-100 text-red-900 border-red-300',
    accent: '#dc2626',
    icon: '🌺',
    defaultVibe: 'Traditional Royal Indian'
  },
  ceremony: {
    badge: 'bg-red-100 text-red-900 border-red-300',
    accent: '#dc2626',
    icon: '🌺',
    defaultVibe: 'Traditional Formal'
  },
  reception: {
    badge: 'bg-purple-100 text-purple-900 border-purple-300',
    accent: '#7e22ce',
    icon: '✨',
    defaultVibe: 'Black Tie & Evening Elegance'
  }
};

export default function MarigoldCourtyardTemplate({ data }: TemplateProps) {
  const [opened, setOpened] = useState(data.previewOpened || false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [selectedEventKey, setSelectedEventKey] = useState<string>(
    data.events[0]?.key || 'wedding'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

  const mainEvent = data.events.find(e => e.key === 'wedding' || e.key.includes('ceremony')) || data.events[0] || {
    key: 'wedding',
    title: 'The Wedding Ceremony',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    time: '6:30 PM Onwards',
    venue: 'The Courtyard Pavilion',
    address: 'Grand Heritage Palace, Jaipur, Rajasthan',
    mapUrl: '#'
  };

  useEffect(() => {
    playerRef.current = createAmbientPlayer();
    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!playerRef.current) return;
    const playing = playerRef.current.toggle('festive', data.music?.trackId);
    setIsPlayingMusic(playing);
  };

  const copyAddress = (key: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2500);
      });
    }
  };

  const parsedMainDate = (() => {
    try {
      const d = new Date(mainEvent.date);
      return isNaN(d.getTime()) ? new Date() : d;
    } catch {
      return new Date();
    }
  })();

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = parsedMainDate.getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [mainEvent.date]);

  // Opening screen
  if (!opened) {
    return (
      <div 
        className="min-h-screen h-screen max-h-screen bg-gradient-to-b from-[#fff7ed] via-[#fef3c7]/60 to-[#fff7ed] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden select-none"
        style={{ fontFamily: "'Playfair Display', 'Lora', serif" }}
      >
        {/* Decorative Marigold Garland Toran at Top */}
        <div className="absolute top-0 left-0 right-0 h-12 sm:h-20 flex justify-around pointer-events-none opacity-90 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
              <span className="w-0.5 h-4 sm:h-6 bg-[#d97706]/40" />
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#ea580c] to-[#f59e0b] shadow-md border border-[#fef08a]" />
            </div>
          ))}
        </div>

        {/* Outer Festive Border */}
        <div className="absolute inset-2 sm:inset-8 border-2 border-[#ea580c]/30 rounded-3xl pointer-events-none" />
        <div className="absolute inset-4 sm:inset-10 border border-[#d97706]/20 rounded-2xl pointer-events-none" />

        {/* Central Card */}
        <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-10 text-center shadow-2xl border-2 border-[#ea580c]/20 z-10 relative max-h-[92vh] overflow-hidden flex flex-col justify-center">
          {/* Shubh Vivah Kalash Emblem */}
          <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-4 text-[#ea580c] flex items-center justify-center">
            <FestiveKalashIcon />
          </div>

          <p className="text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase text-[#b91c1c] font-bold mb-1 sm:mb-2">
            || शुभ विवाह • Auspicious Celebrations ||
          </p>

          <h1 className="text-2xl sm:text-4xl text-[#7c2d12] font-bold tracking-tight mb-1 sm:mb-2">
            {data.couple.groom}
          </h1>

          <div className="flex items-center justify-center space-x-3 my-1 sm:my-2 text-[#ea580c]">
            <span className="h-0.5 w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#ea580c]" />
            <span className="text-base sm:text-xl font-bold font-serif italic text-[#d97706]">weds</span>
            <span className="h-0.5 w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#ea580c]" />
          </div>

          <h1 className="text-2xl sm:text-4xl text-[#7c2d12] font-bold tracking-tight mb-2 sm:mb-4">
            {data.couple.bride}
          </h1>

          <p className="text-xs sm:text-sm text-[#9a3412] italic mb-4 sm:mb-8 max-w-xs mx-auto line-clamp-2">
            {data.couple.tagline || 'Together with our families, we invite you to celebrate our union of hearts and joyous traditions'}
          </p>

          {/* Interactive Button */}
          <button
            onClick={() => setOpened(true)}
            className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-[#ea580c] via-[#d97706] to-[#b91c1c] text-white rounded-2xl text-xs sm:text-sm font-sans font-bold tracking-widest uppercase shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.99] transition duration-200"
          >
            🌼 Unfold Wedding Itinerary 🌼
          </button>

          <p className="text-[10px] sm:text-[11px] text-[#9a3412] tracking-wider uppercase mt-3 sm:mt-5 font-sans">
            Festivities • Haldi • Sangeet • Shaadi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#fffdfa] text-[#431407] selection:bg-[#ea580c]/20 selection:text-[#7c2d12]"
      style={{ fontFamily: "'Playfair Display', 'Lora', serif" }}
    >
      {/* Sticky Header with Festive Controls */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#fed7aa] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌼</span>
            <span className="font-bold text-[#7c2d12] text-sm sm:text-base tracking-tight truncate max-w-[130px] sm:max-w-none">
              {data.couple.groom} & {data.couple.bride}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-sans">
            <button
              onClick={toggleMusic}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border transition ${
                isPlayingMusic 
                  ? 'bg-[#ea580c] text-white border-[#ea580c]' 
                  : 'bg-[#fff7ed] text-[#7c2d12] border-[#fdba74] hover:bg-[#ffedd5]'
              }`}
              title={isPlayingMusic ? 'Mute dhol/shehnai melody' : 'Play shehnai melody'}
            >
              <span>{isPlayingMusic ? '🎶' : '🪕'}</span>
              <span className="font-medium">{isPlayingMusic ? 'Music Playing' : 'Play Shehnai'}</span>
            </button>

            <a
              href="#itinerary"
              className="text-[#7c2d12] hover:text-[#ea580c] font-semibold uppercase tracking-wider hidden sm:inline"
            >
              Events
            </a>
            <a
              href="#venue"
              className="text-[#7c2d12] hover:text-[#ea580c] font-semibold uppercase tracking-wider hidden sm:inline"
            >
              Venue
            </a>
          </div>
        </div>
      </nav>

      {/* Decorative Toran Banner */}
      <div className="h-3 bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#dc2626]" />

      {/* HERO SECTION */}
      <section className="relative px-4 pt-12 pb-20 text-center bg-gradient-to-b from-[#fff7ed] to-[#fffdfa] overflow-hidden">
        {/* Hanging Marigolds Graphic */}
        <div className="flex justify-center space-x-6 sm:space-x-12 mb-6 pointer-events-none opacity-80">
          {[0, 1, 2, 3, 4].map(idx => (
            <div key={idx} className="flex flex-col items-center">
              <span className={`w-0.5 ${idx % 2 === 0 ? 'h-10 sm:h-14' : 'h-6 sm:h-8'} bg-[#d97706]/40`} />
              <span className="text-2xl sm:text-3xl filter drop-shadow">🌼</span>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-sans font-bold tracking-[0.3em] uppercase text-[#ea580c] mb-3">
            Celebrate With Us
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#7c2d12] tracking-tight leading-tight mb-2">
            {data.couple.groom}
          </h1>

          <div className="flex items-center justify-center my-3 text-[#ea580c]">
            <span className="h-0.5 w-16 bg-[#ea580c]/30" />
            <span className="mx-4 text-2xl font-serif italic text-[#d97706]">weds</span>
            <span className="h-0.5 w-16 bg-[#ea580c]/30" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#7c2d12] tracking-tight leading-tight mb-6">
            {data.couple.bride}
          </h1>

          {data.couple.tagline && (
            <p className="text-lg sm:text-xl text-[#9a3412] italic font-serif max-w-xl mx-auto mb-8">
              "{data.couple.tagline}"
            </p>
          )}

          {/* Main Wedding Date Pill */}
          <div className="inline-flex flex-col sm:flex-row items-center bg-white border-2 border-[#fed7aa] rounded-2xl px-6 py-4 shadow-sm gap-2 sm:gap-6">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#ea580c] block">
                Main Wedding Ceremony
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#7c2d12]">
                {format(parsedMainDate, 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="h-8 w-px bg-[#fed7aa] hidden sm:block" />
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#ea580c] block">
                Auspicious Timing
              </span>
              <span className="text-base sm:text-lg font-semibold text-[#431407]">
                {mainEvent.time || 'Evening Celebrations'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN SECTION - Brass Medallion Style */}
      <section className="py-12 px-4 bg-[#fef3c7]/40 border-y border-[#fde68a]">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-sans font-bold uppercase tracking-widest text-[#b45309] mb-5">
            The Festivities Begin In
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Mins' },
              { val: timeLeft.seconds, label: 'Secs' },
            ].map((box, i) => (
              <div key={i} className="bg-white rounded-2xl p-2 sm:p-3 border-2 border-[#fcd34d] shadow-sm">
                <span className="block text-xl sm:text-3xl font-bold text-[#b45309]">
                  {box.val}
                </span>
                <span className="text-[9px] sm:text-[10px] font-sans uppercase font-bold tracking-wider text-[#92400e]">
                  {box.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAMILY INVITATION / MESSAGE */}
      {data.message && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-3xl mb-4 block">🙏</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#7c2d12] mb-4">
              With Love & Family Blessings
            </h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto rounded-full mb-6" />

            <div className="text-base sm:text-lg text-[#7c2d12]/80 leading-relaxed whitespace-pre-line font-serif">
              {data.message}
            </div>
          </div>
        </section>
      )}

      {/* MULTI-EVENT WEDDING ITINERARY */}
      <section id="itinerary" className="py-16 px-4 bg-[#fff7ed]/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-sans font-bold uppercase tracking-[0.25em] text-[#ea580c] block mb-2">
              Function Itinerary
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#7c2d12]">
              The Wedding Celebrations
            </h2>
            <p className="text-sm text-[#9a3412] mt-2 font-sans">
              Join us for every colorful moment, ritual, and celebration
            </p>
          </div>

          {/* Event Quick Tabs if more than 1 event */}
          {data.events.length > 1 && (
            <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 px-2 pb-2 justify-start sm:justify-center">
              {data.events.map((ev, i) => {
                const isSelected = (ev.key || String(i)) === selectedEventKey;
                const keyLower = (ev.key || ev.title || '').toLowerCase();
                const theme = Object.keys(EVENT_THEME_MAP).find(k => keyLower.includes(k));
                const meta = theme ? EVENT_THEME_MAP[theme] : EVENT_THEME_MAP.wedding;

                return (
                  <button
                    key={ev.key || i}
                    onClick={() => setSelectedEventKey(ev.key || String(i))}
                    className={`px-4 py-2 rounded-full text-xs font-sans font-bold tracking-wide transition flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-[#ea580c] text-white shadow-md'
                        : 'bg-white text-[#7c2d12] border border-[#fed7aa] hover:bg-[#ffedd5]'
                    }`}
                  >
                    <span>{meta.icon}</span>
                    <span>{ev.title}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Event Cards Grid / List */}
          <div className="grid md:grid-cols-2 gap-6">
            {data.events.map((event, idx) => {
              let evDate = new Date();
              try {
                const parsed = new Date(event.date);
                if (!isNaN(parsed.getTime())) evDate = parsed;
              } catch {}

              const keyLower = (event.key || event.title || '').toLowerCase();
              const matchedTheme = Object.keys(EVENT_THEME_MAP).find(k => keyLower.includes(k));
              const theme = matchedTheme ? EVENT_THEME_MAP[matchedTheme] : EVENT_THEME_MAP.wedding;
              const isHighlighted = (event.key || String(idx)) === selectedEventKey;

              return (
                <div
                  key={event.key || idx}
                  className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all duration-300 shadow-sm flex flex-col justify-between ${
                    isHighlighted 
                      ? 'border-[#ea580c] ring-2 ring-[#ea580c]/20 shadow-md scale-[1.01]' 
                      : 'border-[#fed7aa] hover:border-[#ea580c]/60'
                  }`}
                >
                  <div>
                    {/* Header: Badge & Function index */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-sans font-bold border ${theme.badge}`}>
                        {theme.icon} {event.title}
                      </span>
                      <span className="text-xs font-sans text-[#9a3412] font-semibold">
                        Function {idx + 1} of {data.events.length}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-[#7c2d12] mb-1">
                      {event.title}
                    </h3>

                    <p className="text-sm font-sans font-semibold text-[#ea580c] mb-3">
                      📅 {format(evDate, 'EEEE, MMMM d, yyyy')}
                      {event.time && ` • ⏰ ${event.time}`}
                    </p>

                    <div className="bg-[#fff7ed] rounded-2xl p-4 mb-4 border border-[#fed7aa]">
                      <p className="text-xs font-sans uppercase font-bold text-[#9a3412] mb-1">
                        Venue
                      </p>
                      <p className="font-bold text-[#431407] text-base">
                        {event.venue}
                      </p>
                      {event.address && (
                        <p className="text-xs text-[#7c2d12]/70 font-sans mt-0.5">
                          {event.address}
                        </p>
                      )}

                      <div className="mt-3 pt-2 border-t border-[#fed7aa]/60 flex items-center justify-between text-xs font-sans">
                        <span className="text-[#9a3412] font-medium">Attire:</span>
                        <span className="font-semibold text-[#7c2d12]">{theme.defaultVibe}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2">
                    <a
                      href={event.mapUrl && event.mapUrl !== '#' ? event.mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.address || ''}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-sans font-bold text-center tracking-wide transition shadow-xs"
                    >
                      📍 Open Directions
                    </a>
                    {event.address && (
                      <button
                        onClick={() => copyAddress(event.key || String(idx), `${event.venue}, ${event.address}`)}
                        className="py-2.5 px-3 bg-[#ffedd5] hover:bg-[#fed7aa] text-[#7c2d12] rounded-xl text-xs font-sans font-medium transition"
                        title="Copy Address"
                      >
                        {copiedKey === (event.key || String(idx)) ? '✓ Copied' : '📋 Copy'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PHOTO MEMORIES / GALLERY */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-sans font-bold uppercase tracking-[0.25em] text-[#ea580c] block mb-2">
            Captured Moments
          </span>
          <h2 className="text-3xl font-bold text-[#7c2d12] mb-8">
            Moments of Laughter & Love
          </h2>

          {data.gallery && data.gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.gallery.map((url, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-[#fed7aa] hover:rotate-1 transition-transform">
                  <img src={url} alt="Wedding gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#fff7ed] to-[#fef3c7] border-2 border-[#fed7aa] max-w-lg mx-auto">
              <span className="text-4xl mb-3 block">🪘✨🎺</span>
              <h3 className="text-xl font-bold text-[#7c2d12] mb-2 font-serif">
                Two Families, Infinite Celebrations
              </h3>
              <p className="text-sm text-[#9a3412] font-sans">
                "May our laughter echo across every celebration, and our bond grow stronger with every ritual."
              </p>
            </div>
          )}
        </div>
      </section>

      {/* VENUE & DIRECTIONS HIGHLIGHT */}
      <section id="venue" className="py-16 px-4 bg-[#fef3c7]/30 border-t border-[#fed7aa]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-sans font-bold uppercase tracking-[0.25em] text-[#ea580c] block mb-2">
            Location & Directions
          </span>
          <h2 className="text-3xl font-bold text-[#7c2d12] mb-6">
            Celebration Venue
          </h2>

          <div className="bg-white rounded-3xl p-8 border-2 border-[#fed7aa] shadow-md max-w-lg mx-auto">
            <span className="text-3xl mb-2 block">🏰</span>
            <h3 className="text-2xl font-bold text-[#7c2d12] mb-2">
              {mainEvent.venue}
            </h3>
            {mainEvent.address && (
              <p className="text-sm font-sans text-[#7c2d12]/80 mb-6 leading-relaxed">
                {mainEvent.address}
              </p>
            )}

            <div className="flex justify-center gap-3">
              <a
                href={mainEvent.mapUrl && mainEvent.mapUrl !== '#' ? mainEvent.mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${mainEvent.venue} ${mainEvent.address || ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-[#ea580c] to-[#d97706] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md hover:scale-[1.02] transition"
              >
                📍 Open Google Maps
              </a>
              {mainEvent.address && (
                <button
                  onClick={() => copyAddress('main-venue-m', `${mainEvent.venue}, ${mainEvent.address}`)}
                  className="px-4 py-3 bg-[#ffedd5] text-[#7c2d12] font-sans font-semibold text-xs rounded-2xl hover:bg-[#fed7aa] transition"
                >
                  {copiedKey === 'main-venue-m' ? '✓ Copied' : 'Copy Address'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FESTIVE CLOSING FOOTER */}
      <footer className="py-16 px-4 bg-gradient-to-b from-[#7c2d12] to-[#431407] text-[#fed7aa] text-center">
        <div className="max-w-md mx-auto">
          <div className="text-3xl mb-3">🌼 🪕 🌼</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {data.couple.groom} & {data.couple.bride}
          </h3>
          <p className="text-sm italic text-[#fed7aa]/90 font-serif mb-6">
            Dhol, dhamaka, and heartfelt memories await! We cannot celebrate without your presence.
          </p>
          <div className="h-px w-20 bg-[#fed7aa]/30 mx-auto mb-6" />
          <p className="text-[11px] font-sans uppercase tracking-widest text-[#fed7aa]/60">
            Powered with joy by InviteHub
          </p>
        </div>
      </footer>
    </div>
  );
}

// Custom Festive Kalash Icon
function FestiveKalashIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      {/* Mango leaves at top */}
      <path d="M32 10C30 18 22 22 20 24C26 24 30 20 32 10Z" fill="#f59e0b" fillOpacity="0.4" />
      <path d="M32 10C34 18 42 22 44 24C38 24 34 20 32 10Z" fill="#f59e0b" fillOpacity="0.4" />
      <path d="M32 6C32 14 32 20 32 24" stroke="#ea580c" />
      {/* Coconut */}
      <circle cx="32" cy="22" r="6" fill="#7c2d12" fillOpacity="0.2" />
      {/* Kalash Pot Body */}
      <path d="M22 26H42L45 34C47 42 43 52 32 54C21 52 17 42 19 34L22 26Z" fill="#ea580c" fillOpacity="0.15" />
      {/* Swastika / Shubh motif lines on pot */}
      <line x1="32" y1="34" x2="32" y2="46" stroke="#b91c1c" />
      <line x1="26" y1="40" x2="38" y2="40" stroke="#b91c1c" />
      {/* Base */}
      <path d="M24 54H40L42 58H22L24 54Z" fill="#d97706" />
    </svg>
  );
}

