import { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { createAmbientPlayer } from '../common/audio';

interface TemplateProps {
  data: {
    title?: string;
    couple?: {
      groom?: string; // Host / Gala Title
      bride?: string; // Organization / Co-Host
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
    message?: string;
    music?: {
      enabled?: boolean;
      trackId?: string;
    };
    gallery?: Array<{
      url: string;
      caption?: string;
    }>;
  };
}

export default function AuraGrandGalaTemplate({ data }: TemplateProps) {
  const isThumbnail = Boolean((data as any)?._isThumbnail || (data as any)?.options?.intro === false || (data as any)?.previewOpened);
  const [opened, setOpened] = useState(isThumbnail);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [dietary, setDietary] = useState('Standard');
  const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

  const galaTitle = data.couple?.groom || 'The Grand Aura Gala & Honors';
  const orgName = data.couple?.bride || 'Horizon Foundation & Global Guild';
  const tagline = data.couple?.tagline || 'An Evening of Distinction, Global Leadership & Vision';

  const defaultEvents = [
    {
      key: 'red-carpet',
      title: 'Red Carpet Arrivals & Champagne Reception',
      date: '2027-12-12',
      time: '6:30 PM',
      venue: 'The Grand Rotunda & Foyer',
      address: 'The St. Regis Hotel, Lower Parel, Mumbai',
      mapUrl: 'https://maps.google.com',
      description: 'Step into the spotlight with media photo-calls, craft cocktail aperitifs, and live string quartet.'
    },
    {
      key: 'keynote-awards',
      title: 'Keynote Address & Annual Honors Ceremony',
      date: '2027-12-12',
      time: '7:45 PM',
      venue: 'The Imperial Ballroom',
      address: 'The St. Regis Hotel, Lower Parel, Mumbai',
      mapUrl: 'https://maps.google.com',
      description: 'Inspiring keynote address followed by the presentation of the Global Visionary & Lifetime Excellence Awards.'
    },
    {
      key: 'gala-banquet',
      title: '5-Course Chef Tasting Dinner & Soirée',
      date: '2027-12-12',
      time: '9:15 PM',
      venue: 'The Astor Pavilion',
      address: 'The St. Regis Hotel, Lower Parel, Mumbai',
      mapUrl: 'https://maps.google.com',
      description: 'Artisan culinary experience paired with fine reserves, followed by live jazz ensemble and midnight lounge.'
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
    setIsPlaying(playing);
  };

  const handleOpen = () => {
    setOpened(true);
    if (data.music?.enabled !== false && playerRef.current) {
      const playing = playerRef.current.toggle('orchestral', data.music?.trackId);
      setIsPlaying(playing);
    }
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
      return isNaN(d.getTime()) ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) : d;
    } catch {
      return new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
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

  // UNREVEALED: Black-Tie VIP Pass & Holographic Seal
  if (!opened) {
    return (
      <div
        className="min-h-screen bg-[#070b19] text-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden select-none"
        style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
      >
        {/* Subtle geometric starfield background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#e6c894_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 max-w-sm w-full mx-auto text-center flex flex-col items-center">
          {/* VIP Pass Card Container */}
          <div className="w-full bg-gradient-to-b from-[#0c1633] via-[#091129] to-[#050916] border-2 border-[#e6c894]/70 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
            {/* Corner Badges */}
            <span className="absolute top-2 left-2 text-[#e6c894]/60 text-xs font-serif">◈</span>
            <span className="absolute top-2 right-2 text-[#e6c894]/60 text-xs font-serif">◈</span>
            <span className="absolute bottom-2 left-2 text-[#e6c894]/60 text-xs font-serif">◈</span>
            <span className="absolute bottom-2 right-2 text-[#e6c894]/60 text-xs font-serif">◈</span>

            <p className="text-[10px] uppercase tracking-[0.35em] text-[#e6c894] mb-2 font-medium">
              VIP Invitation • Black Tie
            </p>

            <h2 className="text-xl sm:text-2xl font-normal text-[#f8fafc] mb-1 leading-snug">
              {galaTitle}
            </h2>
            <p className="text-xs text-[#94a3b8] italic mb-6 font-serif">
              Presented by {orgName}
            </p>

            {/* Clickable Holographic Star Crest */}
            <button
              onClick={handleOpen}
              className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#99722a] via-[#e6c894] to-[#fdedbe] p-1 shadow-[0_0_35px_rgba(230,200,148,0.5)] hover:shadow-[0_0_50px_rgba(230,200,148,0.8)] transition-all duration-300 hover:scale-105 mx-auto flex items-center justify-center cursor-pointer mb-5"
              aria-label="Access VIP Gala Invitation"
            >
              <div className="w-full h-full rounded-full bg-[#070b19] border border-[#e6c894] flex flex-col items-center justify-center p-2">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#e6c894] transition-transform duration-300 group-hover:rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {/* Four-Point Star Icon */}
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
                </svg>
                <span className="text-[9px] uppercase tracking-widest text-[#e6c894] mt-1 font-sans font-semibold">
                  Access
                </span>
              </div>
            </button>

            <p className="text-xs text-[#94a3b8] font-sans">
              Tap the crest to unlock your admission
            </p>
          </div>
        </div>
      </div>
    );
  }

  // REVEALED: Full Black-Tie Grand Gala Experience
  return (
    <div className="min-h-screen bg-[#070b19] text-[#f8fafc] relative selection:bg-[#e6c894] selection:text-[#070b19] pb-24">
      {/* Sticky Audio Control */}
      <button
        onClick={toggleMusic}
        className="fixed top-5 right-5 z-50 p-3 rounded-full bg-[#0c1633]/90 border border-[#e6c894]/70 text-[#e6c894] shadow-lg backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
        aria-label="Toggle ambient music"
      >
        {isPlaying ? (
          <span className="flex items-center gap-1.5 text-xs font-sans tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#e6c894] animate-pulse" />
            Symphony Playing
          </span>
        ) : (
          <span className="text-xs font-sans tracking-wide">🎵 Play Symphony</span>
        )}
      </button>

      {/* HERO SECTION */}
      <header className="pt-16 pb-12 px-4 text-center max-w-3xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#e6c894]/40 bg-[#0c1633]/60 text-[#e6c894] text-[11px] tracking-[0.25em] uppercase mb-6 font-sans">
          <span>◈</span>
          <span>By Royal Invitation Only</span>
          <span>◈</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#f8fafc] tracking-wide mb-3 leading-tight">
          {galaTitle}
        </h1>

        <p className="text-sm sm:text-base text-[#e6c894] italic font-serif max-w-lg mx-auto mb-8">
          "{tagline}"
        </p>

        {/* Date & Main Venue Card */}
        <div className="bg-gradient-to-r from-[#0c1633]/80 via-[#101e45]/90 to-[#0c1633]/80 border border-[#e6c894]/50 rounded-xl p-5 max-w-lg mx-auto shadow-xl">
          <p className="text-sm sm:text-base font-serif text-[#f8fafc] mb-1 font-medium">
            📅 {format(targetDate, 'EEEE, MMMM d, yyyy')}
          </p>
          <p className="text-xs text-[#94a3b8] font-sans">
            📍 {mainEvent.venue} • {mainEvent.address}
          </p>
        </div>

        {/* Gala Countdown */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-widest text-[#e6c894] mb-3 font-sans">
            Red Carpet Countdown
          </p>
          <div className="flex justify-center gap-3 sm:gap-4 font-mono">
            <div className="w-16 sm:w-20 py-2.5 rounded-lg bg-[#0c1633] border border-[#e6c894]/40">
              <span className="block text-xl sm:text-2xl font-bold text-[#e6c894]">{timeLeft.days}</span>
              <span className="text-[10px] text-[#94a3b8] uppercase font-sans">Days</span>
            </div>
            <div className="w-16 sm:w-20 py-2.5 rounded-lg bg-[#0c1633] border border-[#e6c894]/40">
              <span className="block text-xl sm:text-2xl font-bold text-[#e6c894]">{timeLeft.hours}</span>
              <span className="text-[10px] text-[#94a3b8] uppercase font-sans">Hours</span>
            </div>
            <div className="w-16 sm:w-20 py-2.5 rounded-lg bg-[#0c1633] border border-[#e6c894]/40">
              <span className="block text-xl sm:text-2xl font-bold text-[#e6c894]">{timeLeft.minutes}</span>
              <span className="text-[10px] text-[#94a3b8] uppercase font-sans">Mins</span>
            </div>
            <div className="w-16 sm:w-20 py-2.5 rounded-lg bg-[#0c1633] border border-[#e6c894]/40">
              <span className="block text-xl sm:text-2xl font-bold text-[#e6c894]">{timeLeft.seconds}</span>
              <span className="text-[10px] text-[#94a3b8] uppercase font-sans">Secs</span>
            </div>
          </div>
        </div>
      </header>

      {/* DRESS CODE & PATRON MESSAGE */}
      <section className="py-8 px-4 max-w-2xl mx-auto">
        <div className="bg-[#0c1633]/50 border-l-4 border-[#e6c894] p-6 rounded-r-xl">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#e6c894] font-sans font-semibold mb-2">
            Dress Code & Patronage
          </h3>
          <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed font-serif italic mb-3">
            {data.message ||
              'You are cordially invited to celebrate excellence, visionary leadership, and milestone achievements alongside global leaders, innovators, and distinguished guests.'}
          </p>
          <div className="inline-block px-3 py-1 rounded bg-[#070b19] border border-[#e6c894]/40 text-xs text-[#e6c894] font-sans">
            Dress Code: Black Tie / Evening Formals
          </div>
        </div>
      </section>

      {/* SCHEDULE OF EVENTS */}
      <section className="py-10 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e6c894] font-sans">Gala Schedule</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#f8fafc] mt-1">Evening Program</h2>
        </div>

        <div className="space-y-6">
          {events.map((event, idx) => (
            <div
              key={event.key || idx}
              className="bg-gradient-to-r from-[#0c1633] to-[#101e45] border border-[#e6c894]/40 rounded-xl p-6 shadow-md transition-all hover:border-[#e6c894] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider bg-[#e6c894] text-[#070b19]">
                    {event.time || '6:30 PM'}
                  </span>
                  <span className="text-xs text-[#94a3b8] font-mono">{event.date}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-serif text-[#f8fafc] font-medium">
                  {event.title}
                </h3>
                <p className="text-xs text-[#e6c894] font-sans mt-0.5">
                  📍 {event.venue} {event.address ? `• ${event.address}` : ''}
                </p>
                {event.description && (
                  <p className="text-xs text-[#94a3b8] mt-2 leading-relaxed font-serif">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 md:pt-0">
                {event.address && (
                  <button
                    onClick={() => copyAddress(event.key, `${event.venue}, ${event.address}`)}
                    className="px-3 py-1.5 rounded-lg border border-[#e6c894]/60 text-xs text-[#e6c894] hover:bg-[#e6c894]/10 font-sans transition-colors cursor-pointer"
                  >
                    {copiedKey === event.key ? 'Copied ✓' : 'Copy Venue'}
                  </button>
                )}
                <a
                  href={event.mapUrl || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#e6c894] text-[#070b19] text-xs font-sans font-medium hover:bg-[#ebd094] transition-colors"
                >
                  View Map
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP RSVP SECTION */}
      <section className="py-10 px-4 max-w-xl mx-auto">
        <div className="bg-[#0c1633] border-2 border-[#e6c894]/60 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-serif text-[#f8fafc] mb-1">VIP Guest Registration</h2>
          <p className="text-xs text-[#94a3b8] font-sans mb-6">
            Kindly confirm your seat reservation by submitting your guest credentials below
          </p>

          {rsvpSent ? (
            <div className="p-4 rounded-xl bg-[#070b19] border border-[#e6c894] text-[#e6c894] text-sm font-serif">
              ✨ Admission Confirmed! Your VIP credentials have been registered with the Gala Secretariat.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRsvpSent(true);
              }}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#e6c894] mb-1 font-sans">
                  Honored Guest Full Name & Title
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Dr. Vikramaditya Singhania, Managing Director"
                  className="w-full px-3 py-2 rounded-lg bg-[#070b19] border border-[#e6c894]/50 text-[#f8fafc] text-xs sm:text-sm focus:outline-none focus:border-[#e6c894]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#e6c894] mb-1 font-sans">
                  Banquet Dietary Preference
                </label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#070b19] border border-[#e6c894]/50 text-[#f8fafc] text-xs sm:text-sm focus:outline-none focus:border-[#e6c894]"
                >
                  <option value="Gourmet Non-Vegetarian">Gourmet Non-Vegetarian (Chef Tasting Menu)</option>
                  <option value="Fine Vegetarian">Fine Vegetarian & Truffle Course</option>
                  <option value="Jain Vegetarian">Jain Vegetarian Course</option>
                  <option value="Vegan / Gluten-Free">Vegan / Gluten-Free Experience</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#e6c894] to-[#d4a373] text-[#070b19] font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 transition cursor-pointer shadow-md"
              >
                Confirm VIP Gala Admission
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CLOSING */}
      <footer className="text-center pt-8 pb-4 text-xs text-[#94a3b8] font-serif">
        <p className="text-[#e6c894] text-sm mb-1 font-medium">◈ Ad Astra Per Aspera ◈</p>
        <p>Curated with distinction by {orgName}</p>
      </footer>
    </div>
  );
}

