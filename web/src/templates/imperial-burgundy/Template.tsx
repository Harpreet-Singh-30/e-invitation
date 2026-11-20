import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/600.css';
import './styles/template.css';
import royalEvening from './assets/royal-evening.wav';
import type { TemplateData, TemplateEvent } from './types';

export type { TemplateData, TemplateEvent } from './types';

/* ---------- local music registry (add tracks here) ---------- */
const TRACKS: Record<string, string> = { 'royal-evening': royalEvening };

/* ---------- helpers ---------- */
function parseTime(t?: string): { h: number; m: number } | null {
  if (!t) return null;
  const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const ap = m[3]?.toLowerCase();
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  return { h, m: min };
}
function eventDate(e: TemplateEvent): Date | null {
  const raw = e.eventDate || (e as any).date;
  if (!raw) return null;
  if (raw instanceof Date) return isNaN(raw.getTime()) ? null : raw;

  // If already full ISO string or contains timestamp
  const d = new Date(raw);
  if (!isNaN(d.getTime()) && String(raw).length > 10) return d;

  const cleanDateStr = typeof raw === 'string' ? raw.split('T')[0] : '';
  if (cleanDateStr) {
    const parts = cleanDateStr.includes('-')
      ? cleanDateStr.split('-').map(Number)
      : cleanDateStr.split('/').map(Number);
    if (parts.length === 3 && !parts.some(Number.isNaN)) {
      const year = parts[0] > 1000 ? parts[0] : parts[2];
      const month = parts[0] > 1000 ? parts[1] - 1 : parts[0] - 1;
      const day = parts[0] > 1000 ? parts[2] : parts[1];
      const t = parseTime(e.startTime) ?? { h: 0, m: 0 };
      return new Date(year, month, day, t.h, t.m, 0);
    }
  }

  return !isNaN(d.getTime()) ? d : null;
}
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-IN', o).format(d);
const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');
const initial = (s: string) => (s.trim()[0] ?? '').toUpperCase();

function useReducedMotion(): boolean {
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setR(q.matches);
    q.addEventListener('change', f);
    return () => q.removeEventListener('change', f);
  }, []);
  return r;
}

