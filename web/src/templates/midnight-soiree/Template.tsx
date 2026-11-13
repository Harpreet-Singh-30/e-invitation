import { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { createAmbientPlayer } from '../common/audio';

interface TemplateProps {
  data: {
    title?: string;
    couple?: {
      groom?: string; // Host Name
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

export default function MidnightSoireeTemplate({ data }: TemplateProps) {
  const isThumbnail = Boolean((data as any)?._isThumbnail || (data as any)?.options?.intro === false || (data as any)?.previewOpened);
  const [opened, setOpened] = useState(isThumbnail);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

  const hostName = data.couple?.groom && data.couple.groom !== 'Groom Name'
    ? data.couple.groom
    : (data.title?.replace(/party|invitation|soiree|cocktail/gi, '').trim() || 'Karan Singhania');

  const tagline = data.couple?.tagline || 'An Exclusive Rooftop Evening of Artisanal Cocktails, Vinyl Beats & Starry Nights';

  const defaultEvents = [
    {
      key: 'sundowner',
      title: 'Sundowner Cocktails & Tapas',
      date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      time: '6:30 PM',
      venue: 'The Amber Sky Lounge',
      address: 'Level 28, Zenith Tower, Worli, Mumbai',
      mapUrl: 'https://maps.google.com',
      description: 'Signature mixology drinks, wood-fired bites, and deep house music against the panoramic skyline sunset.'
    },
    {
      key: 'night-bash',
      title: 'Midnight DJ Set & Dance Floor',
      date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      time: '9:30 PM Till 2:00 AM',
      venue: 'The Obsidian Room',
      address: 'Level 28, Zenith Tower, Worli, Mumbai',
      mapUrl: 'https://maps.google.com',
      description: 'Live percussionist, guest DJ, craft cocktail station, and non-stop celebration until late.'
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
    const playing = playerRef.current.toggle('lounge', data.music?.trackId);
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
      return isNaN(d.getTime()) ? new Date(Date.now() + 18 * 24 * 60 * 60 * 1000) : d;
    } catch {
      return new Date(Date.now() + 18 * 24 * 60 * 60 * 1000);
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

  // CLOSED STATE: Holographic VIP Pass Ticket
  if (!opened) {
    return (
      <div
        className="min-h-screen bg-[#07070b] text-white flex items-center justify-center p-4 relative overflow-hidden select-none"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Ultraviolet & Amber Neon Glow */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#8b5cf6]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#f59e0b]/20 blur-3xl pointer-events-none" />

        {/* Central VIP Ticket Pass */}
        <div className="relative max-w-sm sm:max-w-md w-full bg-[#12121a]/95 border border-[#8b5cf6]/40 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(139,92,246,0.25)] backdrop-blur-xl">
          {/* Top VIP Barcode Strip */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-[#a78bfa]">
              VIP ACCESS PASS • ADMIT ONE
            </span>
            <span className="px-2 py-0.5 rounded bg-[#8b5cf6]/20 text-[#c4b5fd] text-[9px] font-mono">
              #SOIRÉE-2027
            </span>
          </div>

          {/* Holographic Glowing Neon Disk */}
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8b5cf6] to-[#f59e0b] text-white shadow-lg shadow-purple-500/30">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>

          <p className="text-xs uppercase tracking-[0.25em] text-[#f59e0b] font-semibold mb-2">
            The Midnight Soirée
          </p>

          <h1 className="text-2xl sm:text-4xl text-white font-extrabold tracking-tight mb-2">
            {hostName}
          </h1>

          <p className="text-xs text-gray-400 italic mb-8 max-w-xs mx-auto leading-relaxed">
            {tagline}
          </p>

          {/* Reveal Button */}
          <button
            onClick={() => setOpened(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f59e0b] text-white font-bold rounded-2xl text-xs uppercase tracking-[0.25em] transition-all duration-300 shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_35px_rgba(236,72,153,0.8)] hover:scale-[1.03] active:scale-95"
          >
            <span>Scan VIP Pass 🍸</span>
          </button>

          <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-6 font-mono">
            Tap to unlock guest itinerary & cocktails
          </p>
        </div>
      </div>
    );
  }

  // OPENED STATE: Full Night Party Experience
  return (
    <div
      className="min-h-screen bg-[#07070b] text-white relative overflow-x-hidden selection:bg-[#ec4899]/30 selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-[#07070b]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#ec4899] text-white flex items-center justify-center text-xs font-bold font-mono">
              🍸
            </span>
            <span className="text-xs font-bold tracking-widest text-white uppercase truncate max-w-[150px] sm:max-w-none">
              {hostName}'s Soirée
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-full border text-xs transition flex items-center space-x-1.5 ${
                isPlayingMusic
                  ? 'border-[#a78bfa] bg-[#8b5cf6]/20 text-[#c4b5fd]'
                  : 'border-white/10 hover:border-white/30 text-gray-400'
              }`}
              title={isPlayingMusic ? 'Mute Music' : 'Play Lounge House'}
            >
              <span>{isPlayingMusic ? '🎵' : '🔇'}</span>
              <span className="hidden sm:inline text-[11px] tracking-wide">
                {isPlayingMusic ? 'Music On' : 'Music Off'}
              </span>
            </button>

            <a
              href="#rsvp"
              className="px-4 py-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition"
            >
              RSVP
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#8b5cf6]/20 via-[#07070b] to-[#07070b] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#c4b5fd] text-xs font-mono tracking-[0.25em] uppercase">
            <span>✨ Rooftop Night Soirée ✨</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            {hostName}
          </h1>

          <p className="text-base sm:text-xl text-[#f59e0b] font-medium max-w-xl mx-auto leading-relaxed">
            "{tagline}"
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-mono tracking-wider uppercase text-gray-300">
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              📅 {format(targetDate, 'EEEE, MMMM d, yyyy')}
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              📍 {mainEvent.venue}
            </span>
          </div>

          {/* Countdown Clock */}
          <div className="pt-8">
            <p className="text-xs tracking-[0.25em] uppercase text-[#a78bfa] font-mono mb-3">
              Counting Down to Doors Opening
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
                  className="bg-[#12121a]/90 border border-[#8b5cf6]/30 rounded-2xl p-3 sm:p-4 text-center backdrop-blur-sm shadow-md"
                >
                  <span className="block text-xl sm:text-3xl font-extrabold text-white font-mono">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] sm:text-xs font-mono uppercase text-gray-400 tracking-wider mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Host Note */}
      <section className="py-16 px-4 bg-[#101018]/80 border-y border-white/5">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-3xl">🪩</span>
          <h2 className="text-2xl sm:text-3xl text-[#a78bfa] font-bold tracking-tight">
            An Unforgettable Night Awaits
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed italic">
            {data.message ||
              "Leave the routine behind and step into the high-altitude skyline. We have prepared an electric night of signature cocktails, handpicked vinyl beats, gourmet tapas, and great conversations."}
          </p>
        </div>
      </section>

      {/* Timeline Schedule */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#a78bfa] font-mono font-medium mb-2">
            The Night's Flow
          </p>
          <h2 className="text-3xl sm:text-4xl text-white font-extrabold tracking-tight">
            Party Line-up
          </h2>
        </div>

        <div className="space-y-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-[#12121a]/80 border border-[#8b5cf6]/25 hover:border-[#8b5cf6]/60 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-[#f59e0b] tracking-widest">
                    Set {idx + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl text-white font-bold mt-0.5">
                    {event.title}
                  </h3>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#8b5cf6]/20 text-[#c4b5fd] text-xs font-mono font-medium self-start sm:self-auto">
                  <span>⏰</span>
                  <span>{event.time || 'Night'}</span>
                </div>
              </div>

              {event.description && (
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                  {event.description}
                </p>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
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
                      className="px-2.5 py-1 rounded bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 text-[#c4b5fd] font-medium transition"
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
        <div className="max-w-xl mx-auto bg-[#12121a] border border-[#8b5cf6]/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <span className="text-3xl mb-3 block">🍸</span>
          <h2 className="text-2xl sm:text-3xl text-white font-extrabold mb-2">
            Confirm Your VIP Access
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mb-8">
            Please RSVP to be placed on the guest list for rooftop elevator entry and cocktail bar reservations.
          </p>

          <button
            onClick={() => alert("Thank you! Please submit your RSVP via the host's invitation link.")}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f59e0b] text-white font-bold rounded-2xl text-xs uppercase tracking-[0.2em] shadow-lg hover:opacity-95 hover:scale-[1.02] active:scale-95 transition font-mono"
          >
            Confirm VIP Access
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-[11px] font-mono border-t border-white/5">
        <p className="tracking-widest uppercase">
          {hostName}'s Midnight Soirée • InviteHub
        </p>
      </footer>
    </div>
  );
}
