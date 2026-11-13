import React, { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { createAmbientPlayer, type AmbientMusicStyle } from './audio';
import { ThemedGateScreen, type GateTheme } from './ThemedGateScreen';

export interface ThemedTemplateConfig {
  slug: string;
  category: string;
  themeName: string;
  gateTheme?: GateTheme;
  badgeText: string;
  badgeEmoji?: string;
  colors: {
    bg: string;
    bgGradient: string;
    cardBg: string;
    cardBorder: string;
    primaryText: string;
    accentText: string;
    mutedText: string;
    highlightBg: string;
    buttonGradient: string;
    buttonText: string;
    sealBorder: string;
    sealGlow: string;
    sealBg: string;
  };
  fonts: {
    heading: string;
    body: string;
    decorative?: string;
  };
  seal: {
    eyebrow: string;
    title: string;
    subtitle: string;
    actionText: string;
    iconSvg: React.ReactNode;
  };
  ambientStyle: AmbientMusicStyle;
  audioLabel: string;
  countdownLabel: string;
  messageHeading: string;
  rsvpType: 'standard' | 'dietary' | 'branch' | 'vip' | 'potluck';
  closingQuote: string;
  closingSub: string;
  defaultData: {
    groom: string; // Host / Honoree / Family
    bride: string; // Co-host / Milestone / Subtitle
    tagline: string;
    message: string;
    events: Array<{
      key: string;
      title: string;
      date: string;
      time: string;
      venue: string;
      address: string;
      description: string;
    }>;
  };
}

export function createThemedTemplate(config: ThemedTemplateConfig) {
  return function ThemedOccasionTemplate({ data }: { data: any }) {
    const isThumbnail = Boolean(data?._isThumbnail || data?.options?.intro === false);
    const [opened, setOpened] = useState(isThumbnail);
    const [isPlaying, setIsPlaying] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [rsvpSent, setRsvpSent] = useState(false);
    const [rsvpName, setRsvpName] = useState('');
    const [rsvpOption, setRsvpOption] = useState('');
    const playerRef = useRef<ReturnType<typeof createAmbientPlayer> | null>(null);

    const hostName = data?.couple?.groom || config.defaultData.groom;
    const coHostName = data?.couple?.bride || config.defaultData.bride;
    const tagline = data?.couple?.tagline || config.defaultData.tagline;
    const message = data?.message || config.defaultData.message;

    const events =
      data?.events && data.events.length > 0 ? data.events : config.defaultData.events;
    const mainEvent = events[0] || config.defaultData.events[0];

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
      const playing = playerRef.current.toggle(config.ambientStyle, data?.music?.trackId);
      setIsPlaying(playing);
    };

    const handleOpen = () => {
      setOpened(true);
      if (data?.music?.enabled !== false && playerRef.current) {
        const playing = playerRef.current.toggle(config.ambientStyle, data?.music?.trackId);
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
        return isNaN(d.getTime()) ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : d;
      } catch {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
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

    // UNREVEALED STATE (Bespoke Themed Gate / Screen / Sealed Folio)
    if (!opened) {
      return (
        <ThemedGateScreen
          gateTheme={config.gateTheme || 'default'}
          hostName={hostName}
          coHostName={coHostName}
          tagline={tagline}
          badgeText={config.badgeText}
          badgeEmoji={config.badgeEmoji}
          actionText={config.seal.actionText}
          onOpen={handleOpen}
          colors={{
            bg: config.colors.bg,
            primaryText: config.colors.primaryText,
            accentText: config.colors.accentText,
            mutedText: config.colors.mutedText,
            cardBg: config.colors.cardBg,
            sealGlow: config.colors.sealGlow,
          }}
          fonts={{
            heading: config.fonts.heading,
            body: config.fonts.body,
          }}
        />
      );
    }

    // REVEALED STATE (Full Interactive Invitation)
    return (
      <div
        className="min-h-screen relative pb-24 overflow-x-hidden"
        style={{
          backgroundColor: config.colors.bg,
          color: config.colors.primaryText,
          fontFamily: config.fonts.body,
        }}
      >
        {/* Sticky Audio Control */}
        <button
          onClick={toggleMusic}
          className="fixed top-5 right-5 z-50 p-2.5 sm:p-3 rounded-full border shadow-lg backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer flex items-center gap-1.5"
          style={{
            backgroundColor: config.colors.cardBg,
            borderColor: config.colors.sealBorder,
            color: config.colors.accentText,
          }}
          aria-label="Toggle ambient music"
        >
          {isPlaying ? (
            <span className="flex items-center gap-1.5 text-xs font-sans tracking-wide">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: config.colors.accentText }}
              />
              {config.audioLabel} Playing
            </span>
          ) : (
            <span className="text-xs font-sans tracking-wide">🎵 {config.audioLabel}</span>
          )}
        </button>

        {/* HERO SECTION */}
        <header className="pt-16 pb-12 px-4 text-center max-w-3xl mx-auto relative">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full border text-[11px] tracking-[0.25em] uppercase mb-6 font-sans"
            style={{
              borderColor: config.colors.cardBorder,
              backgroundColor: config.colors.cardBg,
              color: config.colors.accentText,
            }}
          >
            <span>{config.badgeEmoji || '✨'}</span>
            <span>{config.badgeText}</span>
            <span>{config.badgeEmoji || '✨'}</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl tracking-wide mb-3 leading-tight"
            style={{
              fontFamily: config.fonts.heading,
              color: config.colors.primaryText,
            }}
          >
            {hostName} {coHostName ? <span style={{ color: config.colors.accentText }}>&amp; {coHostName}</span> : ''}
          </h1>

          <p
            className="text-sm sm:text-base italic max-w-lg mx-auto mb-8"
            style={{ color: config.colors.accentText }}
          >
            "{tagline}"
          </p>

          {/* Date & Main Venue Card */}
          <div
            className="border rounded-xl p-5 max-w-lg mx-auto shadow-xl"
            style={{
              backgroundColor: config.colors.cardBg,
              borderColor: config.colors.cardBorder,
            }}
          >
            <p
              className="text-sm sm:text-base mb-1 font-medium"
              style={{
                fontFamily: config.fonts.heading,
                color: config.colors.primaryText,
              }}
            >
              📅 {format(targetDate, 'EEEE, MMMM d, yyyy')}
            </p>
            <p className="text-xs font-sans" style={{ color: config.colors.mutedText }}>
              📍 {mainEvent.venue} {mainEvent.address ? `• ${mainEvent.address}` : ''}
            </p>
          </div>

          {/* Countdown Section */}
          <div className="mt-8">
            <p
              className="text-xs uppercase tracking-widest mb-3 font-sans"
              style={{ color: config.colors.accentText }}
            >
              {config.countdownLabel}
            </p>
            <div className="flex justify-center gap-2.5 sm:gap-4 font-mono">
              <div
                className="w-16 sm:w-20 py-2.5 rounded-lg border text-center"
                style={{
                  backgroundColor: config.colors.cardBg,
                  borderColor: config.colors.cardBorder,
                }}
              >
                <span
                  className="block text-xl sm:text-2xl font-bold"
                  style={{ color: config.colors.accentText }}
                >
                  {timeLeft.days}
                </span>
                <span
                  className="text-[10px] uppercase font-sans"
                  style={{ color: config.colors.mutedText }}
                >
                  Days
                </span>
              </div>
              <div
                className="w-16 sm:w-20 py-2.5 rounded-lg border text-center"
                style={{
                  backgroundColor: config.colors.cardBg,
                  borderColor: config.colors.cardBorder,
                }}
              >
                <span
                  className="block text-xl sm:text-2xl font-bold"
                  style={{ color: config.colors.accentText }}
                >
                  {timeLeft.hours}
                </span>
                <span
                  className="text-[10px] uppercase font-sans"
                  style={{ color: config.colors.mutedText }}
                >
                  Hours
                </span>
              </div>
              <div
                className="w-16 sm:w-20 py-2.5 rounded-lg border text-center"
                style={{
                  backgroundColor: config.colors.cardBg,
                  borderColor: config.colors.cardBorder,
                }}
              >
                <span
                  className="block text-xl sm:text-2xl font-bold"
                  style={{ color: config.colors.accentText }}
                >
                  {timeLeft.minutes}
                </span>
                <span
                  className="text-[10px] uppercase font-sans"
                  style={{ color: config.colors.mutedText }}
                >
                  Mins
                </span>
              </div>
              <div
                className="w-16 sm:w-20 py-2.5 rounded-lg border text-center"
                style={{
                  backgroundColor: config.colors.cardBg,
                  borderColor: config.colors.cardBorder,
                }}
              >
                <span
                  className="block text-xl sm:text-2xl font-bold"
                  style={{ color: config.colors.accentText }}
                >
                  {timeLeft.seconds}
                </span>
                <span
                  className="text-[10px] uppercase font-sans"
                  style={{ color: config.colors.mutedText }}
                >
                  Secs
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* WELCOME / BLESSING MESSAGE */}
        <section className="py-6 px-4 max-w-2xl mx-auto">
          <div
            className="border-l-4 p-6 rounded-r-xl"
            style={{
              backgroundColor: config.colors.cardBg,
              borderColor: config.colors.accentText,
            }}
          >
            <h3
              className="text-xs uppercase tracking-[0.2em] font-sans font-semibold mb-2"
              style={{ color: config.colors.accentText }}
            >
              {config.messageHeading}
            </h3>
            <p
              className="text-sm sm:text-base leading-relaxed italic"
              style={{ color: config.colors.primaryText }}
            >
              {message}
            </p>
          </div>
        </section>

        {/* SCHEDULE OF EVENTS */}
        <section className="py-8 px-4 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span
              className="text-xs uppercase tracking-[0.25em] font-sans"
              style={{ color: config.colors.accentText }}
            >
              Itinerary &amp; Timeline
            </span>
            <h2
              className="text-2xl sm:text-3xl mt-1"
              style={{
                fontFamily: config.fonts.heading,
                color: config.colors.primaryText,
              }}
            >
              Celebration Program
            </h2>
          </div>

          <div className="space-y-5">
            {events.map((event: any, idx: number) => (
              <div
                key={event.key || idx}
                className="border rounded-xl p-6 shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{
                  backgroundColor: config.colors.cardBg,
                  borderColor: config.colors.cardBorder,
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: config.colors.accentText,
                        color: config.colors.buttonText,
                      }}
                    >
                      {event.time || '12:00 PM'}
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: config.colors.mutedText }}
                    >
                      {event.date}
                    </span>
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-medium"
                    style={{
                      fontFamily: config.fonts.heading,
                      color: config.colors.primaryText,
                    }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="text-xs font-sans mt-0.5"
                    style={{ color: config.colors.accentText }}
                  >
                    📍 {event.venue} {event.address ? `• ${event.address}` : ''}
                  </p>
                  {event.description && (
                    <p
                      className="text-xs mt-2 leading-relaxed"
                      style={{ color: config.colors.mutedText }}
                    >
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 md:pt-0">
                  {event.address && (
                    <button
                      onClick={() => copyAddress(event.key, `${event.venue}, ${event.address}`)}
                      className="px-3 py-1.5 rounded-lg border text-xs font-sans transition-colors cursor-pointer"
                      style={{
                        borderColor: config.colors.cardBorder,
                        color: config.colors.accentText,
                      }}
                    >
                      {copiedKey === event.key ? 'Copied ✓' : 'Copy Venue'}
                    </button>
                  )}
                  <a
                    href={event.mapUrl || 'https://maps.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors"
                    style={{
                      backgroundColor: config.colors.accentText,
                      color: config.colors.buttonText,
                    }}
                  >
                    View Map
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OCCASION RSVP SECTION */}
        <section className="py-8 px-4 max-w-xl mx-auto">
          <div
            className="border-2 rounded-2xl p-6 sm:p-8 text-center shadow-2xl"
            style={{
              backgroundColor: config.colors.cardBg,
              borderColor: config.colors.sealBorder,
            }}
          >
            <h2
              className="text-xl sm:text-2xl mb-1"
              style={{
                fontFamily: config.fonts.heading,
                color: config.colors.primaryText,
              }}
            >
              RSVP &amp; Guest Registry
            </h2>
            <p className="text-xs font-sans mb-6" style={{ color: config.colors.mutedText }}>
              Kindly confirm your presence so we may welcome you with full preparations
            </p>

            {rsvpSent ? (
              <div
                className="p-4 rounded-xl border text-sm"
                style={{
                  backgroundColor: config.colors.bg,
                  borderColor: config.colors.sealBorder,
                  color: config.colors.accentText,
                }}
              >
                ✨ Response recorded with gratitude! We look forward to celebrating together.
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
                  <label
                    className="block text-xs uppercase tracking-wider mb-1 font-sans"
                    style={{ color: config.colors.accentText }}
                  >
                    Guest / Family Name
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none"
                    style={{
                      backgroundColor: config.colors.bg,
                      borderColor: config.colors.cardBorder,
                      color: config.colors.primaryText,
                    }}
                  />
                </div>

                {config.rsvpType === 'dietary' && (
                  <div>
                    <label
                      className="block text-xs uppercase tracking-wider mb-1 font-sans"
                      style={{ color: config.colors.accentText }}
                    >
                      Dietary Preferences
                    </label>
                    <select
                      value={rsvpOption}
                      onChange={(e) => setRsvpOption(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none"
                      style={{
                        backgroundColor: config.colors.bg,
                        borderColor: config.colors.cardBorder,
                        color: config.colors.primaryText,
                      }}
                    >
                      <option value="Vegetarian">Pure Vegetarian Feast</option>
                      <option value="Jain">Jain Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian Tasting Menu</option>
                      <option value="Vegan">Vegan / Gluten-Free</option>
                    </select>
                  </div>
                )}

                {config.rsvpType === 'branch' && (
                  <div>
                    <label
                      className="block text-xs uppercase tracking-wider mb-1 font-sans"
                      style={{ color: config.colors.accentText }}
                    >
                      Number of Family Members Attending
                    </label>
                    <select
                      value={rsvpOption}
                      onChange={(e) => setRsvpOption(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none"
                      style={{
                        backgroundColor: config.colors.bg,
                        borderColor: config.colors.cardBorder,
                        color: config.colors.primaryText,
                      }}
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons</option>
                      <option value="4">4 Persons (Family)</option>
                      <option value="6+">6+ Persons (Branch)</option>
                    </select>
                  </div>
                )}

                {config.rsvpType === 'vip' && (
                  <div>
                    <label
                      className="block text-xs uppercase tracking-wider mb-1 font-sans"
                      style={{ color: config.colors.accentText }}
                    >
                      VIP Table Seating
                    </label>
                    <select
                      value={rsvpOption}
                      onChange={(e) => setRsvpOption(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none"
                      style={{
                        backgroundColor: config.colors.bg,
                        borderColor: config.colors.cardBorder,
                        color: config.colors.primaryText,
                      }}
                    >
                      <option value="Reserved Table">Reserved Table Seating</option>
                      <option value="Balcony Lounge">Balcony Lounge Admission</option>
                      <option value="Standard Table">Standard Banquet Table</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 transition cursor-pointer shadow-md"
                  style={{
                    background: config.colors.buttonGradient,
                    color: config.colors.buttonText,
                  }}
                >
                  Confirm Celebration RSVP
                </button>
              </form>
            )}
          </div>
        </section>

        {/* CLOSING SECTION */}
        <footer className="text-center pt-8 pb-4 text-xs font-serif">
          <p
            className="text-sm mb-1 font-medium"
            style={{ color: config.colors.accentText }}
          >
            {config.closingQuote}
          </p>
          <p style={{ color: config.colors.mutedText }}>
            {config.closingSub || `${hostName} Celebrations`}
          </p>
        </footer>
      </div>
    );
  };
}

