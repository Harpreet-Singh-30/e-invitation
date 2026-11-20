import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/300-italic.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/jost/300.css';
import '@fontsource/jost/400.css';
import './styles.css';
import type { TemplateData, TemplateEvent, TemplateMusic } from './types';
import { Frond, Monogram, Pearl, PearlStrand, ShellFan, Sprig, Waves } from './Ornaments';
import heroFallback from './assets/hero.svg';
import storyFallback from './assets/story.svg';
import venueFallback from './assets/venue.svg';

export type { TemplateData } from './types';

/* ---------- helpers ---------- */

const clean = (s?: string) => (s ?? '').trim();

function parseDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s ?? '');
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseTime(t?: string): { h: number; m: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(clean(t));
  return m ? { h: Number(m[1]), m: Number(m[2]) } : null;
}

function fmtTime(t?: string): string {
  const raw = clean(t);
  const p = parseTime(raw);
  if (!p) return raw;
  const h12 = p.h % 12 || 12;
  return `${h12}:${String(p.m).padStart(2, '0')} ${p.h < 12 ? 'AM' : 'PM'}`;
}

const longDate = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const heroDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

function startOf(e: TemplateEvent): Date | null {
  const d = parseDate(e.eventDate);
  if (!d) return null;
  const t = parseTime(e.startTime);
  if (t) d.setHours(t.h, t.m, 0, 0);
  return d;
}