/* ---------- SVG ornaments ---------- */
function Mandala({ className }: { className?: string }) {
  const ring = (n: number, r: number, len: number, w: number) =>
    Array.from({ length: n }, (_, i) => (
      <path key={`${n}-${i}`} transform={`rotate(${(360 / n) * i} 200 200)`}
        d={`M200 ${200 - r} Q${200 + w} ${200 - r - len / 2} 200 ${200 - r - len} Q${200 - w} ${200 - r - len / 2} 200 ${200 - r}Z`} />
    ));
  return (
    <svg className={className} viewBox="0 0 400 400" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="200" cy="200" r="196" strokeDasharray="1 5" />
      <circle cx="200" cy="200" r="186" />
      <g>{ring(32, 140, 46, 9)}</g>
      <g>{ring(16, 100, 62, 18)}</g>
      <g>{ring(8, 56, 56, 22)}</g>
      <circle cx="200" cy="200" r="141" />
      <circle cx="200" cy="200" r="101" />
      <circle cx="200" cy="200" r="30" />
      {Array.from({ length: 32 }, (_, i) => (
        <circle key={i} cx={200 + 168 * Math.sin((i * Math.PI) / 16)} cy={200 - 168 * Math.cos((i * Math.PI) / 16)} r="2.2" fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M4 116 V30 Q4 4 30 4 H116" />
      <path d="M14 116 V34 Q14 14 34 14 H116" strokeOpacity=".5" />
      <path d="M26 26 q18 2 24 20 q-18 4 -24 -20z M26 26 q2 18 20 24 q4 -18 -20 -24z" />
      <circle cx="26" cy="26" r="3" fill="currentColor" />
      <path d="M60 14 q6 10 0 18 q-6 -8 0 -18z M14 60 q10 6 18 0 q-8 -6 -18 0z" />
    </svg>
  );
}

function Divider() {
  return (
    <svg className="ib-divider" viewBox="0 0 240 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M0 12 H96 M144 12 H240" />
      <path d="M120 2 q8 8 0 20 q-8 -12 0 -20z M108 12 q6 -6 12 0 q-6 6 -12 0z M132 12 q-6 -6 -12 0 q6 6 12 0z" />
      <circle cx="100" cy="12" r="1.8" fill="currentColor" />
      <circle cx="140" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}

function Seal({ initials, className }: { initials: string; className?: string }) {
  return (
    <div className={`ib-seal ${className ?? ''}`} aria-hidden="true">
      <Mandala className="ib-seal-mandala" />
      <div className="ib-seal-core"><span>{initials}</span></div>
    </div>
  );
}

function Section({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`ib-section ${className ?? ''}`}>{children}</section>;
}

/* ---------- Intro ---------- */
function Intro({ data, onDone, reduce }: { data: TemplateData; onDone: () => void; reduce: boolean }) {
  const [opening, setOpening] = useState(false);
  const open = () => {
    if (reduce) return onDone();
    setOpening(true);
    window.setTimeout(onDone, 1700);
  };
  const { groom, bride } = data.couple;
  const hasBoth = Boolean(groom && bride);
  const displayName = hasBoth ? `${groom} & ${bride}` : (groom || bride);
  const initials = hasBoth ? `${initial(groom)}${initial(bride)}` : initial(groom || bride || 'C');
  const occasionScript = data.occasionType ? `${data.occasionType.replace('_', ' ')} celebration` : 'Together with their families';
  return (
    <div className={`ib-intro ${opening ? 'is-opening' : ''}`} role="dialog" aria-label="Invitation cover">
      <div className="ib-door ib-door-l" /><div className="ib-door ib-door-r" />
      <Corner className="ib-intro-corner c1" /><Corner className="ib-intro-corner c2" />
      <Corner className="ib-intro-corner c3" /><Corner className="ib-intro-corner c4" />
      <div className="ib-intro-body">
        <p className="ib-script capitalize">{occasionScript}</p>
        <Seal initials={initials} />
        <h1 className="ib-intro-names">
          {hasBoth ? (
            <>
              {groom} <i>&amp;</i> {bride}
            </>
          ) : (
            <span>{displayName}</span>
          )}
        </h1>
        <button className="ib-btn" onClick={open} autoFocus>Open invitation</button>
        <button className="ib-skip" onClick={onDone}>Skip intro</button>
      </div>
    </div>
  );
}

/* ---------- Main ---------- */
export default function ImperialBurgundyTemplate({ data }: { data: TemplateData }) {
  const reduce = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { groom, bride, tagline } = data.couple;
  const hasBoth = Boolean(groom && bride);
  const displayName = hasBoth ? `${groom} & ${bride}` : (groom || bride);
  const initials = hasBoth ? `${initial(groom)}${initial(bride)}` : initial(groom || bride || 'C');
  const occasionScript = data.occasionType ? `${data.occasionType.replace('_', ' ')} celebration` : 'Together with their families';

  const events = useMemo(() => {
    return data.events
      .filter((e) => e && e.name)
      .map((e) => ({ e, d: eventDate(e) }))
      .sort((a, b) => (a.d?.getTime() ?? Infinity) - (b.d?.getTime() ?? Infinity));
  }, [data.events]);

  const target = useMemo(() => events.find((x) => x.d && x.d.getTime() > now)?.d ?? null, [events, now]);
  const targetName = events.find((x) => x.d === target)?.e.name;
  const firstDate = events.find((x) => x.d)?.d ?? null;
  const lastDate = [...events].reverse().find((x) => x.d)?.d ?? null;

  const venues = useMemo(() => {
    const map = new Map<string, { name?: string; address: string; link?: string; events: string[] }>();
    events.forEach(({ e }) => {
      if (!e.venueAddress) return;
      const k = e.venueAddress.trim().toLowerCase();
      const v = map.get(k) ?? { name: e.venueName, address: e.venueAddress, link: e.mapLink, events: [] };
      v.events.push(e.name);
      map.set(k, v);
    });
    return [...map.values()];
  }, [events]);

  const paragraphs = (data.message ?? '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  const gallery = data.gallery?.filter((g) => g.url) ?? [];
  const trackSrc = data.music?.enabled && data.music?.trackId ? TRACKS[data.music.trackId] ?? (/^(https?:)?\/\/|^\//.test(data.music.trackId) ? data.music.trackId : undefined) : undefined;

  useEffect(() => {
    if (!target) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [target]);

  /* scroll reveal */
  useEffect(() => {
    if (!entered || !rootRef.current) return;
    const isInsidePreview = typeof window !== 'undefined' && (
      window.location.pathname.includes('/edit') ||
      document.body.classList.contains('mobile-preview-body') ||
      Boolean(rootRef.current.closest('.template-preview-container'))
    );
    const els = rootRef.current.querySelectorAll('.ib-reveal');
    if (reduce || isInsidePreview) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((x) => {
        if (x.isIntersecting) {
          x.target.classList.add('is-in');
          io.unobserve(x.target);
        }
      }),
      { threshold: 0.05, rootMargin: '50px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [entered, reduce, events]);

  /* lightbox keys */
  useEffect(() => {
    if (lightbox === null) return;
    const k = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setLightbox(null);
      if (ev.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % gallery.length));
      if (ev.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [lightbox, gallery.length]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const toggleMusic = useCallback(() => {
    if (!trackSrc) return;
    if (!audioRef.current) { audioRef.current = new Audio(trackSrc); audioRef.current.loop = true; audioRef.current.volume = 0.5; }
    const a = audioRef.current;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { a.pause(); setPlaying(false); }
  }, [trackSrc]);

  const go = (id: string) => rootRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    }
    setCopied(text); window.setTimeout(() => setCopied(null), 2000);
  };

  const diff = target ? Math.max(0, target.getTime() - now) : 0;
  const cd = [
    ['Days', Math.floor(diff / 864e5)], ['Hours', Math.floor(diff / 36e5) % 24],
    ['Minutes', Math.floor(diff / 6e4) % 60], ['Seconds', Math.floor(diff / 1e3) % 60],
  ] as const;

  const nav = [
    ['hero', 'Home', true], ['welcome', 'Welcome', paragraphs.length > 0], ['couple', 'Couple', !!data.story],
    ['countdown', 'Countdown', !!target], ['itinerary', 'Events', events.length > 0],
    ['venue', 'Venue', venues.length > 0], ['gallery', 'Gallery', gallery.length > 0],
  ].filter((n) => n[2]) as [string, string, boolean][];

  const dateRange = firstDate && lastDate
    ? firstDate.toDateString() === lastDate.toDateString()
      ? fmt(firstDate, { day: 'numeric', month: 'long', year: 'numeric' })
      : `${fmt(firstDate, { day: 'numeric', month: 'long' })} – ${fmt(lastDate, { day: 'numeric', month: 'long', year: 'numeric' })}`
    : null;

  return (
    <div className="ih-imperial-burgundy" ref={rootRef} data-motion={reduce ? 'reduced' : 'full'} data-entered={entered ? 'true' : undefined}>
      {!entered && <Intro data={data} reduce={reduce} onDone={() => setEntered(true)} />}
      {entered && (
        <main className="ib-main">
          <Section id="hero" className="ib-hero">
            <Corner className="ib-corner tl" /><Corner className="ib-corner tr" />
            <div className="ib-hero-copy">
              <p className="ib-script capitalize">{occasionScript}</p>
              <h1 className="ib-names">
                {hasBoth ? (
                  <>
                    <span>{groom}</span><i>&amp;</i><span>{bride}</span>
                  </>
                ) : (
                  <span>{displayName}</span>
                )}
              </h1>
              <Divider />
              {dateRange && <p className="ib-hero-date">{dateRange}</p>}
              {tagline && <p className="ib-tagline">{tagline}</p>}
              <button className="ib-btn ghost" onClick={() => go(paragraphs.length ? 'welcome' : 'itinerary')}>View invitation</button>
            </div>
            <figure className="ib-arch-wrap">
              <Mandala className="ib-arch-mandala" />
              <div className="ib-arch">
                {data.heroImageUrl
                  ? <img src={data.heroImageUrl} alt={`${groom} and ${bride}`} />
                  : <Seal initials={initials} className="in-arch" />}
              </div>
            </figure>
          </Section>

          {paragraphs.length > 0 && (
            <Section id="welcome" className="ib-welcome">
              <div className="ib-card ib-reveal">
                <Corner className="ib-corner tl" /><Corner className="ib-corner br" />
                <h2 className="ib-h">You are invited</h2>
                <Divider />
                {paragraphs.map((p, i) => <p key={i} className={i === 0 ? 'ib-script big' : 'ib-msg'}>{p}</p>)}
              </div>
            </Section>
          )}

          {data.story && (
            <Section id="couple" className="ib-couple">
              <div className="ib-couple-grid ib-reveal">
                <div className="ib-pair">
                  {hasBoth ? (
                    <>
                      <span>{groom}</span><Seal initials={initials} /><span>{bride}</span>
                    </>
                  ) : (
                    <span>{displayName}</span>
                  )}
                </div>
                <div>
                  <h2 className="ib-h left">Our story</h2>
                  <p className="ib-story">{data.story}</p>
                </div>
              </div>
            </Section>
          )}

          {target && (
            <Section id="countdown" className="ib-countdown">
              <h2 className="ib-h ib-reveal">Until {targetName}</h2>
              <div className="ib-count ib-reveal" role="timer" aria-label={`Time until ${targetName}`}>
                {cd.map(([l, v]) => (
                  <div key={l} className="ib-count-cell"><b>{pad(v)}</b><small>{l}</small></div>
                ))}
              </div>
            </Section>
          )}

          {events.length > 0 && (
            <Section id="itinerary" data-section="events" className="ib-events">
              <h2 className="ib-h ib-reveal">The celebrations</h2>
              <Divider />
              <ol className="ib-timeline">
                {events.map(({ e, d }, i) => (
                  <li key={`${e.key}-${i}`} className="ib-event ib-reveal" style={{ '--i': i % 3 } as CSSProperties}>
                    <div className="ib-stamp">
                      {d ? (<><b>{d.getDate()}</b><span>{fmt(d, { month: 'short' })}</span><small>{fmt(d, { weekday: 'short' })}</small></>) : <b>{e.name[0]}</b>}
                    </div>
                    <div className="ib-event-body">
                      <h3>{e.name}</h3>
                      {e.title && <p className="ib-event-title">{e.title}</p>}
                      <p className="ib-meta">{[e.startTime, e.venueName].filter(Boolean).join('  ·  ')}</p>
                      {e.description && <p className="ib-event-desc">{e.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {venues.length > 0 && (
            <Section id="venue" className="ib-venue">
              <h2 className="ib-h ib-reveal">{venues.length > 1 ? 'Venues' : 'The venue'}</h2>
              <Divider />
              <div className="ib-venues">
                {venues.map((v) => (
                  <div className="ib-card ib-reveal" key={v.address}>
                    <Corner className="ib-corner tl" /><Corner className="ib-corner br" />
                    {v.name && <h3 className="ib-venue-name">{v.name}</h3>}
                    <p className="ib-address">{v.address}</p>
                    <p className="ib-meta">{v.events.join(', ')}</p>
                    <div className="ib-actions">
                      <a className="ib-btn" target="_blank" rel="noopener noreferrer"
                        href={v.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name ?? ''} ${v.address}`.trim())}`}>Get directions</a>
                      <button className="ib-btn ghost" onClick={() => copy(v.address)} aria-live="polite">{copied === v.address ? 'Address copied' : 'Copy address'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {gallery.length > 0 && (
            <Section id="gallery" className="ib-gallery">
              <h2 className="ib-h ib-reveal">Gallery</h2>
              <Divider />
              <div className="ib-grid">
                {gallery.map((g, i) => (
                  <button key={g.url + i} className={`ib-frame f${i % 4} ib-reveal`} onClick={() => setLightbox(i)} aria-label={`Open photo ${i + 1}${g.alt ? `: ${g.alt}` : ''}`}>
                    <img src={g.url} alt={g.alt ?? ''} loading="lazy" />
                  </button>
                ))}
              </div>
            </Section>
          )}

          <Section id="closing" className="ib-closing">
            <Seal initials={initials} className="ib-reveal" />
            <h2 className="ib-closing-names ib-reveal">
              {hasBoth ? (
                <>
                  {groom} <i>&amp;</i> {bride}
                </>
              ) : (
                <span>{displayName}</span>
              )}
            </h2>
            <p className="ib-script big ib-reveal">With love and gratitude, we look forward to celebrating with you.</p>
            <Divider />
          </Section>

          <nav className="ib-nav" aria-label="Sections">
            {nav.map(([id, label]) => <button key={id} onClick={() => go(id)}>{label}</button>)}
          </nav>

          {trackSrc && (
            <button className={`ib-music ${playing ? 'on' : ''}`} onClick={toggleMusic} aria-pressed={playing} aria-label={playing ? 'Pause music' : 'Play music'}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {playing ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <path d="M8 5v14l11-7z" />}
              </svg>
            </button>
          )}

          {lightbox !== null && gallery[lightbox] && (
            <div className="ib-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLightbox(null)}>
              <button className="ib-lb-close" aria-label="Close" onClick={() => setLightbox(null)}>×</button>
              <button className="ib-lb-nav prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length); }}>‹</button>
              <img src={gallery[lightbox].url} alt={gallery[lightbox].alt ?? ''} onClick={(e) => e.stopPropagation()} />
              <button className="ib-lb-nav next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }}>›</button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
