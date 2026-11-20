import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { EventItem, TemplateData } from './types';
import { EVENT_TILE, PAL, stitch, tile, uri, type EventStyle } from './patterns';
import './styles.css';

const parseT = (t?: string): [number, number] | null => {
  if (!t) return null;
  const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let h = +m[1]; const mi = +(m[2] || 0); const ap = m[3]?.toLowerCase();
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  return h < 24 && mi < 60 ? [h, mi] : null;
};
const fmtT = (t?: string) => {
  const p = parseT(t); if (!p) return t || '';
  return `${((p[0] + 11) % 12) + 1}:${String(p[1]).padStart(2, '0')} ${p[0] < 12 ? 'am' : 'pm'}`;
};
const toDate = (e: EventItem) => {
  if (!e.eventDate) return null;
  const [y, m, d] = e.eventDate.split('-').map(Number);
  if (!y || !m || !d) return null;
  const t = parseT(e.startTime) || [0, 0];
  return new Date(y, m - 1, d, t[0], t[1]);
};
const longDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const styleOf = (e: EventItem): EventStyle => {
  const n = e.name.toLowerCase();
  if (/mehend|mehnd/.test(n)) return 'mehendi';
  if (/jaggo|jago/.test(n)) return 'jaggo';
  if (/sangeet/.test(n)) return 'sangeet';
  if (/anand|karaj/.test(n)) return 'karaj';
  if (/reception/.test(n)) return 'reception';
  return 'default';
};
const mapsUrl = (e: EventItem) =>
  e.mapLink || (e.venueAddress || e.venueName ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.venueName ?? ''} ${e.venueAddress ?? ''}`.trim())}` : '');
const css = (v: Record<string, string>) => v as CSSProperties;
const T = {
  field: uri(tile('diamond', PAL.fuchsia)),
  rani: uri(tile('flower', PAL.rani)),
  indigo: uri(tile('star', PAL.indigo)),
  stitch: uri(stitch('#D9A629', '#FFF9EF')),
  stitchPink: uri(stitch('#D94B83', '#D9A629')),
};

