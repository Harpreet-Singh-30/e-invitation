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

export default function MidnightVowsTemplate({ data }: TemplateProps) {
  const [opened, setOpened] = useState(data.previewOpened || false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

  const mainEvent = data.events.find(e => e.key === 'wedding' || e.key.includes('ceremony')) || data.events[0] || {
    key: 'wedding',
    title: 'The Wedding Ceremony & Vows',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    time: '7:00 PM',
    venue: 'The Grand Starlight Pavilion',
    address: '100 Obsidian Promenade, Skyline Bay',
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
    const playing = playerRef.current.toggle('celestial', data.music?.trackId);
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

  const groomInitial = (data.couple.groom || 'G').charAt(0).toUpperCase();
  const brideInitial = (data.couple.bride || 'B').charAt(0).toUpperCase();

  // Opening Reveal Screen
  if (!opened) {
    return (
      <div 
        className="min-h-screen bg-[#070b19] text-[#f8f9fa] flex items-center justify-center p-4 relative overflow-hidden select-none"
        style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif" }}
      >
        {/* Subtle Starlight Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e1028]/80 via-[#070b19] to-[#04060d]" />

        {/* Constellation Star dots (CSS purely static/gentle) */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-[#e6ca85] rounded-full shadow-[0_0_8px_#e6ca85]" />
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#f3e5ab] rounded-full shadow-[0_0_10px_#f3e5ab]" />
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-[#c5a059] rounded-full shadow-[0_0_6px_#c5a059]" />
          <div className="absolute bottom-1/3 right-1/5 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
        </div>

        {/* Minimal Wireframe Gold Border Frame */}
        <div className="absolute inset-4 sm:inset-8 border border-[#c5a059]/20 rounded-2xl pointer-events-none" />
        <div className="absolute inset-6 sm:inset-10 border border-[#e6ca85]/10 rounded-xl pointer-events-none" />

        {/* Central Monogram Crest */}
        <div className="max-w-md w-full text-center z-10 p-8 sm:p-12 bg-[#0b132b]/60 backdrop-blur-xl rounded-3xl border border-[#c5a059]/30 shadow-2xl shadow-black/80">
          <div className="w-20 h-20 mx-auto mb-6 text-[#e6ca85] flex items-center justify-center">
            <CelestialCrestIcon groomInitial={groomInitial} brideInitial={brideInitial} />
          </div>

          <p className="text-[11px] font-sans tracking-[0.4em] uppercase text-[#c5a059] font-medium mb-3">
            An Evening of Vows & Elegance
          </p>

          <h1 className="text-3xl sm:text-4xl font-normal tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#e6ca85] to-[#c5a059] mb-2">
            {data.couple.groom}
          </h1>

          <div className="flex items-center justify-center space-x-4 my-2 text-[#c5a059]">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c5a059]/60" />
            <span className="text-lg italic font-serif">and</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c5a059]/60" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-normal tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#e6ca85] to-[#c5a059] mb-4">
            {data.couple.bride}
          </h1>

          <p className="text-xs italic text-[#ede8df]/70 mb-8 max-w-xs mx-auto font-serif tracking-wide">
            {data.couple.tagline || 'Under the canopy of stars, we invite you to witness our eternal promises'}
          </p>

          {/* Enter Button */}
          <button
            onClick={() => setOpened(true)}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#c5a059] via-[#e6ca85] to-[#c5a059] text-[#070b19] rounded-xl text-xs font-sans font-bold tracking-[0.25em] uppercase shadow-lg shadow-[#c5a059]/20 hover:shadow-[#c5a059]/40 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300"
          >
            Enter Invitation
          </button>

          <p className="text-[10px] text-[#c5a059]/60 tracking-[0.25em] uppercase mt-6 font-sans">
            Cinematic Wedding Experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#070b19] text-[#ede8df] selection:bg-[#c5a059]/30 selection:text-[#f3e5ab] relative"
      style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif" }}
    >
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e1028]/40 via-transparent to-transparent z-0" />

      {/* Top Glass Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070b19]/85 backdrop-blur-md border-b border-[#c5a059]/20 px-4 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-full border border-[#c5a059]/60 flex items-center justify-center text-xs font-bold text-[#e6ca85]">
              {groomInitial}&{brideInitial}
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-[#e6ca85] font-medium hidden sm:inline">
              {data.couple.groom} & {data.couple.bride}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-sans">
            {/* Audio Toggle */}
            <button
              onClick={toggleMusic}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all ${
                isPlayingMusic 
                  ? 'bg-[#c5a059] text-[#070b19] border-[#c5a059] font-bold' 
                  : 'bg-white/5 text-[#e6ca85] border-[#c5a059]/40 hover:bg-white/10'
              }`}
              title={isPlayingMusic ? 'Mute ambient soundtrack' : 'Play ambient soundtrack'}
            >
              <span>{isPlayingMusic ? '✨' : '🌙'}</span>
              <span className="tracking-wider uppercase text-[11px]">
                {isPlayingMusic ? 'Soundtrack Playing' : 'Play Soundtrack'}
              </span>
            </button>

            <a
              href="#timeline"
              className="text-[#c5a059] hover:text-[#f3e5ab] tracking-widest uppercase text-[11px] hidden sm:inline"
            >
              Timeline
            </a>
            <a
              href="#venue"
              className="text-[#c5a059] hover:text-[#f3e5ab] tracking-widest uppercase text-[11px] hidden sm:inline"
            >
              Venue
            </a>
          </div>
        </div>
      </header>

      {/* Thin Gold Laser Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent relative z-10" />

      {/* DRAMATIC CINEMATIC HERO SECTION */}
      <section className="relative px-4 pt-20 pb-24 text-center overflow-hidden z-10">
        <div className="max-w-3xl mx-auto">
          {/* Subtle Crest Emblem */}
          <div className="w-16 h-16 mx-auto mb-6 text-[#c5a059]/80">
            <CelestialStarIcon />
          </div>

          <p className="text-xs sm:text-sm font-sans tracking-[0.45em] uppercase text-[#c5a059] font-medium mb-4">
            The Wedding Celebration Of
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#f3e5ab] to-[#e6ca85] leading-tight">
            {data.couple.groom}
          </h1>

          <div className="flex items-center justify-center my-4 text-[#c5a059]">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#c5a059]/60" />
            <span className="mx-4 text-2xl font-serif italic text-[#c5a059]">and</span>
            <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#c5a059]/60" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#f3e5ab] to-[#e6ca85] leading-tight mb-8">
            {data.couple.bride}
          </h1>

          {data.couple.tagline && (
            <p className="text-base sm:text-lg italic text-[#ede8df]/80 max-w-xl mx-auto mb-10 font-serif tracking-wide">
              "{data.couple.tagline}"
            </p>
          )}

          {/* Date & Vows Badge */}
          <div className="inline-block bg-white/[0.03] backdrop-blur-md border border-[#c5a059]/30 rounded-2xl px-8 py-5 shadow-2xl">
            <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-[#c5a059] font-semibold block mb-1">
              Save The Evening
            </span>
            <span className="text-2xl sm:text-3xl font-light text-[#f8f9fa] tracking-wider block">
              {format(parsedMainDate, 'MMMM d, yyyy')}
            </span>
            <span className="text-xs text-[#c5a059]/80 font-sans tracking-widest uppercase mt-1 block">
              {mainEvent.time || 'Seven O\'Clock In The Evening'}
            </span>
          </div>
        </div>
      </section>

      {/* COUNTDOWN TO ETERNITY */}
      <section className="py-12 px-4 bg-black/40 border-y border-[#c5a059]/15 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[10px] font-sans tracking-[0.35em] uppercase text-[#c5a059] font-semibold mb-6">
            Countdown To The Vows
          </p>

          <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Minutes' },
              { val: timeLeft.seconds, label: 'Seconds' },
            ].map((unit, i) => (
              <div 
                key={i} 
                className="bg-white/[0.04] backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-[#c5a059]/25 shadow-inner"
              >
                <span className="block text-2xl sm:text-3xl font-light text-[#f3e5ab] font-sans">
                  {unit.val}
                </span>
                <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#c5a059]/70 font-medium">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY / INVITATION MESSAGE */}
      {data.message && (
        <section className="py-20 px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-sans tracking-[0.4em] uppercase text-[#c5a059] block mb-3">
              The Invitation
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal text-[#f8f9fa] tracking-wide mb-6">
              Our Journey & Celebration
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto mb-8" />

            <div className="text-base sm:text-lg text-[#ede8df]/85 leading-relaxed whitespace-pre-line font-serif italic">
              {data.message}
            </div>
          </div>
        </section>
      )}

      {/* EVENT TIMELINE / SCHEDULE */}
      <section id="timeline" className="py-20 px-4 bg-[#050811] border-y border-[#c5a059]/15 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-sans tracking-[0.4em] uppercase text-[#c5a059] block mb-2">
              Order of Events
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#f8f9fa] tracking-wider">
              The Evening Itinerary
            </h2>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto mt-4" />
          </div>

          <div className="space-y-6">
            {data.events.map((event, index) => {
              let evDate = new Date();
              try {
                const parsed = new Date(event.date);
                if (!isNaN(parsed.getTime())) evDate = parsed;
              } catch {}

              const isMain = event.key === 'wedding' || index === 0;

              return (
                <div
                  key={event.key || index}
                  className={`bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 sm:p-8 border transition-all duration-300 ${
                    isMain 
                      ? 'border-[#c5a059]/60 shadow-[0_0_25px_rgba(197,160,89,0.1)]' 
                      : 'border-white/10 hover:border-[#c5a059]/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#c5a059] font-medium">
                        Chapter {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-2xl font-light text-[#f8f9fa] tracking-wide mt-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-[#e6ca85] mt-1 font-serif">
                        {format(evDate, 'EEEE, MMMM d, yyyy')}
                        {event.time && ` • ${event.time}`}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-base text-[#f8f9fa] font-medium">
                        {event.venue}
                      </p>
                      {event.address && (
                        <p className="text-xs text-[#ede8df]/60 font-sans mt-0.5 max-w-xs sm:ml-auto">
                          {event.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-3 items-center">
                    <a
                      href={event.mapUrl && event.mapUrl !== '#' ? event.mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.address || ''}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#c5a059] text-[#070b19] rounded-lg text-xs font-sans font-bold tracking-wider uppercase hover:bg-[#e6ca85] transition"
                    >
                      📍 Open Navigation
                    </a>
                    {event.address && (
                      <button
                        onClick={() => copyAddress(event.key || String(index), `${event.venue}, ${event.address}`)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#ede8df] rounded-lg text-xs font-sans tracking-wide transition border border-white/10"
                      >
                        {copiedKey === (event.key || String(index)) ? '✓ Copied!' : '📋 Copy Address'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LUXURY PHOTO GALLERY */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[11px] font-sans tracking-[0.4em] uppercase text-[#c5a059] block mb-2">
            Cinematic Portraits
          </span>
          <h2 className="text-3xl font-normal text-[#f8f9fa] tracking-wider mb-8">
            Moments In Time
          </h2>

          {data.gallery && data.gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.gallery.map((url, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-[#c5a059]/30 shadow-lg group">
                  <img src={url} alt="Wedding gallery" className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto p-10 rounded-2xl bg-white/[0.02] border border-[#c5a059]/30 backdrop-blur-sm">
              <div className="w-12 h-12 mx-auto mb-4 text-[#c5a059]/70">
                <CelestialStarIcon />
              </div>
              <p className="font-serif italic text-lg text-[#f8f9fa] mb-2">
                "Two souls with but a single thought, two hearts that beat as one."
              </p>
              <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#c5a059]">
                {data.couple.groom} & {data.couple.bride}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* VENUE & LOCATION */}
      <section id="venue" className="py-20 px-4 bg-[#050811] border-t border-[#c5a059]/15 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[11px] font-sans tracking-[0.4em] uppercase text-[#c5a059] block mb-2">
            The Destination
          </span>
          <h2 className="text-3xl font-normal text-[#f8f9fa] tracking-wider mb-6">
            The Venue & Evening Hospitality
          </h2>

          <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-[#c5a059]/30 max-w-lg mx-auto shadow-2xl">
            <h3 className="text-2xl font-light text-[#f3e5ab] mb-2">
              {mainEvent.venue}
            </h3>
            {mainEvent.address && (
              <p className="text-sm font-sans text-[#ede8df]/70 mb-6 leading-relaxed">
                {mainEvent.address}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={mainEvent.mapUrl && mainEvent.mapUrl !== '#' ? mainEvent.mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${mainEvent.venue} ${mainEvent.address || ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-gradient-to-r from-[#c5a059] to-[#e6ca85] text-[#070b19] font-sans font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition shadow-lg"
              >
                📍 Open Google Maps
              </a>
              {mainEvent.address && (
                <button
                  onClick={() => copyAddress('main-venue-nv', `${mainEvent.venue}, ${mainEvent.address}`)}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 text-[#ede8df] font-sans text-xs rounded-xl hover:bg-white/10 transition"
                >
                  {copiedKey === 'main-venue-nv' ? '✓ Copied' : 'Copy Address'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY FOOTER */}
      <footer className="py-16 px-4 bg-[#03050c] text-center border-t border-white/5 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="w-10 h-10 mx-auto mb-4 text-[#c5a059]">
            <CelestialStarIcon />
          </div>
          <h3 className="text-2xl font-light text-[#f8f9fa] tracking-wider mb-2">
            {data.couple.groom} & {data.couple.bride}
          </h3>
          <p className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#c5a059] mb-6">
            Under The Stars, Forever Begins
          </p>
          <p className="text-sm italic text-[#ede8df]/70 font-serif mb-8">
            Your presence will honor us as we exchange our vows and celebrate this new beginning.
          </p>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent mx-auto mb-6" />
          <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-white/30">
            InviteHub • Digital Wedding Experiences
          </p>
        </div>
      </footer>
    </div>
  );
}

// Icons for Celestial Luxury
function CelestialCrestIcon({ groomInitial, brideInitial }: { groomInitial: string; brideInitial: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
      <circle cx="32" cy="32" r="28" strokeDasharray="3 3" />
      <circle cx="32" cy="32" r="24" strokeWidth="1" />
      <polygon points="32,6 58,32 32,58 6,32" stroke="#c5a059" strokeWidth="1" />
      <text x="24" y="36" fill="#f3e5ab" fontSize="12" fontFamily="serif" fontWeight="bold">
        {groomInitial}
      </text>
      <text x="34" y="36" fill="#f3e5ab" fontSize="12" fontFamily="serif" fontWeight="bold">
        {brideInitial}
      </text>
    </svg>
  );
}

function CelestialStarIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M16 2L18.5 13.5L30 16L18.5 18.5L16 30L13.5 18.5L2 16L13.5 13.5L16 2Z" fill="currentColor" fillOpacity="0.2" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

