import { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { createAmbientPlayer } from '../common/audio';

interface TemplateProps {
  data: {
    title?: string;
    couple?: {
      groom?: string; // Family / Host name
      bride?: string;
      tagline?: string;
    };
    events?: Array<{
      key: string;
      title: string;
      date: string;
      time?: string;
      venue: string;
      address?: string;
      mapUrl?: string;
      description?: string;
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

export default function HearthHeritageTemplate({ data }: TemplateProps) {
  const isThumbnail = Boolean((data as any)?._isThumbnail || (data as any)?.options?.intro === false || (data as any)?.previewOpened);
  const [opened, setOpened] = useState(isThumbnail);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

  const familyName = data.couple?.groom && data.couple.groom !== 'Groom Name'
    ? (data.couple.bride ? `${data.couple.groom} & ${data.couple.bride}` : data.couple.groom)
    : (data.title?.replace(/housewarming|griha|pravesh|invitation/gi, '').trim() || 'The Sharma Family');

  const tagline = data.couple?.tagline || 'New Home, New Memories, Boundless Love & Blessings';

  const defaultEvents = [
    {
      key: 'puja',
      title: 'Auspicious Griha Pravesh & Vastu Havan',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      time: '9:30 AM',
      venue: 'Our New Home — "Aashiyana"',
      address: 'Villa 42, Palm Meadows, Sarjapur Road, Bangalore',
      mapUrl: 'https://maps.google.com',
      description: 'Sacred Vastu Shanti puja, boiling of milk ritual, and divine blessings for health, harmony and prosperity.'
    },
    {
      key: 'dinner',
      title: 'House Tour, High Tea & Dinner Feast',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      time: '6:30 PM Onwards',
      venue: 'Our New Home — "Aashiyana"',
      address: 'Villa 42, Palm Meadows, Sarjapur Road, Bangalore',
      mapUrl: 'https://maps.google.com',
      description: 'Explore our new abode, enjoy tea and snacks in the garden, followed by an authentic celebratory dinner feast.'
    }
  ];

  const events = data.events && data.events.length > 0 ? data.events : defaultEvents;
  const mainEvent = events[0] || defaultEvents[0];

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
    const playing = playerRef.current.toggle('shehnai', data.music?.trackId);
    setIsPlayingMusic(playing);
  };

  const copyAddress = (key: string, addressText: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(addressText).then(() => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2500);
      });
    }
  };

  const targetDate = useMemo(() => {
    try {
      const d = new Date(mainEvent.date);
      return isNaN(d.getTime()) ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) : d;
    } catch {
      return new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    }
  }, [mainEvent.date]);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // CLOSED STATE: Warm Terracotta & Golden Key Envelope
  if (!opened) {
    return (
      <div
        className="min-h-screen bg-[#24130d] text-[#faede7] flex items-center justify-center p-4 relative overflow-hidden select-none"
        style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif" }}
      >
        {/* Warm Terracotta Ambient Light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4a2416] via-[#24130d] to-[#120805] opacity-90" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#f59e0b]/10 blur-3xl pointer-events-none" />

        {/* Auspicious Toran Border Frame */}
        <div className="absolute inset-3 sm:inset-6 border border-[#d97706]/35 rounded-2xl pointer-events-none" />
        <div className="absolute inset-5 sm:inset-8 border border-[#d97706]/15 rounded-xl pointer-events-none" />

        {/* Central Card */}
        <div className="relative max-w-md w-full bg-[#2f1911]/95 border border-[#d97706]/40 rounded-2xl p-6 sm:p-10 text-center shadow-2xl backdrop-blur-md">
          {/* Traditional Brass Diya & Key Motif */}
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 mb-4 flex items-center justify-center rounded-full bg-[#d97706]/15 border border-[#d97706]/50 text-[#f59e0b]">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>

          <p className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#f59e0b] font-medium mb-3">
            शुभ गृह प्रवेश • Griha Pravesh
          </p>

          <h2 className="text-sm uppercase tracking-widest text-amber-200/80 mb-1 font-sans">
            Warmly Welcomed By
          </h2>
          <h1 className="text-2xl sm:text-4xl text-white font-bold tracking-wide mb-3">
            {familyName}
          </h1>

          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent mx-auto my-3" />

          <p className="text-xs sm:text-sm text-[#faede7]/80 italic mb-8 max-w-xs mx-auto leading-relaxed">
            {tagline}
          </p>

          {/* Reveal Button */}
          <button
            onClick={() => setOpened(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] text-[#24130d] font-bold rounded-full text-xs uppercase tracking-[0.25em] transition-all duration-300 shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.7)] hover:scale-[1.03] active:scale-95"
          >
            <span>Step Inside Our Home 🏡</span>
          </button>

          <p className="text-[10px] text-amber-300/60 tracking-widest uppercase mt-6">
            Tap to open the housewarming invitation
          </p>
        </div>
      </div>
    );
  }

  // OPENED STATE: Full Housewarming Celebration
  return (
    <div
      className="min-h-screen bg-[#1a0d08] text-[#faede7] relative overflow-x-hidden selection:bg-[#d97706]/30 selection:text-[#f59e0b]"
      style={{ fontFamily: "'Cormorant Garamond', 'Cinzel', serif" }}
    >
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-[#1a0d08]/90 backdrop-blur-md border-b border-[#d97706]/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-[#1a0d08] flex items-center justify-center text-xs font-bold font-serif">
              🏡
            </span>
            <span className="text-xs font-bold tracking-widest text-white uppercase truncate max-w-[150px] sm:max-w-none">
              Griha Pravesh • {familyName}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-full border text-xs transition flex items-center space-x-1.5 ${
                isPlayingMusic
                  ? 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b]'
                  : 'border-white/10 hover:border-white/30 text-gray-400'
              }`}
              title={isPlayingMusic ? 'Mute Music' : 'Play Festive Shehnai'}
            >
              <span>{isPlayingMusic ? '🎵' : '🔇'}</span>
              <span className="hidden sm:inline text-[11px] font-sans tracking-wide">
                {isPlayingMusic ? 'Music On' : 'Music Off'}
              </span>
            </button>

            <a
              href="#rsvp"
              className="px-4 py-1.5 bg-[#d97706] text-[#1a0d08] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#f59e0b] transition font-sans"
            >
              RSVP
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#4a2416]/70 via-[#1a0d08] to-[#1a0d08] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#d97706]/40 bg-[#d97706]/15 text-[#f59e0b] text-xs font-sans tracking-[0.3em] uppercase">
            <span>✨ Griha Pravesh & Housewarming ✨</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            {familyName}
          </h1>

          <p className="text-xl sm:text-2xl text-[#f59e0b] italic font-serif">
            Welcome you to our new sweet home
          </p>

          <p className="text-sm sm:text-base text-[#faede7]/80 max-w-xl mx-auto leading-relaxed">
            "{tagline}"
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-sans tracking-wider uppercase text-gray-300">
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              📅 {format(targetDate, 'EEEE, MMMM d, yyyy')}
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              📍 {mainEvent.venue}
            </span>
          </div>

          {/* Countdown Clock */}
          <div className="pt-8">
            <p className="text-xs tracking-[0.25em] uppercase text-[#f59e0b]/80 font-sans mb-3">
              Counting Down to the Auspicious Muhurat
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm sm:max-w-md mx-auto">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.minutes },
                { label: 'Secs', val: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#2f1911]/80 border border-[#d97706]/35 rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm shadow-md"
                >
                  <span className="block text-xl sm:text-3xl font-bold text-[#f59e0b] font-mono">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] sm:text-xs font-sans uppercase text-gray-400 tracking-wider mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* House Blessing Note */}
      <section className="py-16 px-4 bg-[#26130b]/60 border-y border-white/5">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-3xl">🪔</span>
          <h2 className="text-2xl sm:text-3xl text-[#f59e0b] font-bold tracking-wide">
            With the Grace of the Almighty
          </h2>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed italic font-serif">
            {data.message ||
              "Bricks and mortar build a house, but love, laughter, and lifelong friends turn it into a home. We are truly thrilled to step into our new threshold, and our joy will be complete only when you grace our home with your presence and blessings."}
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f59e0b] font-sans font-medium mb-2">
            The Day's Ceremonies
          </p>
          <h2 className="text-3xl sm:text-4xl text-white font-bold tracking-tight">
            Auspicious Itinerary
          </h2>
        </div>

        <div className="space-y-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-[#2a160d]/80 border border-[#d97706]/25 hover:border-[#d97706]/60 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-sans uppercase font-bold text-[#f59e0b] tracking-widest">
                    Part {idx + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl text-white font-semibold mt-0.5">
                    {event.title}
                  </h3>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#d97706]/20 text-[#f59e0b] text-xs font-mono font-medium self-start sm:self-auto font-sans">
                  <span>⏰</span>
                  <span>{event.time || 'Daytime'}</span>
                </div>
              </div>

              {event.description && (
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                  {event.description}
                </p>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-gray-400">
                <div className="flex items-center space-x-1.5 truncate">
                  <span>📍</span>
                  <span className="truncate">{event.venue} — {event.address || ''}</span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {event.address && (
                    <button
                      onClick={() => copyAddress(event.key || String(idx), `${event.venue}, ${event.address}`)}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition flex items-center space-x-1"
                    >
                      <span>📋</span>
                      <span>{copiedKey === (event.key || String(idx)) ? 'Copied!' : 'Copy'}</span>
                    </button>
                  )}
                  {event.mapUrl && event.mapUrl !== '#' && (
                    <a
                      href={event.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-[#d97706]/20 hover:bg-[#d97706]/30 text-[#f59e0b] font-medium transition"
                    >
                      Open Maps ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto bg-[#2b170e] border border-[#d97706]/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <span className="text-3xl mb-3 block">🏡</span>
          <h2 className="text-2xl sm:text-3xl text-white font-bold mb-2">
            Will You Grace Our New Home?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mb-8 font-sans">
            Please confirm your attendance so we can warmly prepare for your welcome and feast.
          </p>

          <button
            onClick={() => alert("Thank you! Please submit your RSVP via the host's invitation link.")}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] text-[#24130d] font-bold rounded-full text-xs font-sans uppercase tracking-[0.2em] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition"
          >
            Confirm Attendance
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-amber-200/50 text-[11px] font-sans border-t border-white/5">
        <p className="tracking-widest uppercase">
          Griha Pravesh of {familyName} • InviteHub
        </p>
      </footer>
    </div>
  );
}
