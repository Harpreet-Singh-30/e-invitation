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

export default function IvoryKayalTemplate({ data }: TemplateProps) {
  const [opened, setOpened] = useState(data.previewOpened || false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedAddressKey, setCopiedAddressKey] = useState<string | null>(null);
  const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

  const mainEvent = data.events.find(e => e.key === 'wedding' || e.key.includes('ceremony')) || data.events[0] || {
    key: 'wedding',
    title: 'Auspicious Muhurtham',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    time: '9:30 AM - 10:45 AM',
    venue: 'Sri Meenakshi Kalyana Mandapam',
    address: 'Palace Road, Chennai, Tamil Nadu',
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
    const playing = playerRef.current.toggle('temple', data.music?.trackId);
    setIsPlayingMusic(playing);
  };

  const copyAddress = (key: string, addressText: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(addressText).then(() => {
        setCopiedAddressKey(key);
        setTimeout(() => setCopiedAddressKey(null), 2500);
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

  // Calculate countdown
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

  // Clean South Indian initials (e.g. S & A)
  const groomInitial = (data.couple.groom || 'G').charAt(0).toUpperCase();
  const brideInitial = (data.couple.bride || 'B').charAt(0).toUpperCase();

  // If not opened yet, show opening reveal
  if (!opened) {
    return (
      <div 
        className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 relative overflow-hidden select-none"
        style={{ fontFamily: "'Cormorant Garamond', 'Cinzel', serif" }}
      >
        {/* Subtle Kasavu Gold Border */}
        <div className="absolute inset-3 sm:inset-6 border border-[#c5a059]/30 rounded-2xl pointer-events-none" />
        <div className="absolute inset-5 sm:inset-8 border-2 border-[#2a4d45]/20 rounded-xl pointer-events-none" />

        {/* Traditional Kolam corner accents */}
        <div className="absolute top-8 left-8 text-[#c5a059]/40 hidden sm:block">
          <KolamCorner />
        </div>
        <div className="absolute top-8 right-8 text-[#c5a059]/40 rotate-90 hidden sm:block">
          <KolamCorner />
        </div>
        <div className="absolute bottom-8 left-8 text-[#c5a059]/40 -rotate-90 hidden sm:block">
          <KolamCorner />
        </div>
        <div className="absolute bottom-8 right-8 text-[#c5a059]/40 rotate-180 hidden sm:block">
          <KolamCorner />
        </div>

        {/* Central Card */}
        <div className="max-w-md w-full text-center z-10 py-10 px-6 sm:px-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-[#c5a059]/40">
          {/* Jasmine Garland / Temple Lotus Motif */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-6 text-[#2a4d45] flex items-center justify-center">
            <TempleLotusIcon />
          </div>

          <p className="text-xs tracking-[0.3em] uppercase text-[#2a4d45] font-medium mb-3">
            शुभम् • Mangalyam
          </p>

          <h1 className="text-3xl sm:text-4xl text-[#2c2520] font-semibold tracking-wide mb-2">
            {data.couple.groom}
          </h1>
          <div className="flex items-center justify-center space-x-3 my-2 text-[#c5a059]">
            <span className="h-px w-10 bg-[#c5a059]/50" />
            <span className="text-xl italic font-serif">&</span>
            <span className="h-px w-10 bg-[#c5a059]/50" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-[#2c2520] font-semibold tracking-wide mb-4">
            {data.couple.bride}
          </h1>

          <p className="text-sm italic text-[#5c5248] mb-8 max-w-xs mx-auto">
            {data.couple.tagline || 'In the sacred presence of family, tradition, and divine blessings'}
          </p>

          {/* Monogram Seal Button */}
          <button
            onClick={() => setOpened(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-[#2a4d45] text-[#faf8f5] rounded-full text-sm font-medium tracking-widest uppercase transition-all duration-300 shadow-md hover:bg-[#1e3a33] hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
          >
            <span className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full border border-[#c5a059]/60 flex items-center justify-center text-[10px] font-serif text-[#c5a059]">
                {groomInitial}{brideInitial}
              </span>
              <span>Open Invitation</span>
            </span>
          </button>

          <p className="text-[11px] text-[#7c7065] tracking-wider uppercase mt-6">
            Tap to unfold the wedding celebration
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#faf8f5] text-[#2c2520] relative selection:bg-[#2a4d45]/10 selection:text-[#2a4d45]"
      style={{ fontFamily: "'Cormorant Garamond', 'Cinzel', serif" }}
    >
      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#c5a059]/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-[#2a4d45] text-[#faf8f5] flex items-center justify-center text-xs font-serif font-bold">
              {groomInitial}{brideInitial}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#2a4d45] font-semibold hidden sm:inline">
              {data.couple.groom} & {data.couple.bride}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {/* Music Button */}
            <button
              onClick={toggleMusic}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all ${
                isPlayingMusic 
                  ? 'bg-[#2a4d45] text-white border-[#2a4d45]' 
                  : 'bg-white text-[#2a4d45] border-[#c5a059]/40 hover:bg-[#f5f0e8]'
              }`}
              title={isPlayingMusic ? 'Mute ambient melody' : 'Play ambient music'}
            >
              <span>{isPlayingMusic ? '🔊' : '🎵'}</span>
              <span className="font-sans font-medium tracking-wide">
                {isPlayingMusic ? 'Music On' : 'Play Music'}
              </span>
            </button>

            <a
              href="#schedule"
              className="text-[#2a4d45] hover:text-[#c5a059] font-medium tracking-wider uppercase hidden sm:inline transition"
            >
              Schedule
            </a>
            <a
              href="#venue"
              className="text-[#2a4d45] hover:text-[#c5a059] font-medium tracking-wider uppercase hidden sm:inline transition"
            >
              Venue
            </a>
          </div>
        </div>
      </header>

      {/* Decorative Kasavu Borders */}
      <div className="h-1 bg-gradient-to-r from-[#2a4d45] via-[#c5a059] to-[#2a4d45]" />

      {/* HERO SECTION */}
      <section className="relative px-4 pt-16 pb-20 text-center overflow-hidden">
        {/* Subtle Watermark Kolam */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.03] pointer-events-none text-[#2a4d45]">
          <TempleKolamLarge />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Top Traditional Motif */}
          <div className="flex items-center justify-center space-x-4 mb-4 text-[#c5a059]">
            <span className="h-px w-12 bg-[#c5a059]/40" />
            <span className="text-xs uppercase tracking-[0.35em] text-[#2a4d45] font-semibold">
              शुभम् • Divine Union
            </span>
            <span className="h-px w-12 bg-[#c5a059]/40" />
          </div>

          <p className="text-sm tracking-widest uppercase text-[#5c5248] mb-6">
            Together with their families
          </p>

          {/* Couple Names */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-[#2c2520] tracking-tight leading-tight">
            {data.couple.groom}
          </h1>

          <div className="flex items-center justify-center my-3 text-[#c5a059]">
            <span className="h-px w-16 bg-[#c5a059]/50" />
            <span className="mx-4 text-2xl md:text-3xl font-serif italic">&</span>
            <span className="h-px w-16 bg-[#c5a059]/50" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-[#2c2520] tracking-tight leading-tight mb-6">
            {data.couple.bride}
          </h1>

          {/* Tagline */}
          {data.couple.tagline && (
            <p className="text-base sm:text-lg italic text-[#5c5248] max-w-xl mx-auto mb-8 font-serif">
              "{data.couple.tagline}"
            </p>
          )}

          {/* Key Date Badge */}
          <div className="inline-block bg-white/90 border border-[#c5a059]/40 shadow-sm rounded-2xl px-6 py-4 max-w-md w-full">
            <p className="text-xs uppercase tracking-widest text-[#2a4d45] font-semibold mb-1">
              Save The Auspicious Date
            </p>
            <p className="text-2xl font-serif font-bold text-[#2c2520]">
              {format(parsedMainDate, 'EEEE, MMMM d, yyyy')}
            </p>
            {mainEvent.time && (
              <p className="text-sm text-[#7c7065] mt-1 font-sans">
                Muhurtham: <span className="font-semibold text-[#2a4d45]">{mainEvent.time}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* COUNTDOWN TIMER SECTION */}
      <section className="py-10 bg-[#f5f0e8]/60 border-y border-[#c5a059]/20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#5c5248] font-medium mb-5">
            Counting Down to the Sacred Muhurtham
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
            <div className="bg-white rounded-xl p-3 border border-[#c5a059]/30 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#2a4d45]">
                {timeLeft.days}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#7c7065]">Days</span>
            </div>
            <div className="bg-white rounded-xl p-3 border border-[#c5a059]/30 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#2a4d45]">
                {timeLeft.hours}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#7c7065]">Hours</span>
            </div>
            <div className="bg-white rounded-xl p-3 border border-[#c5a059]/30 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#2a4d45]">
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#7c7065]">Mins</span>
            </div>
            <div className="bg-white rounded-xl p-3 border border-[#c5a059]/30 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#2a4d45]">
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#7c7065]">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* INVITATION MESSAGE & FAMILY BLESSINGS */}
      {data.message && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-12 h-12 mx-auto text-[#c5a059] mb-4">
              <JasmineFlowerIcon />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#2c2520] mb-4">
              Our Celebration & Blessings
            </h2>
            <div className="w-16 h-0.5 bg-[#c5a059] mx-auto mb-6" />

            <div className="text-base sm:text-lg text-[#5c5248] leading-relaxed whitespace-pre-line font-serif">
              {data.message}
            </div>
          </div>
        </section>
      )}

      {/* CEREMONIES / SCHEDULE SECTION */}
      <section id="schedule" className="py-16 px-4 bg-[#faf8f5]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-[#2a4d45] font-semibold mb-2">
              Wedding Itinerary
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2c2520]">
              Sacred Ceremonies & Celebrations
            </h2>
            <div className="w-20 h-0.5 bg-[#c5a059] mx-auto mt-4" />
          </div>

          <div className="space-y-6">
            {data.events.map((event, index) => {
              let eventDateObj = new Date();
              try {
                const parsed = new Date(event.date);
                if (!isNaN(parsed.getTime())) eventDateObj = parsed;
              } catch {}

              const isMain = event.key === 'wedding' || index === 0;

              return (
                <div
                  key={event.key || index}
                  className={`bg-white rounded-2xl p-6 sm:p-8 transition-all border ${
                    isMain 
                      ? 'border-[#2a4d45] shadow-md relative overflow-hidden' 
                      : 'border-[#c5a059]/30 shadow-xs hover:border-[#c5a059]'
                  }`}
                >
                  {isMain && (
                    <div className="absolute top-0 right-0 bg-[#2a4d45] text-[#faf8f5] text-[10px] uppercase tracking-widest font-semibold px-4 py-1 rounded-bl-xl">
                      Main Muhurtham
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <span className="text-xs tracking-wider uppercase text-[#c5a059] font-medium font-sans">
                        Function {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-[#2c2520] mt-1">
                        {event.title}
                      </h3>
                      <p className="text-sm font-serif text-[#2a4d45] font-semibold mt-1">
                        {format(eventDateObj, 'EEEE, MMMM d, yyyy')}
                        {event.time && ` • ${event.time}`}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-semibold text-[#2c2520] text-sm sm:text-base">
                        {event.venue}
                      </p>
                      {event.address && (
                        <p className="text-xs text-[#7c7065] mt-0.5 max-w-xs sm:ml-auto">
                          {event.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: Map and Copy Address */}
                  <div className="mt-6 pt-4 border-t border-[#f5f0e8] flex flex-wrap gap-3 items-center">
                    {event.mapUrl && event.mapUrl !== '#' ? (
                      <a
                        href={event.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#2a4d45] text-white rounded-lg text-xs font-sans tracking-wide hover:bg-[#1e3a33] transition"
                      >
                        <span>📍</span>
                        <span>View on Google Maps</span>
                      </a>
                    ) : (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${event.venue} ${event.address || ''}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#2a4d45] text-white rounded-lg text-xs font-sans tracking-wide hover:bg-[#1e3a33] transition"
                      >
                        <span>📍</span>
                        <span>Open in Maps</span>
                      </a>
                    )}

                    {event.address && (
                      <button
                        onClick={() => copyAddress(event.key || String(index), `${event.venue}, ${event.address}`)}
                        className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#f5f0e8] text-[#2c2520] rounded-lg text-xs font-sans hover:bg-[#eadecc] transition"
                      >
                        <span>📋</span>
                        <span>
                          {copiedAddressKey === (event.key || String(index)) ? 'Copied to Clipboard!' : 'Copy Address'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY SECTION */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#2a4d45] font-semibold mb-2">
            Moments of Joy
          </p>
          <h2 className="text-3xl font-serif font-bold text-[#2c2520] mb-8">
            Cherished Memories
          </h2>

          {data.gallery && data.gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.gallery.map((imgUrl, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-sm border border-[#c5a059]/20">
                  <img src={imgUrl} alt="Couple memory" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-lg mx-auto p-8 rounded-2xl bg-[#faf8f5] border border-[#c5a059]/40 text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-[#c5a059]">
                <TempleLotusIcon />
              </div>
              <p className="font-serif italic text-lg text-[#2c2520] mb-2">
                "Where there is love, there is life and divine grace."
              </p>
              <p className="text-xs uppercase tracking-widest text-[#7c7065]">
                {data.couple.groom} & {data.couple.bride}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* VENUE & LOCATION SECTION */}
      <section id="venue" className="py-16 px-4 bg-[#f5f0e8]/50 border-t border-[#c5a059]/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#2a4d45] font-semibold mb-2">
            Wedding Destination
          </p>
          <h2 className="text-3xl font-serif font-bold text-[#2c2520] mb-6">
            The Venue & Hospitality
          </h2>

          <div className="bg-white rounded-2xl p-8 border border-[#c5a059]/30 shadow-sm max-w-xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-[#2a4d45] mb-2">
              {mainEvent.venue}
            </h3>
            {mainEvent.address && (
              <p className="text-sm text-[#5c5248] mb-6 leading-relaxed font-sans">
                {mainEvent.address}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={mainEvent.mapUrl && mainEvent.mapUrl !== '#' ? mainEvent.mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${mainEvent.venue} ${mainEvent.address || ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#2a4d45] text-white rounded-xl text-xs font-sans tracking-wide hover:bg-[#1e3a33] transition shadow-xs"
              >
                📍 Get Directions on Google Maps
              </a>
              {mainEvent.address && (
                <button
                  onClick={() => copyAddress('main-venue', `${mainEvent.venue}, ${mainEvent.address}`)}
                  className="px-4 py-2.5 bg-[#f5f0e8] text-[#2c2520] rounded-xl text-xs font-sans hover:bg-[#eadecc] transition"
                >
                  {copiedAddressKey === 'main-venue' ? '✓ Copied!' : 'Copy Address'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER & BLESSINGS */}
      <footer className="py-16 px-4 bg-[#2a4d45] text-[#faf8f5] text-center">
        <div className="max-w-md mx-auto">
          <div className="w-12 h-12 mx-auto mb-4 text-[#c5a059]">
            <TempleLotusIcon />
          </div>
          <h3 className="text-2xl font-serif font-semibold text-[#faf8f5] mb-2">
            {data.couple.groom} & {data.couple.bride}
          </h3>
          <p className="text-xs uppercase tracking-[0.25em] text-[#c5a059] mb-6">
            Loka Samasta Sukhino Bhavantu
          </p>
          <p className="text-sm text-[#faf8f5]/80 font-serif italic mb-8">
            Your heartfelt presence, prayers, and blessings are the greatest gifts we could ever ask for.
          </p>
          <div className="h-px w-24 bg-[#c5a059]/40 mx-auto mb-6" />
          <p className="text-[11px] text-[#faf8f5]/60 tracking-widest uppercase">
            Crafted with warmth on InviteHub
          </p>
        </div>
      </footer>
    </div>
  );
}

// Lightweight SVGs for South Indian Heritage Aesthetic
function TempleLotusIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M24 6C24 6 20 16 20 24C20 28 22 32 24 34C26 32 28 28 28 24C28 16 24 6 24 6Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M24 16C18 18 10 24 12 32C13 36 17 38 21 36C22 35 23 33 24 31C25 33 26 35 27 36C31 38 35 36 36 32C38 24 30 18 24 16Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M24 34C24 37 20 41 14 41C10 41 8 38 9 35C10 32 14 31 18 32C20 33 22 34 24 34Z" />
      <path d="M24 34C24 37 28 41 34 41C38 41 40 38 39 35C38 32 34 31 30 32C28 33 26 34 24 34Z" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}

function JasmineFlowerIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <circle cx="16" cy="16" r="3" fill="currentColor" fillOpacity="0.2" />
      <path d="M16 6C16 11 13 14 16 16C19 14 16 11 16 6Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M26 16C21 16 18 13 16 16C18 19 21 16 26 16Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M16 26C16 21 19 18 16 16C13 18 16 21 16 26Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M6 16C11 16 14 19 16 16C14 13 11 16 6 16Z" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

function KolamCorner() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 36V12C4 7.58 7.58 4 12 4H36" />
      <path d="M10 36V16C10 12.68 12.68 10 16 10H36" />
      <circle cx="20" cy="20" r="3" />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
    </svg>
  );
}

function TempleKolamLarge() {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
      <circle cx="100" cy="100" r="80" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="60" />
      <polygon points="100,20 180,100 100,180 20,100" />
      <polygon points="100,35 165,100 100,165 35,100" />
      <circle cx="100" cy="100" r="15" />
    </svg>
  );
}