export function PhulkariCelebrationTemplate({ data }: { data: TemplateData }) {
  const { couple, message, family, music, gallery, heroImage } = data;
  const events = useMemo(
    () => (data.events || []).filter((e) => e && e.name).slice().sort((a, b) => (toDate(a)?.getTime() ?? 9e15) - (toDate(b)?.getTime() ?? 9e15)),
    [data.events]
  );
  const main = events.find((e) => styleOf(e) === 'karaj') || events[0];
  const mainDate = main ? toDate(main) : null;
  const story = Array.isArray(couple.story) ? couple.story : couple.story ? [couple.story] : [];
  const pics = (gallery || []).filter((g) => g && g.src);
  const hasBoth = Boolean(couple.bride && couple.groom);
  const displayName = couple.groom || couple.bride || 'Celebration';
  const initials = (hasBoth
    ? `${couple.bride?.[0] ?? ''}${couple.groom?.[0] ?? ''}`
    : (displayName?.[0] ?? 'P')
  ).toUpperCase();
  const first = (n?: string) => (n || '').split(' ')[0];

  const isThumb = Boolean((data as any)?._isThumbnail);
  const [phase, setPhase] = useState<'sealed' | 'opening' | 'open'>(isThumb ? 'open' : 'sealed');
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [light, setLight] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [venueIdx, setVenueIdx] = useState(0);
  const audio = useRef<HTMLAudioElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isThumb) return;
    if (typeof window !== 'undefined') {
      const isEmbedded =
        window.location.pathname.startsWith('/templates') ||
        window.location.pathname.startsWith('/invitations') ||
        window.location.pathname === '/';
      if (isEmbedded) return;
    }
    document.body.style.overflow = phase === 'open' ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [phase, isThumb]);
  const open = () => { setPhase('opening'); window.setTimeout(() => setPhase('open'), 1500); };

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const target = mainDate?.getTime();
  const left = target ? Math.max(0, target - now) : 0;
  const cd = [['days', Math.floor(left / 864e5)], ['hours', Math.floor(left / 36e5) % 24], ['minutes', Math.floor(left / 6e4) % 60], ['seconds', Math.floor(left / 1e3) % 60]] as const;

  const notify = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 2200); };
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); }
    catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    notify('Address copied');
  };
  const go = (id: string) => { setMenu(false); root.current?.querySelector(`#ihpc-${id}`)?.scrollIntoView({ behavior: 'smooth' }); };

  const step = useCallback((d: number) => setLight((i) => (i === null ? i : (i + d + pics.length) % pics.length)), [pics.length]);
  useEffect(() => {
    if (light === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setLight(null); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [light, step]);

  const toggleMusic = () => { const a = audio.current; if (!a) return; if (a.paused) a.play().then(() => setPlaying(true)).catch(() => notify('Audio could not be played')); else { a.pause(); setPlaying(false); } };

  const venues = useMemo(() => {
    const seen = new Map<string, EventItem>();
    events.forEach((e) => { if (e.venueName || e.venueAddress) { const k = `${e.venueName}|${e.venueAddress}`; if (!seen.has(k)) seen.set(k, e); } });
    return [...seen.values()];
  }, [events]);
  const venue = venues[Math.min(venueIdx, venues.length - 1)];
  const nav = [
    (message || family) && ['invitation', 'Invitation'], story.length && ['story', 'Our story'], events.length && ['events', 'Events'],
    venues.length && ['venue', 'Venue'], pics.length && ['gallery', 'Gallery'],
  ].filter(Boolean) as [string, string][];

  return (
    <div ref={root} className="ih-phulkari-celebration" style={css({ '--t-field': T.field, '--t-rani': T.rani, '--t-indigo': T.indigo, '--t-stitch': T.stitch, '--t-stitch-pink': T.stitchPink })} data-phase={phase}>
      {phase !== 'open' && (
        <div className="ihpc-cover" aria-hidden={phase === 'opening'}>
          <div className="ihpc-curtain ihpc-curtain-l" /><div className="ihpc-curtain ihpc-curtain-r" />
          <div className="ihpc-seal">
            <div className="ihpc-frame">
              <div className="ihpc-mono" aria-hidden="true"><span>{initials}</span></div>
              <p className="ihpc-cover-names">{hasBoth ? <>{first(couple.bride)} <i>and</i> {first(couple.groom)}</> : displayName}</p>
              {mainDate && <p className="ihpc-cover-date">{longDate(mainDate)}</p>}
              <button className="ihpc-btn ihpc-btn-gold" onClick={open} disabled={phase === 'opening'}>Open the invitation</button>
            </div>
          </div>
        </div>
      )}

      <header className="ihpc-nav">
        <button className="ihpc-brand" onClick={() => go('home')} aria-label="Back to top">{initials}</button>
        <button className="ihpc-burger" aria-expanded={menu} aria-label="Menu" onClick={() => setMenu(!menu)}><span /><span /></button>
        <nav className={menu ? 'is-open' : ''}>{nav.map(([id, l]) => <button key={id} onClick={() => go(id)}>{l}</button>)}</nav>
      </header>

      <section id="ihpc-home" className="ihpc-hero">
        <div className="ihpc-hero-in">
          <div className="ihpc-hero-text">
            <p className="ihpc-kicker">{(data as any)?.occasionType ? `${(data as any).occasionType.replace('_', ' ')} celebration` : hasBoth ? 'The wedding of' : 'Celebration of'}</p>
            <h1>{hasBoth ? (<><span>{couple.bride}</span><em>and</em><span>{couple.groom}</span></>) : (<span>{displayName}</span>)}</h1>
            {mainDate && <p className="ihpc-date">{longDate(mainDate)}{main?.startTime ? `, ${fmtT(main.startTime)}` : ''}</p>}
            {couple.tagline && <p className="ihpc-tagline">{couple.tagline}</p>}
            {main?.venueName && <p className="ihpc-where">{main.venueName}</p>}
          </div>
          <div className="ihpc-hero-art" aria-hidden={heroImage ? undefined : true}>
            {heroImage ? <img src={heroImage} alt={`${couple.bride} and ${couple.groom}`} /> : <div className="ihpc-medallion"><span>{initials}</span></div>}
          </div>
        </div>
        <div className="ihpc-border" />
      </section>

      {(message || family) && (
        <section id="ihpc-invitation" className="ihpc-sec ihpc-invite">
          <div className="ihpc-narrow">
            <h2>You are invited</h2>
            {family && <p className="ihpc-family">{family}</p>}
            {family && <p className="ihpc-request">{hasBoth ? 'request the pleasure of your company at the wedding of their children' : 'request the pleasure of your company to celebrate this joyous occasion'}</p>}
            {message && <p className="ihpc-message">{message}</p>}
          </div>
        </section>
      )}

      {story.length > 0 && (
        <section id="ihpc-story" className="ihpc-sec ihpc-story">
          <div className="ihpc-narrow">
            <h2>How it began</h2>
            {story.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>
      )}

      {mainDate && (
        <section id="ihpc-countdown" className="ihpc-sec ihpc-count">
          <h2>{left > 0 ? `Until ${main?.name ?? 'the wedding'}` : 'The celebrations have begun'}</h2>
          {left > 0 && (
            <div className="ihpc-clock" role="timer" aria-live="off">
              {cd.map(([l, v]) => <div key={l}><b>{String(v).padStart(2, '0')}</b><span>{l}</span></div>)}
            </div>
          )}
        </section>
      )}

      {events.length > 0 && (
        <section id="ihpc-events" className="ihpc-sec ihpc-events">
          <h2>The celebrations</h2>
          <div className="ihpc-grid">
            {events.map((e, i) => {
              const d = toDate(e); const s = styleOf(e); const url = mapsUrl(e);
              return (
                <article key={e.id ?? i} className="ihpc-card" data-ev={s} style={css({ '--ev-tile': uri(EVENT_TILE[s]) })}>
                  <div className="ihpc-card-band" aria-hidden="true" />
                  <div className="ihpc-card-body">
                    {d && <div className="ihpc-badge"><b>{d.getDate()}</b><span>{d.toLocaleDateString('en-GB', { month: 'short' })}</span></div>}
                    <div className="ihpc-card-main">
                      <h3>{e.name}</h3>
                      {(d || e.startTime) && <p className="ihpc-when">{d ? d.toLocaleDateString('en-GB', { weekday: 'long' }) : ''}{e.startTime ? `${d ? ', ' : ''}${fmtT(e.startTime)}` : ''}{e.endTime ? ` to ${fmtT(e.endTime)}` : ''}</p>}
                      {e.venueName && <p className="ihpc-venue-name">{e.venueName}</p>}
                      {e.venueAddress && <p className="ihpc-addr">{e.venueAddress}</p>}
                      {e.description && <p className="ihpc-desc">{e.description}</p>}
                      {e.dressCode && <p className="ihpc-dress">Dress code: {e.dressCode}</p>}
                      {(url || e.venueAddress) && (
                        <div className="ihpc-actions">
                          {url && <a className="ihpc-btn ihpc-btn-solid" href={url} target="_blank" rel="noopener noreferrer">Get directions</a>}
                          {e.venueAddress && <button className="ihpc-btn ihpc-btn-line" onClick={() => copy(e.venueAddress!)}>Copy address</button>}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {venue && (
        <section id="ihpc-venue" className="ihpc-sec ihpc-venues">
          <h2>Finding us</h2>
          {venues.length > 1 && (
            <div className="ihpc-tabs" role="tablist">
              {venues.map((v, i) => <button key={i} role="tab" aria-selected={i === venueIdx} onClick={() => setVenueIdx(i)}>{v.venueName || v.venueAddress}</button>)}
            </div>
          )}
          <div className="ihpc-venue-wrap">
            <div className="ihpc-venue-info">
              <h3>{venue.venueName}</h3>
              {venue.venueAddress && <p>{venue.venueAddress}</p>}
              <div className="ihpc-actions">
                {mapsUrl(venue) && <a className="ihpc-btn ihpc-btn-solid" href={mapsUrl(venue)} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>}
                {venue.venueAddress && <button className="ihpc-btn ihpc-btn-line" onClick={() => copy(venue.venueAddress!)}>Copy address</button>}
              </div>
            </div>
            <div className="ihpc-map">
              <iframe title={`Map of ${venue.venueName ?? 'venue'}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${venue.venueName ?? ''} ${venue.venueAddress ?? ''}`.trim())}&output=embed`} />
            </div>
          </div>
        </section>
      )}

      {pics.length > 0 && (
        <section id="ihpc-gallery" className="ihpc-sec ihpc-gallery">
          <h2>Moments</h2>
          <div className="ihpc-masonry">
            {pics.map((p, i) => (
              <button key={i} onClick={() => setLight(i)} aria-label={`Open photo ${i + 1} of ${pics.length}`}><img src={p.src} alt={p.alt ?? ''} /></button>
            ))}
          </div>
        </section>
      )}

      <section id="ihpc-closing" className="ihpc-closing">
        <div className="ihpc-frame ihpc-frame-ivory">
          <div className="ihpc-mono" aria-hidden="true"><span>{initials}</span></div>
          <h2>See you soon</h2>
          <p>{hasBoth ? `${first(couple.bride)} and ${first(couple.groom)}` : displayName}{mainDate ? `, ${longDate(mainDate)}` : ''}</p>
        </div>
      </section>

      {music?.src && (
        <>
          <audio ref={audio} src={music.src} loop preload="none" onEnded={() => setPlaying(false)} />
          <button className="ihpc-music" onClick={toggleMusic} aria-pressed={playing}>{playing ? 'Pause music' : music.title ? `Play: ${music.title}` : 'Play music'}</button>
        </>
      )}
      {toast && <div className="ihpc-toast" role="status">{toast}</div>}

      {light !== null && pics[light] && (
        <div className="ihpc-light" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLight(null)}>
          <button className="ihpc-lx" autoFocus onClick={() => setLight(null)}>Close</button>
          {pics.length > 1 && <button className="ihpc-ln ihpc-lp" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo">‹</button>}
          <img src={pics[light].src} alt={pics[light].alt ?? ''} onClick={(e) => e.stopPropagation()} />
          {pics.length > 1 && <button className="ihpc-ln ihpc-lnx" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo">›</button>}
        </div>
      )}
    </div>
  );
}

export default PhulkariCelebrationTemplate;
