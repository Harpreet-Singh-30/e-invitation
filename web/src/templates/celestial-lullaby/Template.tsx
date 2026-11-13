import { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { createAmbientPlayer } from '../common/audio';

interface TemplateProps {
  data: {
    title?: string;
    couple?: {
      groom?: string; // Parent 1
      bride?: string; // Parent 2
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

export default function CelestialLullabyTemplate({ data }: TemplateProps) {
  const isThumbnail = Boolean((data as any)?._isThumbnail || (data as any)?.options?.intro === false || (data as any)?.previewOpened);
  const [opened, setOpened] = useState(isThumbnail);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

  const parent1 = data.couple?.groom || 'Aarav';
  const parent2 = data.couple?.bride || 'Priya';
  const tagline = data.couple?.tagline || 'A Little Star is on the Way to Brighten Our World';

  const defaultEvents = [
    {
      key: 'blessings',
      title: 'Baby Shower & Traditional Blessings',
      date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      time: '3:30 PM',
      venue: 'The Garden Conservatory',
      address: 'Rosewood Estate, Whitefield, Bangalore',
      mapUrl: 'https://maps.google.com',
      description: 'Blessing ceremony with fragrant flowers, traditional sweets, and warm wishes for mom and baby.'
    },
    {
      key: 'games-hightea',
      title: 'Playful Shower Games & High Tea',
      date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      time: '5:00 PM',
      venue: 'The Glass Pavilion Terrace',
      address: 'Rosewood Estate, Whitefield, Bangalore',
      mapUrl: 'https://maps.google.com',
      description: 'Guess the arrival date, baby trivia games, artisanal pastries, mocktails, and cake cutting.'
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
    const playing = playerRef.current.toggle('lullaby', data.music?.trackId);
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
      return isNaN(d.getTime()) ? new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) : d;
    } catch {
      return new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
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

  // CLOSED STATE: Pastel Cloud & Moon Lullaby Envelope
  if (!opened) {
    return (
      <div
        className="min-h-screen bg-[#fcf9f5] text-[#334155] flex items-center justify-center p-4 relative overflow-hidden select-none"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {/* Soft pastel celestial background glow */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#fce7f3]/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#e0f2fe]/60 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#fef3c7]/40 blur-2xl pointer-events-none" />

        {/* Delicate Golden Starlight Border */}
        <div className="absolute inset-3 sm:inset-6 border border-[#e2d5c3] rounded-3xl pointer-events-none" />

        {/* Central Cloud Invitation Card */}
        <div className="relative max-w-md w-full bg-white/90 border border-[#e2d5c3] rounded-3xl p-6 sm:p-10 text-center shadow-xl backdrop-blur-md">
          {/* Crescent Moon & Floating Star Icon */}
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 mb-4 flex items-center justify-center rounded-full bg-[#fef9c3] border border-[#fde047]/60 text-[#ca8a04]">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-5.4-5.4c0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
            </svg>
          </div>

          <p className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#ca8a04] font-medium font-sans mb-2">
            A Little Star is on the Way
          </p>

          <h2 className="text-xl sm:text-2xl text-slate-500 font-normal italic mb-1">
            Celebrating with
          </h2>
          <h1 className="text-2xl sm:text-4xl text-[#1e293b] font-bold tracking-wide mb-3">
            {parent2} & {parent1}
          </h1>

          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#ca8a04] to-transparent mx-auto my-3" />

          <p className="text-xs sm:text-sm text-slate-600 italic mb-8 max-w-xs mx-auto leading-relaxed">
            {tagline}
          </p>

          {/* Reveal Button */}
          <button
            onClick={() => setOpened(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#fef08a] via-[#fef9c3] to-[#fed7aa] text-[#451a03] font-bold rounded-full text-xs font-sans uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_20px_rgba(254,240,138,0.6)] hover:shadow-[0_0_30px_rgba(254,240,138,0.9)] hover:scale-[1.03] active:scale-95"
          >
            <span>Open Baby Shower Card 🌙</span>
          </button>

          <p className="text-[10px] text-slate-400 font-sans tracking-widest uppercase mt-6">
            Tap to unfold the baby shower celebration
          </p>
        </div>
      </div>
    );
  }

  // OPENED STATE: Full Multi-Section Baby Shower
  return (
    <div
      className="min-h-screen bg-[#fcf9f5] text-[#334155] relative overflow-x-hidden selection:bg-[#fef08a] selection:text-[#713f12]"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2d5c3] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-[#fef9c3] text-[#ca8a04] flex items-center justify-center text-xs font-bold">
              ⭐
            </span>
            <span className="text-xs font-bold tracking-widest text-[#1e293b] uppercase truncate max-w-[150px] sm:max-w-none font-sans">
              Baby Shower • {parent2} & {parent1}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-full border text-xs transition flex items-center space-x-1.5 ${
                isPlayingMusic
                  ? 'border-[#ca8a04] bg-[#fef9c3] text-[#854d0e]'
                  : 'border-slate-200 hover:border-slate-300 text-slate-500'
              }`}
              title={isPlayingMusic ? 'Mute Music' : 'Play Gentle Music'}
            >
              <span>{isPlayingMusic ? '🎵' : '🔇'}</span>
              <span className="hidden sm:inline text-[11px] font-sans tracking-wide">
                {isPlayingMusic ? 'Music On' : 'Music Off'}
              </span>
            </button>

            <a
              href="#rsvp"
              className="px-4 py-1.5 bg-[#ca8a04] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#a16207] transition font-sans"
            >
              RSVP
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-[#fce7f3]/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-[#e0f2fe]/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#ca8a04]/30 bg-[#fef9c3]/70 text-[#854d0e] text-xs font-sans tracking-[0.25em] uppercase">
            <span>✨ Welcoming Little One ✨</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1e293b] leading-tight">
            Baby Shower Celebration
          </h1>

          <p className="text-xl sm:text-2xl text-[#854d0e] italic font-serif">
            Honoring parents-to-be {parent2} & {parent1}
          </p>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            "{tagline}"
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-sans tracking-wider uppercase text-slate-600">
            <span className="px-4 py-2 rounded-xl bg-white border border-[#e2d5c3] shadow-sm">
              📅 {format(targetDate, 'EEEE, MMMM d, yyyy')}
            </span>
            <span className="px-4 py-2 rounded-xl bg-white border border-[#e2d5c3] shadow-sm">
              📍 {mainEvent.venue}
            </span>
          </div>

          {/* Countdown Clock */}
          <div className="pt-8">
            <p className="text-xs tracking-[0.25em] uppercase text-[#854d0e] font-sans font-medium mb-3">
              Counting Down to the Special Day
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
                  className="bg-white border border-[#e2d5c3] rounded-2xl p-3 sm:p-4 text-center shadow-sm"
                >
                  <span className="block text-xl sm:text-3xl font-bold text-[#ca8a04] font-mono">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] sm:text-xs font-sans uppercase text-slate-400 tracking-wider mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parents Message */}
      <section className="py-16 px-4 bg-white/70 border-y border-[#e2d5c3]">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-3xl">🧸</span>
          <h2 className="text-2xl sm:text-3xl text-[#1e293b] font-bold tracking-wide">
            A Note from the Expectant Parents
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed italic font-serif">
            {data.message ||
              "Ten little fingers, ten little toes, our hearts are overflowing as our family grows! We cannot wait to introduce our bundle of joy to the people who mean everything to us. Please join us for an afternoon of games, sweets, laughter, and blessings."}
          </p>
        </div>
      </section>

      {/* Shower Schedule */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#ca8a04] font-sans font-medium mb-2">
            The Afternoon Program
          </p>
          <h2 className="text-3xl sm:text-4xl text-[#1e293b] font-bold tracking-tight">
            Order of Festivities
          </h2>
        </div>

        <div className="space-y-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#e2d5c3] hover:border-[#ca8a04] rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-sans uppercase font-bold text-[#ca8a04] tracking-widest">
                    Part {idx + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl text-[#1e293b] font-semibold mt-0.5">
                    {event.title}
                  </h3>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#fef9c3] text-[#854d0e] text-xs font-mono font-medium self-start sm:self-auto font-sans">
                  <span>⏰</span>
                  <span>{event.time || 'Afternoon'}</span>
                </div>
              </div>

              {event.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {event.description}
                </p>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-slate-500">
                <div className="flex items-center space-x-1.5 truncate">
                  <span>📍</span>
                  <span className="truncate">{event.venue} — {event.address || ''}</span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {event.address && (
                    <button
                      onClick={() => copyAddress(event.key || String(idx), `${event.venue}, ${event.address}`)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center space-x-1"
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
                      className="px-2.5 py-1 rounded bg-[#fef9c3] hover:bg-[#fef08a] text-[#854d0e] font-medium transition"
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
        <div className="max-w-xl mx-auto bg-white border border-[#e2d5c3] rounded-3xl p-8 sm:p-12 shadow-xl">
          <span className="text-3xl mb-3 block">🎀</span>
          <h2 className="text-2xl sm:text-3xl text-[#1e293b] font-bold mb-2">
            Will You Join Our Baby Shower?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-8 font-sans">
            Please let us know if you will be celebrating with us so we can prepare delicious treats and games for everyone.
          </p>

          <button
            onClick={() => alert("Thank you! Please submit your RSVP via the host's invitation link.")}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#ca8a04] via-[#eab308] to-[#ca8a04] text-white font-bold rounded-full text-xs font-sans uppercase tracking-[0.2em] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition"
          >
            Confirm Attendance
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-[11px] font-sans border-t border-[#e2d5c3]">
        <p className="tracking-widest uppercase">
          Welcoming Baby with {parent2} & {parent1} • InviteHub
        </p>
      </footer>
    </div>
  );
}
