import { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { createAmbientPlayer } from '../common/audio';

interface TemplateProps {
  data: {
    title?: string;
    couple?: {
      groom?: string; // used as honoree name
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

export default function GoldenMilestoneTemplate({ data }: TemplateProps) {
  const isThumbnail = Boolean((data as any)?._isThumbnail || (data as any)?.options?.intro === false || (data as any)?.previewOpened);
  const [opened, setOpened] = useState(isThumbnail);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

  // Extract honoree name from groom or title
  const honoreeName = data.couple?.groom && data.couple.groom !== 'Groom Name'
    ? data.couple.groom
    : (data.title?.replace(/birthday|party|invitation|celebration/gi, '').trim() || 'Aryan Malhotra');

  const tagline = data.couple?.tagline || 'Celebrating 30 Years of Brilliance, Laughter & Adventure';

  const defaultEvents = [
    {
      key: 'cocktails',
      title: 'Welcome Cocktails & Canapés',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      time: '7:30 PM',
      venue: 'The Skyview Lounge & Terrace',
      address: 'Floor 42, Starlight Tower, Marine Drive',
      mapUrl: 'https://maps.google.com',
      description: 'Chilled champagne, artisanal cocktails, and live saxophone as the sunset warms the skyline.'
    },
    {
      key: 'cake-toast',
      title: 'The Birthday Toast & Cake Cutting',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      time: '9:00 PM',
      venue: 'The Gold Ballroom',
      address: 'Starlight Tower, Marine Drive',
      mapUrl: 'https://maps.google.com',
      description: 'A special toast to memories past and adventures ahead, followed by dessert and sparklers.'
    },
    {
      key: 'afterparty',
      title: 'Midnight DJ & After-Party',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      time: '10:30 PM Till Late',
      venue: 'The Underground Club',
      address: 'Starlight Tower, Marine Drive',
      mapUrl: 'https://maps.google.com',
      description: 'Dance floor opens with guest DJ playing throwback classics and club anthems.'
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
    const playing = playerRef.current.toggle('jazz', data.music?.trackId);
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

  // Countdown timer
  const targetDate = useMemo(() => {
    try {
      const d = new Date(mainEvent.date);
      return isNaN(d.getTime()) ? new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) : d;
    } catch {
      return new Date(Date.now() + 25 * 24 * 60 * 60 * 1000);
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

  // CLOSED STATE: Luxury VIP Invitation Envelope & Wax Seal
  if (!opened) {
    return (
      <div
        className="min-h-screen bg-[#0d0d11] text-[#f4efe6] flex items-center justify-center p-4 relative overflow-hidden select-none"
        style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
      >
        {/* Subtle Radial Glow & Star Dust */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a2215] via-[#0d0d11] to-[#08080a] opacity-80" />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#f3e5ab]/10 blur-3xl pointer-events-none" />

        {/* Outer Gold Border Frame */}
        <div className="absolute inset-3 sm:inset-6 border border-[#d4af37]/30 rounded-2xl pointer-events-none" />
        <div className="absolute inset-5 sm:inset-8 border border-[#d4af37]/15 rounded-xl pointer-events-none" />

        {/* Central Card */}
        <div className="relative max-w-md w-full bg-[#14141b]/90 border border-[#d4af37]/40 rounded-2xl p-6 sm:p-10 text-center shadow-2xl backdrop-blur-md">
          {/* Milestone Crown / Spark Icon */}
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 mb-4 flex items-center justify-center rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37]">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          <p className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#d4af37] font-medium mb-3">
            A Milestone Celebration
          </p>

          <h1 className="text-2xl sm:text-4xl text-[#fff] font-bold tracking-wide mb-2">
            {honoreeName}
          </h1>

          <div className="flex items-center justify-center space-x-3 my-3">
            <span className="h-px w-8 bg-[#d4af37]/40" />
            <span className="text-xs uppercase tracking-widest text-[#d4af37]/80">Birthday Gala</span>
            <span className="h-px w-8 bg-[#d4af37]/40" />
          </div>

          <p className="text-xs sm:text-sm text-[#b8b3a8] italic mb-8 max-w-xs mx-auto leading-relaxed">
            {tagline}
          </p>

          {/* Unfold Button */}
          <button
            onClick={() => setOpened(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-[#0d0d11] font-bold rounded-full text-xs uppercase tracking-[0.25em] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-[1.03] active:scale-95"
          >
            <span>Open VIP Invitation ✨</span>
          </button>

          <p className="text-[10px] text-[#8c867a] tracking-widest uppercase mt-6">
            Tap to reveal the birthday soirée
          </p>
        </div>
      </div>
    );
  }

  // OPENED STATE: Full Multi-Section Birthday Soirée Experience
  return (
    <div
      className="min-h-screen bg-[#0a0a0e] text-[#f4efe6] relative overflow-x-hidden selection:bg-[#d4af37]/20 selection:text-[#d4af37]"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* Top Floating Sticky Header */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0e]/90 backdrop-blur-md border-b border-[#d4af37]/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#0a0a0e] flex items-center justify-center text-xs font-bold font-serif">
              🎂
            </span>
            <span className="text-xs font-bold tracking-widest text-[#f4efe6] uppercase truncate max-w-[150px] sm:max-w-none">
              {honoreeName}'s Birthday
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-full border text-xs transition flex items-center space-x-1.5 ${
                isPlayingMusic
                  ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37]'
                  : 'border-white/10 hover:border-[#d4af37]/40 text-gray-400'
              }`}
              title={isPlayingMusic ? 'Mute Music' : 'Play Festive Lounge Music'}
            >
              <span>{isPlayingMusic ? '🎵' : '🔇'}</span>
              <span className="hidden sm:inline text-[11px] font-sans tracking-wide">
                {isPlayingMusic ? 'Music On' : 'Music Off'}
              </span>
            </button>

            <a
              href="#rsvp"
              className="px-3 sm:px-4 py-1.5 bg-[#d4af37] text-[#0a0a0e] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#f3e5ab] transition"
            >
              RSVP
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
        {/* Ambient Shimmer Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#2d2212]/70 via-[#0a0a0e] to-[#0a0a0e] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs font-sans tracking-[0.3em] uppercase">
            <span>✨ VIP Birthday Soirée ✨</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            {honoreeName}
          </h1>

          <p className="text-base sm:text-xl text-[#d4af37] italic font-serif max-w-xl mx-auto leading-relaxed">
            "{tagline}"
          </p>

          {/* Date & Location Pill */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-sans tracking-wider uppercase text-[#c7c2b6]">
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              📅 {format(targetDate, 'EEEE, MMMM d, yyyy')}
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              📍 {mainEvent.venue}
            </span>
          </div>

          {/* Live Countdown Grid */}
          <div className="pt-8">
            <p className="text-xs tracking-[0.25em] uppercase text-[#d4af37]/80 font-sans mb-3">
              Countdown to Celebration
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
                  className="bg-[#14141d]/80 border border-[#d4af37]/30 rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm shadow-md"
                >
                  <span className="block text-xl sm:text-3xl font-bold text-[#d4af37] font-mono">
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

      {/* Host Welcome Message */}
      <section className="py-16 px-4 bg-[#101017]/60 border-y border-white/5">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-3xl">🥂</span>
          <h2 className="text-2xl sm:text-3xl text-[#d4af37] font-semibold tracking-wide">
            Raise a Glass With Us
          </h2>
          <p className="text-sm sm:text-base text-[#cfcac0] leading-relaxed italic font-serif">
            {data.message ||
              "Another year of adventures, cherished friendships, and unforgettable memories! You have been an essential part of this wonderful journey, and having you celebrate this milestone evening would mean the world to us."}
          </p>
        </div>
      </section>

      {/* Event Itinerary Timeline */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium mb-2">
            The Evening Schedule
          </p>
          <h2 className="text-3xl sm:text-4xl text-white font-bold tracking-tight">
            Order of Celebration
          </h2>
        </div>

        <div className="space-y-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-[#14141d]/80 border border-[#d4af37]/25 hover:border-[#d4af37]/60 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-lg relative group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-sans uppercase font-bold text-[#d4af37] tracking-widest">
                    Part {idx + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl text-white font-semibold mt-0.5">
                    {event.title}
                  </h3>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-mono font-medium self-start sm:self-auto">
                  <span>⏰</span>
                  <span>{event.time || 'Evening'}</span>
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
                      className="px-2.5 py-1 rounded bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] font-medium transition"
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

      {/* Dress Code & Information Section */}
      <section className="py-16 px-4 bg-[#101017]/80 border-t border-white/5">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-2xl mb-2 block">👗</span>
            <h4 className="text-base font-bold text-[#d4af37] uppercase tracking-wider mb-1 font-sans">
              Dress Code
            </h4>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Black Tie & A Touch of Gold. Dress to celebrate and dance!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-2xl mb-2 block">🎁</span>
            <h4 className="text-base font-bold text-[#d4af37] uppercase tracking-wider mb-1 font-sans">
              Warm Wishes
            </h4>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Your presence and great energy are the only gifts requested.
            </p>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto bg-[#14141d] border border-[#d4af37]/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <span className="text-3xl mb-3 block">💌</span>
          <h2 className="text-2xl sm:text-3xl text-white font-bold mb-2">
            Will You Join the Toast?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mb-8 font-sans">
            Please let us know if you can make it by confirmation date so we can reserve your table and signature cocktails.
          </p>

          <button
            onClick={() => alert("Thank you! Please submit your RSVP via the host's invitation link.")}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-[#0a0a0e] font-bold rounded-full text-xs uppercase tracking-[0.25em] shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.7)] hover:scale-[1.02] active:scale-95 transition"
          >
            Confirm Attendance
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-[11px] font-sans border-t border-white/5">
        <p className="tracking-widest uppercase">
          Crafted with love for {honoreeName}'s Birthday • InviteHub
        </p>
      </footer>
    </div>
  );
}
