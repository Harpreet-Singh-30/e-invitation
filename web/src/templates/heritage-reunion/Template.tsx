import { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { createAmbientPlayer } from '../common/audio';

interface TemplateProps {
  data: {
    title?: string;
    couple?: {
      groom?: string; // Family / Patriarch Name
      bride?: string; // Matriarch / Branch Name
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

export default function HeritageReunionTemplate({ data }: TemplateProps) {
  const isThumbnail = Boolean((data as any)?._isThumbnail || (data as any)?.options?.intro === false || (data as any)?.previewOpened);
  const [opened, setOpened] = useState(isThumbnail);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('4');
  const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

  const familyName = data.couple?.groom || 'The Kapoor & Mehra Heritage';
  const tagline = data.couple?.tagline || 'Rooted in Love, Growing Together Across Generations';

  const defaultEvents = [
    {
      key: 'arrival-blessings',
      title: 'Ancestor Gratitude & Lamp Lighting',
      date: '2027-11-20',
      time: '11:00 AM',
      venue: 'Heritage Courtyard',
      address: 'Virasat Haveli, Amer Road, Jaipur',
      mapUrl: 'https://maps.google.com',
      description: 'Lighting the sacred generational diya, honoring our elders, and sharing heirloom memories.'
    },
    {
      key: 'family-portrait',
      title: 'Generations Portrait & Story Circle',
      date: '2027-11-20',
      time: '4:30 PM',
      venue: 'The Grand Banyan Lawn',
      address: 'Virasat Haveli, Amer Road, Jaipur',
      mapUrl: 'https://maps.google.com',
      description: 'Formal family tree portraits across four generations, followed by open mic stories and old home videos.'
    },
    {
      key: 'reunion-banquet',
      title: 'Royal Feast & Folk Sangeet',
      date: '2027-11-20',
      time: '7:30 PM',
      venue: 'Maharaja Banquet Hall',
      address: 'Virasat Haveli, Amer Road, Jaipur',
      mapUrl: 'https://maps.google.com',
      description: 'Traditional Rajasthani thali dinner, acoustic folk performances, and celebratory dance until late.'
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
    const playing = playerRef.current.toggle('temple', data.music?.trackId);
    setIsPlaying(playing);
  };

  const handleOpen = () => {
    setOpened(true);
    if (data.music?.enabled !== false && playerRef.current) {
      const playing = playerRef.current.toggle('temple', data.music?.trackId);
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
      return isNaN(d.getTime()) ? new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) : d;
    } catch {
      return new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
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

  // UNREVEALED: Royal Emerald Heirloom Box with Brass Banyan Medallion
  if (!opened) {
    return (
      <div
        className="min-h-screen bg-[#061e16] text-[#f7f5ee] flex items-center justify-center p-4 relative overflow-hidden select-none"
        style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
      >
        {/* Subtle background banyan leaf watermarks */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#dfb86c_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 max-w-sm w-full mx-auto text-center flex flex-col items-center">
          {/* Ornate Brass Frame Container */}
          <div className="w-full bg-gradient-to-b from-[#0a2e22] to-[#04150f] border-2 border-[#dfb86c]/70 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative">
            {/* Corner Filigrees */}
            <span className="absolute top-2 left-2 text-[#dfb86c]/60 text-xs font-serif">❖</span>
            <span className="absolute top-2 right-2 text-[#dfb86c]/60 text-xs font-serif">❖</span>
            <span className="absolute bottom-2 left-2 text-[#dfb86c]/60 text-xs font-serif">❖</span>
            <span className="absolute bottom-2 right-2 text-[#dfb86c]/60 text-xs font-serif">❖</span>

            <p className="text-[11px] uppercase tracking-[0.3em] text-[#dfb86c] mb-2 font-medium">
              Virasat • Family Homecoming
            </p>

            <h2 className="text-xl sm:text-2xl font-normal text-[#fbf7ee] mb-1 leading-snug">
              {familyName}
            </h2>
            <p className="text-xs text-[#d1e5db] italic mb-6 font-serif">
              "Three Generations, One Eternal Bond"
            </p>

            {/* Clickable Banyan Tree Brass Medallion */}
            <button
              onClick={handleOpen}
              className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#99722a] via-[#dfb86c] to-[#fdedbe] p-1 shadow-[0_0_30px_rgba(223,184,108,0.45)] hover:shadow-[0_0_45px_rgba(223,184,108,0.7)] transition-all duration-300 hover:scale-105 mx-auto flex items-center justify-center cursor-pointer mb-5"
              aria-label="Unlock Family Invitation"
            >
              <div className="w-full h-full rounded-full bg-[#061e16] border border-[#dfb86c] flex flex-col items-center justify-center p-2">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#dfb86c] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {/* Banyan Tree Icon */}
                  <path d="M12 22v-8m0 0a4 4 0 004-4c0-2-1.5-4-4-4s-4 2-4 4a4 4 0 004 4zM6 10C4 10 3 12 3 14c0 3 3 5 5 5M18 10c2 0 3 2 3 4 0 3-3 5-5 5" />
                  <path d="M12 6a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                <span className="text-[9px] uppercase tracking-widest text-[#dfb86c] mt-1 font-sans font-semibold">
                  Unlock
                </span>
              </div>
            </button>

            <p className="text-xs text-[#a3c9b7] font-sans">
              Tap the banyan seal to enter
            </p>
          </div>
        </div>
      </div>
    );
  }

  // REVEALED: Full Royal Heritage Family Reunion Experience
  return (
    <div className="min-h-screen bg-[#072118] text-[#f7f5ee] relative selection:bg-[#dfb86c] selection:text-[#061e16] pb-24">
      {/* Sticky Audio Control */}
      <button
        onClick={toggleMusic}
        className="fixed top-5 right-5 z-50 p-3 rounded-full bg-[#0a2e22]/90 border border-[#dfb86c]/70 text-[#dfb86c] shadow-lg backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
        aria-label="Toggle ambient music"
      >
        {isPlaying ? (
          <span className="flex items-center gap-1.5 text-xs font-sans tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#dfb86c] animate-pulse" />
            Santoor Playing
          </span>
        ) : (
          <span className="text-xs font-sans tracking-wide">🎵 Play Santoor</span>
        )}
      </button>

      {/* HERO SECTION */}
      <header className="pt-16 pb-12 px-4 text-center max-w-3xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#dfb86c]/40 bg-[#0a2e22]/60 text-[#dfb86c] text-[11px] tracking-[0.25em] uppercase mb-6 font-sans">
          <span>🌿</span>
          <span>Grand Family Homecoming</span>
          <span>🌿</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#fbf7ee] tracking-wide mb-3 leading-tight">
          {familyName}
        </h1>

        <p className="text-sm sm:text-base text-[#dfb86c] italic font-serif max-w-lg mx-auto mb-8">
          "{tagline}"
        </p>

        {/* Date & Main Venue Card */}
        <div className="bg-gradient-to-r from-[#0a2e22]/80 via-[#0e3e2e]/90 to-[#0a2e22]/80 border border-[#dfb86c]/50 rounded-xl p-5 max-w-lg mx-auto shadow-xl">
          <p className="text-sm sm:text-base font-serif text-[#f8fafc] mb-1 font-medium">
            📅 {format(targetDate, 'EEEE, MMMM d, yyyy')}
          </p>
          <p className="text-xs text-[#a3c9b7] font-sans">
            📍 {mainEvent.venue} • {mainEvent.address}
          </p>
        </div>

        {/* Generational Reunion Countdown */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-widest text-[#dfb86c] mb-3 font-sans">
            Gathering Countdown
          </p>
          <div className="flex justify-center gap-3 sm:gap-4 font-mono">
            <div className="w-16 sm:w-20 py-2.5 rounded-lg bg-[#0a2e22] border border-[#dfb86c]/40">
              <span className="block text-xl sm:text-2xl font-bold text-[#dfb86c]">{timeLeft.days}</span>
              <span className="text-[10px] text-[#a3c9b7] uppercase font-sans">Days</span>
            </div>
            <div className="w-16 sm:w-20 py-2.5 rounded-lg bg-[#0a2e22] border border-[#dfb86c]/40">
              <span className="block text-xl sm:text-2xl font-bold text-[#dfb86c]">{timeLeft.hours}</span>
              <span className="text-[10px] text-[#a3c9b7] uppercase font-sans">Hours</span>
            </div>
            <div className="w-16 sm:w-20 py-2.5 rounded-lg bg-[#0a2e22] border border-[#dfb86c]/40">
              <span className="block text-xl sm:text-2xl font-bold text-[#dfb86c]">{timeLeft.minutes}</span>
              <span className="text-[10px] text-[#a3c9b7] uppercase font-sans">Mins</span>
            </div>
            <div className="w-16 sm:w-20 py-2.5 rounded-lg bg-[#0a2e22] border border-[#dfb86c]/40">
              <span className="block text-xl sm:text-2xl font-bold text-[#dfb86c]">{timeLeft.seconds}</span>
              <span className="text-[10px] text-[#a3c9b7] uppercase font-sans">Secs</span>
            </div>
          </div>
        </div>
      </header>

      {/* BLESSINGS & ANCESTRAL MESSAGE */}
      <section className="py-8 px-4 max-w-2xl mx-auto">
        <div className="bg-[#0a2e22]/50 border-l-4 border-[#dfb86c] p-6 rounded-r-xl">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#dfb86c] font-sans font-semibold mb-2">
            A Message From Our Elders
          </h3>
          <p className="text-sm sm:text-base text-[#e2f0e8] leading-relaxed font-serif italic">
            {data.message ||
              'A tree is known by its roots, and a family by its values. As we gather from different corners of the world to celebrate our shared heritage, your presence will complete this sacred circle of joy, laughter, and timeless memories.'}
          </p>
        </div>
      </section>

      {/* SCHEDULE OF CELEBRATIONS */}
      <section className="py-10 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfb86c] font-sans">Event Itinerary</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#fbf7ee] mt-1">Reunion Program</h2>
        </div>

        <div className="space-y-6">
          {events.map((event, idx) => (
            <div
              key={event.key || idx}
              className="bg-gradient-to-r from-[#0a2e22] to-[#0d382a] border border-[#dfb86c]/40 rounded-xl p-6 shadow-md transition-all hover:border-[#dfb86c] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider bg-[#dfb86c] text-[#061e16]">
                    {event.time || '11:00 AM'}
                  </span>
                  <span className="text-xs text-[#a3c9b7] font-mono">{event.date}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-serif text-[#fbf7ee] font-medium">
                  {event.title}
                </h3>
                <p className="text-xs text-[#dfb86c] font-sans mt-0.5">
                  📍 {event.venue} {event.address ? `• ${event.address}` : ''}
                </p>
                {event.description && (
                  <p className="text-xs text-[#cde2d7] mt-2 leading-relaxed font-serif">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 md:pt-0">
                {event.address && (
                  <button
                    onClick={() => copyAddress(event.key, `${event.venue}, ${event.address}`)}
                    className="px-3 py-1.5 rounded-lg border border-[#dfb86c]/60 text-xs text-[#dfb86c] hover:bg-[#dfb86c]/10 font-sans transition-colors cursor-pointer"
                  >
                    {copiedKey === event.key ? 'Copied ✓' : 'Copy Venue'}
                  </button>
                )}
                <a
                  href={event.mapUrl || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#dfb86c] text-[#061e16] text-xs font-sans font-medium hover:bg-[#ebd094] transition-colors"
                >
                  View Map
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLAN / BRANCH RSVP SECTION */}
      <section className="py-10 px-4 max-w-xl mx-auto">
        <div className="bg-[#0a2e22] border-2 border-[#dfb86c]/60 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-serif text-[#fbf7ee] mb-1">Family Branch Attendance</h2>
          <p className="text-xs text-[#a3c9b7] font-sans mb-6">
            Please let the organizing committee know your branch count for seating & catering
          </p>

          {rsvpSent ? (
            <div className="p-4 rounded-xl bg-[#061e16] border border-[#dfb86c] text-[#dfb86c] text-sm font-serif">
              ✨ Shubh Aagman! Your family branch details have been recorded with warmth.
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
                <label className="block text-xs uppercase tracking-wider text-[#dfb86c] mb-1 font-sans">
                  Family / Branch Name
                </label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="e.g. Sanjay & Sunita Kapoor Family (Delhi Branch)"
                  className="w-full px-3 py-2 rounded-lg bg-[#061e16] border border-[#dfb86c]/50 text-[#fbf7ee] text-xs sm:text-sm focus:outline-none focus:border-[#dfb86c]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfb86c] mb-1 font-sans">
                  Total Family Members Attending
                </label>
                <select
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#061e16] border border-[#dfb86c]/50 text-[#fbf7ee] text-xs sm:text-sm focus:outline-none focus:border-[#dfb86c]"
                >
                  <option value="1">1 Member</option>
                  <option value="2">2 Members</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members (Standard Family)</option>
                  <option value="6">6 Members</option>
                  <option value="8+">8+ Members (Extended Branch)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#dfb86c] to-[#c29b4e] text-[#061e16] font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 transition cursor-pointer shadow-md"
              >
                Confirm Family Branch RSVP
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CLOSING BLESSING */}
      <footer className="text-center pt-8 pb-4 text-xs text-[#a3c9b7] font-serif">
        <p className="text-[#dfb86c] text-sm mb-1 font-medium">❖ Vasudhaiva Kutumbakam ❖</p>
        <p>With blessings from the elders of {familyName}</p>
      </footer>
    </div>
  );
}