function paragraphs(s?: string): string[] {
  return clean(s)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function directionsUrl(e: TemplateEvent): string | null {
  if (clean(e.mapLink)) return clean(e.mapLink);
  const q = [clean(e.venueName), clean(e.venueAddress)].filter(Boolean).join(', ');
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null;
}

function normMusic(m: TemplateData['music']): TemplateMusic | null {
  if (!m) return null;
  const mm = typeof m === 'string' ? { url: m } : m;
  return clean(mm.url) ? mm : null;
}

function useCountdown(target: Date | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);
  if (!target) return null;
  const diff = target.getTime() - now;
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

const pad = (n: number) => String(n).padStart(2, '0');

/* ---------- component ---------- */

export function CoastalPearlTemplate({ data }: { data: TemplateData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const bride = clean(data.couple?.bride);
  const groom = clean(data.couple?.groom);
  const tagline = clean(data.couple?.tagline);
  const hasCouple = Boolean(bride && groom);
  const validNames = [bride, groom].filter(Boolean);
  const initials = validNames.map((n) => n.charAt(0).toUpperCase());
  const occasionLabel = (data as any)?.occasionType
    ? `${(data as any).occasionType.replace('_', ' ')} invitation`
    : hasCouple
    ? 'Wedding invitation'
    : 'Celebration invitation';

  const events = useMemo(
    () =>
      (data.events ?? [])
        .filter((e) => parseDate(e.eventDate))
        .slice()
        .sort((a, b) => (startOf(a)?.getTime() ?? 0) - (startOf(b)?.getTime() ?? 0)),
    [data.events],
  );
  const firstEvent = events[0];
  const firstDate = firstEvent ? parseDate(firstEvent.eventDate) : null;
  const countdown = useCountdown(firstEvent ? startOf(firstEvent) : null);

  const welcome = paragraphs(data.message);
  const storyParas = paragraphs(data.story?.body);
  const gallery = (data.gallery ?? []).filter((g) => clean(g.src));
  const music = normMusic(data.music);

  const venues = useMemo(() => {
    const seen = new Set<string>();
    return events.filter((e) => {
      if (!clean(e.venueName) && !clean(e.venueAddress)) return false;
      const k = `${clean(e.venueName)}|${clean(e.venueAddress)}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [events]);

  const grouped = useMemo(() => {
    const map = new Map<string, TemplateEvent[]>();
    events.forEach((e) => map.set(e.eventDate, [...(map.get(e.eventDate) ?? []), e]));
    return [...map.entries()];
  }, [events]);

  /* opening animation */
  const isThumb = Boolean((data as any)?._isThumbnail);
  const reduced = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const introWanted = !isThumb && data.options?.intro !== false;
  const [intro, setIntro] = useState<'play' | 'leave' | 'done'>(introWanted ? 'play' : 'done');
  useEffect(() => {
    if (!introWanted) return;
    const a = window.setTimeout(() => setIntro('leave'), reduced ? 500 : 3600);
    const b = window.setTimeout(() => setIntro('done'), reduced ? 900 : 4700);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [introWanted, reduced]);

  /* nav */
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const sections = [
    welcome.length ? { id: 'welcome', label: 'Welcome' } : null,
    storyParas.length ? { id: 'story', label: 'Our Story' } : null,
    countdown ? { id: 'countdown', label: 'Countdown' } : null,
    events.length ? { id: 'itinerary', label: 'Celebrations' } : null,
    venues.length ? { id: 'venue', label: 'Venue' } : null,
    gallery.length ? { id: 'gallery', label: 'Gallery' } : null,
  ].filter((s): s is { id: string; label: string } => !!s);

  const goTo = useCallback((id: string) => {
    setMenuOpen(false);
    const el = rootRef.current?.querySelector<HTMLElement>(`#ih-cp-${id}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (id === 'hero' ? 0 : 56);
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  /* reveal on scroll */
  const [jsReady, setJsReady] = useState(false);
  useEffect(() => {
    setJsReady(true);
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  /* music — click to play only */
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);
  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  /* copy address */
  const [copied, setCopied] = useState<string | null>(null);
  const copyAddress = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(key);
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 2200);
  };

  /* lightbox */
  const [lb, setLb] = useState<number | null>(null);
  useEffect(() => {
    if (lb === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLb(null);
      if (e.key === 'ArrowRight') setLb((i) => (i === null ? i : (i + 1) % gallery.length));
      if (e.key === 'ArrowLeft') setLb((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lb, gallery.length]);
  const touchX = useRef<number | null>(null);

  const heroImg = clean(data.heroImage) || heroFallback;
  const place = venues[0] ? clean(venues[0].venueName) : '';

  return (
    <div ref={rootRef} className={`ih-coastal-pearl${jsReady ? ' ih-js' : ''}${intro !== 'done' ? ' ih-intro-active' : ''}`}>
      {/* 1 — animated opening */}
      {intro !== 'done' && (
        <div className={`ih-intro ih-intro--${intro}`} role="presentation" onClick={() => setIntro('leave')}>
          <Waves tone="ivory" className="ih-intro__waves" />
          <svg className="ih-intro__lines" viewBox="0 0 400 120" aria-hidden="true" fill="none" stroke="var(--ih-champagne)" strokeLinecap="round">
            <path pathLength="1" d="M10 60 Q60 20 110 60 T210 60 T310 60 T390 60" />
            <path pathLength="1" d="M30 78 Q80 44 130 78 T230 78 T330 78 T380 78" />
            <path pathLength="1" d="M60 42 Q110 12 160 42 T260 42 T360 42" />
          </svg>
          <div className="ih-intro__core">
            <Pearl size={64} className="ih-intro__pearl" />
            <p className="ih-intro__names">
              {hasCouple ? (
                <>
                  {bride} <em>&amp;</em> {groom}
                </>
              ) : (
                <span>{groom || bride}</span>
              )}
            </p>
            <p className="ih-intro__sub capitalize">{occasionLabel}</p>
          </div>
        </div>
      )}

      {/* navigation */}
      <header className={`ih-nav${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}>
        <button className="ih-nav__brand" onClick={() => goTo('hero')} aria-label="Back to top">
          {hasCouple ? (
            <>
              {initials[0]} <span>&amp;</span> {initials[1]}
            </>
          ) : (
            <span>{initials[0] || 'C'}</span>
          )}
        </button>
        {sections.length > 0 && (
          <nav className="ih-nav__links" aria-label="Sections">
            {sections.map((s) => (
              <button key={s.id} onClick={() => goTo(s.id)}>
                {s.label}
              </button>
            ))}
          </nav>
        )}
        {sections.length > 0 && (
          <button className="ih-nav__menu" aria-expanded={menuOpen} aria-label="Menu" onClick={() => setMenuOpen((o) => !o)}>
            <span />
            <span />
          </button>
        )}
        {menuOpen && (
          <div className="ih-nav__sheet">
            {sections.map((s) => (
              <button key={s.id} onClick={() => goTo(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main>
        {/* 2 — hero */}
        <section id="ih-cp-hero" className="ih-hero">
          <div className="ih-hero__media">
            <img src={heroImg} alt="" />
            <div className="ih-hero__veil" />
          </div>
          <Frond className="ih-hero__frond ih-hero__frond--l" />
          <Frond className="ih-hero__frond ih-hero__frond--r" />
          <div className="ih-hero__content">
            <p className="ih-eyebrow ih-hero__eyebrow capitalize">{occasionLabel}</p>
            <h1 className="ih-names">
              {hasCouple ? (
                <>
                  <span>{bride}</span>
                  <em>&amp;</em>
                  <span>{groom}</span>
                </>
              ) : (
                <span>{groom || bride || 'Celebration'}</span>
              )}
            </h1>
            {tagline && <p className="ih-hero__tagline">{tagline}</p>}
            {(firstDate || place) && (
              <div className="ih-hero__meta">
                {firstDate && <span>{heroDate(firstDate)}</span>}
                {firstDate && place && <Pearl size={14} />}
                {place && <span>{place}</span>}
              </div>
            )}
          </div>
          <button className="ih-hero__cue" onClick={() => goTo(sections[0]?.id ?? 'hero')} aria-label="Scroll down" hidden={!sections.length}>
            <span />
          </button>
          <Waves tone="ivory" className="ih-hero__waves" />
        </section>

        {/* 3 — welcome */}
        {welcome.length > 0 && (
          <section id="ih-cp-welcome" className="ih-section ih-welcome ih-pattern--light">
            <div className="ih-welcome__card" data-reveal>
              <ShellFan className="ih-welcome__fan" />
              <p className="ih-eyebrow">You are invited</p>
              <div className="ih-welcome__text">
                {welcome.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="ih-signoff">
                <PearlStrand count={7} />
                <p className="ih-script">
                  {hasCouple ? (
                    <>
                      {bride} <em>&amp;</em> {groom}
                    </>
                  ) : (
                    <span>{groom || bride}</span>
                  )}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 4 — story */}
        {storyParas.length > 0 && (
          <section id="ih-cp-story" className="ih-section ih-story">
            <div className="ih-story__grid">
              <div className="ih-story__media" data-reveal>
                <div className="ih-arch">
                  <img src={clean(data.story?.image) || storyFallback} alt="" loading="lazy" />
                </div>
                <Sprig className="ih-story__sprig" />
              </div>
              <div className="ih-story__copy" data-reveal style={{ ['--d' as string]: '120ms' }}>
                <p className="ih-eyebrow">Our story</p>
                <h2 className="ih-h2">{clean(data.story?.title) || (hasCouple ? `${bride} & ${groom}` : (groom || bride))}</h2>
                {storyParas.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5 — countdown */}
        {countdown && (
          <section id="ih-cp-countdown" className="ih-section ih-countdown ih-pattern--dark">
            <Waves tone="ivory" className="ih-countdown__top" />
            <div className="ih-countdown__inner" data-reveal>
              <p className="ih-eyebrow ih-eyebrow--light">Until we celebrate</p>
              <div className="ih-countdown__grid" role="timer" aria-label="Countdown to celebration">
                {(
                  [
                    ['Days', String(countdown.days)],
                    ['Hours', pad(countdown.hours)],
                    ['Minutes', pad(countdown.minutes)],
                    ['Seconds', pad(countdown.seconds)],
                  ] as const
                ).map(([label, v]) => (
                  <div className="ih-count" key={label}>
                    <span className="ih-count__ring" />
                    <span className="ih-count__n">{v}</span>
                    <span className="ih-count__l">{label}</span>
                  </div>
                ))}
              </div>
              {firstDate && <p className="ih-countdown__date">{longDate(firstDate)}</p>}
            </div>
          </section>
        )}

        {/* 6 — itinerary */}
        {events.length > 0 && (
          <section id="ih-cp-itinerary" className="ih-section ih-itinerary">
            <div className="ih-container">
              <header className="ih-sechead" data-reveal>
                <p className="ih-eyebrow">The celebrations</p>
                <h2 className="ih-h2">Event itinerary</h2>
              </header>
              <div className="ih-timeline">
                {grouped.map(([date, list]) => {
                  const d = parseDate(date)!;
                  return (
                    <div className="ih-day" key={date} data-reveal>
                      <div className="ih-day__date">
                        <span className="ih-day__num">{d.getDate()}</span>
                        <span className="ih-day__mon">{d.toLocaleDateString('en-IN', { month: 'long' })}</span>
                        <span className="ih-day__wk">{d.toLocaleDateString('en-IN', { weekday: 'long' })}</span>
                      </div>
                      <ul className="ih-day__list">
                        {list.map((e, i) => (
                          <li className="ih-event" key={i}>
                            <Pearl size={16} className="ih-event__pearl" />
                            {(clean(e.startTime) || clean(e.endTime)) && (
                              <p className="ih-event__time">
                                {fmtTime(e.startTime)}
                                {clean(e.endTime) ? ` – ${fmtTime(e.endTime)}` : ''}
                              </p>
                            )}
                            <h3 className="ih-event__title">{clean(e.title) || clean(e.venueName) || 'Celebration'}</h3>
                            {clean(e.venueName) && clean(e.title) && <p className="ih-event__venue">{clean(e.venueName)}</p>}
                            {clean(e.description) && <p className="ih-event__desc">{clean(e.description)}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 7 — venue */}
        {venues.length > 0 && (
          <section id="ih-cp-venue" className="ih-section ih-venue">
            <div className="ih-venue__stage" data-reveal>
              <img src={clean(venues[0].venueImage) || venueFallback} alt="" loading="lazy" />
              <div className="ih-venue__shade" />
              <div className="ih-venue__card">
                <p className="ih-eyebrow">The venue</p>
                <h2 className="ih-h2">{clean(venues[0].venueName) || 'Venue'}</h2>
                {clean(venues[0].venueAddress) && <address>{clean(venues[0].venueAddress)}</address>}
                <div className="ih-actions">
                  {directionsUrl(venues[0]) && (
                    <a className="ih-btn ih-btn--solid" href={directionsUrl(venues[0])!} target="_blank" rel="noopener noreferrer">
                      Get directions
                    </a>
                  )}
                  {clean(venues[0].venueAddress) && (
                    <button className="ih-btn" onClick={() => copyAddress('v0', clean(venues[0].venueAddress))}>
                      {copied === 'v0' ? 'Address copied' : 'Copy address'}
                    </button>
                  )}
                </div>
                <span className="ih-sr" role="status" aria-live="polite">
                  {copied ? 'Address copied to clipboard' : ''}
                </span>
              </div>
            </div>
            {venues.length > 1 && (
              <div className="ih-container ih-venue__more">
                {venues.slice(1).map((v, i) => (
                  <div className="ih-venue__mini" key={i} data-reveal>
                    <h3>{clean(v.venueName) || 'Venue'}</h3>
                    {clean(v.venueAddress) && <address>{clean(v.venueAddress)}</address>}
                    <div className="ih-actions">
                      {directionsUrl(v) && (
                        <a className="ih-btn ih-btn--solid" href={directionsUrl(v)!} target="_blank" rel="noopener noreferrer">
                          Directions
                        </a>
                      )}
                      {clean(v.venueAddress) && (
                        <button className="ih-btn" onClick={() => copyAddress(`v${i + 1}`, clean(v.venueAddress))}>
                          {copied === `v${i + 1}` ? 'Copied' : 'Copy address'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 8 — gallery */}
        {gallery.length > 0 && (
          <section id="ih-cp-gallery" className="ih-section ih-gallery">
            <div className="ih-container">
              <header className="ih-sechead" data-reveal>
                <p className="ih-eyebrow">Moments</p>
                <h2 className="ih-h2">Gallery</h2>
              </header>
              <div className="ih-gallery__grid">
                {gallery.map((g, i) => (
                  <button key={i} className="ih-tile" onClick={() => setLb(i)} data-reveal style={{ ['--d' as string]: `${(i % 3) * 90}ms` }} aria-label={`Open photo ${i + 1}${g.alt ? `: ${g.alt}` : ''}`}>
                    <img src={g.src} alt={g.alt ?? ''} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9 — closing */}
        <section id="ih-cp-closing" className="ih-closing">
          <Waves tone="sand" className="ih-closing__waves" />
          <div className="ih-closing__inner" data-reveal>
            <Monogram a={initials[0]} b={initials[1]} />
            <p className="ih-eyebrow">With love &amp; gratitude</p>
            <p className="ih-closing__names">
              {hasCouple ? (
                <>
                  {bride} <em>&amp;</em> {groom}
                </>
              ) : (
                <span>{groom || bride}</span>
              )}
            </p>
            {tagline && <p className="ih-closing__tagline">{tagline}</p>}
            {firstDate && <p className="ih-closing__date">{longDate(firstDate)}</p>}
            <PearlStrand count={9} />
          </div>
        </section>
      </main>

      {/* music */}
      {music && (
        <div className={`ih-music${playing ? ' is-playing' : ''}`}>
          <audio ref={audioRef} src={music.url} loop preload="none" onEnded={() => setPlaying(false)} />
          <button className="ih-music__btn" onClick={toggleMusic} aria-pressed={playing} aria-label={playing ? 'Pause soundtrack' : 'Play soundtrack'}>
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="7" y="6" width="3.4" height="12" rx="1" />
                <rect x="13.6" y="6" width="3.4" height="12" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.8v12.4a.8.8 0 0 0 1.2.7l10-6.2a.8.8 0 0 0 0-1.4l-10-6.2A.8.8 0 0 0 8 5.8z" />
              </svg>
            )}
          </button>
          <span className="ih-music__label">{playing ? clean(music.title) || 'Now playing' : 'Play soundtrack'}</span>
          <input className="ih-music__vol" type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="Volume" />
        </div>
      )}

      {/* lightbox */}
      {lb !== null && gallery[lb] && (
        <div
          className="ih-lb"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setLb(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) setLb((i) => (i === null ? i : (i + (dx < 0 ? 1 : -1) + gallery.length) % gallery.length));
          }}
        >
          <button className="ih-lb__close" aria-label="Close" onClick={() => setLb(null)}>
            <span />
            <span />
          </button>
          {gallery.length > 1 && (
            <button
              className="ih-lb__nav ih-lb__nav--prev"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                setLb((lb - 1 + gallery.length) % gallery.length);
              }}
            />
          )}
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={gallery[lb].src} alt={gallery[lb].alt ?? ''} />
            <figcaption>
              {gallery[lb].alt && <span>{gallery[lb].alt}</span>}
              <small>
                {lb + 1} / {gallery.length}
              </small>
            </figcaption>
          </figure>
          {gallery.length > 1 && (
            <button
              className="ih-lb__nav ih-lb__nav--next"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                setLb((lb + 1) % gallery.length);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default CoastalPearlTemplate;
