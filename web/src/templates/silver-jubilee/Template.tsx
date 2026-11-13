import { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { createAmbientPlayer } from '../common/audio';

interface TemplateProps {
  data: {
    title?: string;
    couple?: {
      groom?: string;
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

export default function SilverJubileeTemplate({ data }: TemplateProps) {
  const isThumbnail = Boolean((data as any)?._isThumbnail || (data as any)?.options?.intro === false || (data as any)?.previewOpened);
  const [opened, setOpened] = useState(isThumbnail);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

  const groomName = data.couple?.groom || 'Rajesh Sharma';
  const brideName = data.couple?.bride || 'Sunita Sharma';
  const tagline = data.couple?.tagline || 'Celebrating 25 Years of Everlasting Love, Laughter & Devotion';

  const defaultEvents = [
    {
      key: 'vow-renewal',
      title: 'Auspicious Vow Renewal & Blessings',
      date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      time: '5:30 PM',
      venue: 'The Silver Pavilion',
      address: 'The Grand Regency, MG Road, Bangalore',
      mapUrl: 'https://maps.google.com',
      description: 'Exchange of silver garlands and renewal of sacred vows in the warm presence of family and lifelong friends.'
    },
    {
      key: 'gala-dinner',
      title: 'Silver Jubilee Banquet & Toasts',
      date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      time: '7:30 PM',
      venue: 'The Crystal Ballroom',
      address: 'The Grand Regency, MG Road, Bangalore',
      mapUrl: 'https://maps.google.com',
      description: 'An evening of nostalgic family stories, celebratory toasts, live acoustic melodies, and a gourmet banquet.'
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
    const playing = playerRef.current.toggle('orchestral', data.music?.trackId);
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
      return isNaN(d.getTime()) ? new Date(Date.now() + 35 * 24 * 60 * 60 * 1000) : d;
    } catch {
      return new Date(Date.now() + 35 * 24 * 60 * 60 * 1000);
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

  // CLOSED STATE: Sterling Silver Embossed Envelope
  if (!opened) {
    return (
      <div
        className="min-h-screen bg-[#0f1722] text-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden select-none"
        style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif" }}
      >
        {/* Platinum / Silver radial ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0f1722] to-[#080d14] opacity-90" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#94a3b8]/10 blur-3xl pointer-events-none" />

        {/* Silver Filigree Frame */}
        <div className="absolute inset-3 sm:inset-6 border border-[#cbd5e1]/30 rounded-2xl pointer-events-none" />
        <div className="absolute inset-5 sm:inset-8 border border-[#cbd5e1]/15 rounded-xl pointer-events-none" />

        {/* Invitation Card */}
        <div className="relative max-w-md w-full bg-[#182232]/95 border border-[#cbd5e1]/40 rounded-2xl p-6 sm:p-10 text-center shadow-2xl backdrop-blur-md">
          {/* Dual Rings / Infinity Emblem */}
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 mb-4 flex items-center justify-center rounded-full bg-[#cbd5e1]/10 border border-[#cbd5e1]/40 text-[#cbd5e1]">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="12" r="5" strokeWidth="1.5" />
              <circle cx="15" cy="12" r="5" strokeWidth="1.5" />
            </svg>
          </div>

          <p className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#cbd5e1] font-medium mb-3">
            25 Years • Silver Jubilee
          </p>

          <h1 className="text-2xl sm:text-4xl text-white font-bold tracking-wide mb-1">
            {groomName}
          </h1>
          <p className="text-lg text-[#94a3b8] italic my-1 font-serif">&</p>
          <h1 className="text-2xl sm:text-4xl text-white font-bold tracking-wide mb-3">
            {brideName}
          </h1>

          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#cbd5e1] to-transparent mx-auto my-4" />

          <p className="text-xs sm:text-sm text-[#cbd5e1]/80 italic mb-8 max-w-xs mx-auto leading-relaxed font-serif">
            {tagline}
          </p>

          {/* Reveal Button */}
          <button
            onClick={() => setOpened(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#e2e8f0] via-[#ffffff] to-[#cbd5e1] text-[#0f1722] font-bold rounded-full text-xs uppercase tracking-[0.25em] transition-all duration-300 shadow-[0_0_20px_rgba(226,232,240,0.4)] hover:shadow-[0_0_30px_rgba(226,232,240,0.7)] hover:scale-[1.03] active:scale-95"
          >
            <span>Unfold Anniversary Invitation 💍</span>
          </button>

          <p className="text-[10px] text-[#94a3b8] tracking-widest uppercase mt-6">
            Tap to open the jubilee celebration
          </p>
        </div>
      </div>
    );
  }

  // OPENED STATE: Full Anniversary Celebration Experience
  return (
    <div
      className="min-h-screen bg-[#0a0f16] text-[#f8fafc] relative overflow-x-hidden selection:bg-[#94a3b8]/20 selection:text-[#e2e8f0]"
      style={{ fontFamily: "'Cormorant Garamond', 'Cinzel', serif" }}
    >
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-[#0a0f16]/90 backdrop-blur-md border-b border-[#cbd5e1]/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#cbd5e1] to-white text-[#0a0f16] flex items-center justify-center text-xs font-bold font-serif">
              💍
            </span>
            <span className="text-xs font-bold tracking-widest text-white uppercase truncate max-w-[150px] sm:max-w-none">
              {groomName} & {brideName}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-full border text-xs transition flex items-center space-x-1.5 ${
                isPlayingMusic
                  ? 'border-[#cbd5e1] bg-[#cbd5e1]/20 text-white'
                  : 'border-white/10 hover:border-white/30 text-gray-400'
              }`}
              title={isPlayingMusic ? 'Mute Music' : 'Play Classical Anniversary Waltz'}
            >
              <span>{isPlayingMusic ? '🎵' : '🔇'}</span>
              <span className="hidden sm:inline text-[11px] font-sans tracking-wide">
                {isPlayingMusic ? 'Music On' : 'Music Off'}
              </span>
            </button>

            <a
              href="#rsvp"
              className="px-4 py-1.5 bg-[#e2e8f0] text-[#0a0f16] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white transition"
            >
              RSVP
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1e293b]/70 via-[#0a0f16] to-[#0a0f16] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#cbd5e1]/40 bg-[#cbd5e1]/10 text-[#cbd5e1] text-xs font-sans tracking-[0.3em] uppercase">
            <span>Silver Jubilee • 25 Glorious Years</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            {groomName} & {brideName}
          </h1>

          <p className="text-base sm:text-xl text-[#cbd5e1] italic font-serif max-w-xl mx-auto leading-relaxed">
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
            <p className="text-xs tracking-[0.25em] uppercase text-[#cbd5e1]/80 font-sans mb-3">
              Counting Down to the Milestone Vows
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
                  className="bg-[#182232]/80 border border-[#cbd5e1]/30 rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm shadow-md"
                >
                  <span className="block text-xl sm:text-3xl font-bold text-white font-mono">
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

      {/* Love Journey Milestone Cards */}
      <section className="py-16 px-4 bg-[#111926]/70 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-2xl mb-1 block">🕊️</span>
            <h2 className="text-2xl sm:text-3xl text-white font-bold tracking-wide">
              The Journey of Twenty-Five Years
            </h2>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-sans mt-1">
              From our first vows to silver memories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-sm font-bold text-[#cbd5e1] font-mono tracking-widest block mb-1">1999</span>
              <h3 className="text-lg font-bold text-white mb-2">Sacred Vows</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Where two souls embarked on a lifelong journey with sacred blessings and promise of forever.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-sm font-bold text-[#cbd5e1] font-mono tracking-widest block mb-1">2004 - 2018</span>
              <h3 className="text-lg font-bold text-white mb-2">Home & Heritage</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Building our loving home, raising our children, and weathering every storm hand-in-hand.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-sm font-bold text-[#cbd5e1] font-mono tracking-widest block mb-1">Today</span>
              <h3 className="text-lg font-bold text-white mb-2">Silver Jubilee</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Standing stronger and closer than ever, renewed in love with our dearest family and friends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Schedule */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1] font-sans font-medium mb-2">
            Order of the Evening
          </p>
          <h2 className="text-3xl sm:text-4xl text-white font-bold tracking-tight">
            Celebration Itinerary
          </h2>
        </div>

        <div className="space-y-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-[#141d2b]/80 border border-[#cbd5e1]/25 hover:border-[#cbd5e1]/60 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-sans uppercase font-bold text-[#cbd5e1] tracking-widest">
                    Part {idx + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl text-white font-semibold mt-0.5">
                    {event.title}
                  </h3>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-medium self-start sm:self-auto">
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
                      className="px-2.5 py-1 rounded bg-[#cbd5e1]/20 hover:bg-[#cbd5e1]/30 text-white font-medium transition"
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
        <div className="max-w-xl mx-auto bg-[#182232] border border-[#cbd5e1]/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <span className="text-3xl mb-3 block">💐</span>
          <h2 className="text-2xl sm:text-3xl text-white font-bold mb-2">
            Will You Join Our Silver Jubilee?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mb-8 font-sans">
            Your heartfelt blessings and presence will make our 25-year celebration truly unforgettable.
          </p>

          <button
            onClick={() => alert("Thank you! Please submit your RSVP via the host's invitation link.")}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#e2e8f0] via-white to-[#cbd5e1] text-[#0f1722] font-bold rounded-full text-xs uppercase tracking-[0.25em] shadow-[0_0_25px_rgba(226,232,240,0.4)] hover:shadow-[0_0_35px_rgba(226,232,240,0.7)] hover:scale-[1.02] active:scale-95 transition"
          >
            Confirm Attendance
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-[11px] font-sans border-t border-white/5">
        <p className="tracking-widest uppercase">
          Celebrating 25 Years of {groomName} & {brideName} • InviteHub
        </p>
      </footer>
    </div>
  );
}
