import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './fonts';
import './styles.css';
import type { EventItem, GalleryItem, TemplateData } from './types';
import { ArtDefs, Bloom, Divider, Monogram, Sprig } from './art';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const has = (s?: string) => typeof s === 'string' && s.trim().length > 0;

const fmtDate = (d: string, long = true) => {
  const dt = new Date(`${d}T12:00:00`);
  if (isNaN(+dt)) return d;
  return new Intl.DateTimeFormat('en-GB', long ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'long', year: 'numeric' }).format(dt);
};
const fmtTime = (t?: string) => {
  const m = t && /^(\d{1,2}):(\d{2})/.exec(t);
  if (!m) return t ?? '';
  const h = +m[1];
  return `${h % 12 || 12}:${m[2]} ${h >= 12 ? 'pm' : 'am'}`;
};

function useReducedMotion() {
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setR(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return r;
}

function useCountdown(iso: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!iso) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [iso]);
  if (!iso) return null;
  const diff = new Date(iso).getTime() - now;
  if (isNaN(diff) || diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

/** User-controlled music. A track path/URL plays as audio; any other id plays the built-in generative "garden pad". */
function useMusic(enabled: boolean, trackId?: string) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<{ stop: () => void } | null>(null);
  const stop = useCallback(() => { ref.current?.stop(); ref.current = null; setPlaying(false); }, []);
  const start = useCallback(() => {
    if (/^(https?:|\/|\.\/).+|\.(mp3|ogg|wav|m4a)$/i.test(trackId ?? '')) {
      const a = new Audio(trackId); a.loop = true; a.volume = 0.5;
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      ref.current = { stop: () => a.pause() };
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = 0;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    lp.connect(master); master.connect(ctx.destination);
    const oscs: OscillatorNode[] = [];
    [146.83, 220, 277.18, 329.63, 369.99, 440].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = (i - 2) * 4;
      const g = ctx.createGain(); g.gain.value = 0.07;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05 + i * 0.023;
      const lg = ctx.createGain(); lg.gain.value = 0.05;
      lfo.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(lp);
      o.start(); lfo.start(); oscs.push(o, lfo);
    });
    master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 3);
    ref.current = { stop: () => { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8); setTimeout(() => { oscs.forEach((o) => o.stop()); ctx.close(); }, 900); } };
    setPlaying(true);
  }, [trackId]);
  useEffect(() => () => ref.current?.stop(), []);
  return { available: enabled, playing, toggle: () => (playing ? stop() : start()) };
}

export function BotanicalRomanceTemplate({ data }: { data: TemplateData }) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [lb, setLb] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const couple = data?.couple;
  const bride = couple?.bride?.trim() ?? '';
  const groom = couple?.groom?.trim() ?? '';
  const hasBoth = Boolean(bride && groom);
  const displayName = hasBoth ? `${bride} & ${groom}` : (groom || bride);
  const occasionLabel = (data as any)?.occasionType
    ? `${(data as any).occasionType.replace('_', ' ')} celebration`
    : 'Together with their families';
  const events = useMemo(
    () => (data?.events ?? []).filter((e) => e && (has(e.title) || has(e.name))).slice().sort((a, b) => `${a.eventDate}${a.startTime ?? ''}`.localeCompare(`${b.eventDate}${b.startTime ?? ''}`)),
    [data?.events],
  );
  const gallery = useMemo(() => (data?.gallery ?? []).map((g: GalleryItem) => (typeof g === 'string' ? { url: g } : g) as { url: string; alt?: string; caption?: string }).filter((g) => has(g.url)), [data?.gallery]);
  const storyRaw: any = data?.story;
  const storyList: any[] = Array.isArray(storyRaw)
    ? storyRaw
    : Array.isArray(storyRaw?.chapters)
    ? storyRaw.chapters
    : storyRaw?.title || storyRaw?.body
    ? [{ title: storyRaw.title || 'Our Story', text: storyRaw.body || storyRaw.text || '' }]
    : [];
  const story = storyList.filter((s) => s && has(s.title));
  const paragraphs = has(data?.message) ? data.message!.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) : [];
  const first = events[0];
  const target = first?.eventDate ? `${first.eventDate}T${/^\d{1,2}:\d{2}$/.test(first.startTime ?? '') ? first.startTime!.padStart(5, '0') : '00:00'}:00` : null;
  const cd = useCountdown(target);
  const venues = useMemo(() => {
    const m = new Map<string, { name: string; address: string; mapLink?: string; events: EventItem[] }>();
    events.forEach((e) => { if (!has(e.venueName) && !has(e.venueAddress)) return; const k = `${e.venueName}|${e.venueAddress}`; const v = m.get(k) ?? { name: e.venueName, address: e.venueAddress, mapLink: e.mapLink, events: [] }; v.events.push(e); m.set(k, v); });
    return [...m.values()];
  }, [events]);
  const music = useMusic(!!data?.music?.enabled, data?.music?.trackId);

  const nav = [
    paragraphs.length && { id: 'welcome', label: 'Welcome' },
    story.length && { id: 'story', label: 'Our story' },
    cd && { id: 'countdown', label: 'Countdown' },
    events.length && { id: 'chapters', label: 'The days' },
    gallery.length && { id: 'gallery', label: 'Gallery' },
    venues.length && { id: 'venue', label: 'The place' },
  ].filter(Boolean) as { id: string; label: string }[];

  const go = (id: string) => (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    document.getElementById(`br-${id}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  // soft reveals
  useEffect(() => {
    const el = root.current; if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]');
    if (reduced || !('IntersectionObserver' in window)) { items.forEach((i) => i.classList.add('is-in')); return; }
    el.setAttribute('data-ready', '');
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  });

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  // lightbox keys + scroll lock
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (lb === null) return;
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLb(null);
      if (e.key === 'ArrowRight') setLb((i) => (i === null ? i : (i + 1) % gallery.length));
      if (e.key === 'ArrowLeft') setLb((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener('keydown', k);
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [lb, gallery.length]);

  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch { /* ignore */ } t.remove();
    }
    setCopied(key); setTimeout(() => setCopied((c) => (c === key ? null : c)), 2200);
  };

  if (!couple || (!bride && !groom)) return null;
  const ini = (s: string) => s.charAt(0).toLocaleUpperCase();
  const mapUrl = (v: { address: string; name: string; mapLink?: string }) => (has(v.mapLink) ? v.mapLink! : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name} ${v.address}`)}`);
  const Dot = ({ children, id, d }: { children: React.ReactNode; id?: string; d?: number }) => <div id={id} data-reveal style={{ ['--d' as string]: `${d ?? 0}ms` }}>{children}</div>;

  return (
    <div className="ih-botanical-romance" ref={root}>
      <ArtDefs />
      <nav className={`br-nav${scrolled ? ' is-on' : ''}`} aria-label="Invitation sections">
        <a href="#br-top" className="br-nav__mono" onClick={go('top')}>{hasBoth ? `${ini(bride)} & ${ini(groom)}` : (ini(groom) || ini(bride))}</a>
        <ul>{nav.map((n) => <li key={n.id}><a href={`#br-${n.id}`} onClick={go(n.id)}>{n.label}</a></li>)}</ul>
      </nav>

      {/* 1 — opening */}
      <header className="br-open" id="br-top">
        <Bloom hue="blush" seed={3} className="br-sway br-open__b1" />
        <Bloom hue="champagne" seed={8} className="br-sway br-open__b2" />
        <Bloom hue="sage" seed={5} className="br-sway br-open__b3" />
        <Bloom hue="blush" seed={11} className="br-sway br-open__b4" />
        <Sprig seed={2} className="br-sway br-open__s1" leaves={10} />
        <Sprig seed={6} className="br-sway br-open__s2" leaves={8} flip />
        <div className="br-open__c">
          <Monogram a={ini(bride)} b={ini(groom)} />
          <p className="br-open__n">{displayName}</p>
          <p className="br-open__d">{first?.eventDate ? fmtDate(first.eventDate, false) : has(couple.tagline) ? couple.tagline : occasionLabel}</p>
          <a className="br-btn" href="#br-couple" onClick={go('couple')}>Open the invitation</a>
        </div>
      </header>

      {/* 2 — hero */}
      <section className="br-hero" id="br-couple">
        <div className="br-hero__t">
          <p className="br-small capitalize" data-reveal>{occasionLabel}</p>
          <h1 data-reveal style={{ ['--d' as string]: '120ms' }}>
            {hasBoth ? (
              <>
                <span className="br-n1">{bride}</span>
                <span className="br-and">and</span>
                <span className="br-n2">{groom}</span>
              </>
            ) : (
              <span className="br-n1">{displayName}</span>
            )}
          </h1>
          {has(couple.tagline) && <p className="br-tag" data-reveal style={{ ['--d' as string]: '240ms' }}>{couple.tagline}</p>}
          {first && <p className="br-when" data-reveal style={{ ['--d' as string]: '320ms' }}>{fmtDate(first.eventDate)}<br />{first.venueName}</p>}
        </div>
        <div className="br-hero__p" data-reveal style={{ ['--d' as string]: '200ms' }}>
          {has(data.heroImageUrl) ? (
            <div className="br-arch"><img src={data.heroImageUrl} alt={displayName} /></div>
          ) : (
            <div className="br-arch br-arch--art" aria-hidden="true">
              <Bloom hue="blush" seed={21} className="br-sway a1" /><Bloom hue="champagne" seed={22} className="br-sway a2" /><Bloom hue="sage" seed={23} className="br-sway a3" />
              <Sprig seed={4} className="a4" leaves={8} />
            </div>
          )}
        </div>
      </section>

      {/* 3 — welcome */}
      {paragraphs.length > 0 && (
        <section className="br-sec br-welcome" id="br-welcome">
          <Sprig seed={7} className="br-side br-side--l" leaves={9} />
          <div className="br-welcome__b">
            <Dot><Divider className="br-div" /><h2 className="br-h">A note from us</h2></Dot>
            {paragraphs.map((p, i) => <p key={i} className={i === 0 ? 'br-lede' : 'br-p'} data-reveal>{p}</p>)}
            <p className="br-sign" data-reveal>{displayName}</p>
          </div>
        </section>
      )}

      {/* 4 — story */}
      {story.length > 0 && (
        <section className="br-sec br-story" id="br-story">
          <Dot><h2 className="br-h br-h--c">How we got here</h2></Dot>
          <ol className="br-tl">
            {story.map((s, i) => (
              <li key={i} data-reveal>
                <span className="br-tl__y">{s.year}</span>
                <span className="br-tl__dot" aria-hidden="true" />
                <div className="br-tl__c"><h3>{s.title}</h3><p>{s.text}</p></div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 5 — countdown */}
      {cd && (
        <section className="br-sec br-count" id="br-countdown" aria-label="Countdown to the wedding">
          <Bloom hue="blush" seed={31} className="br-sway br-count__b1" />
          <Bloom hue="sage" seed={32} className="br-sway br-count__b2" />
          <Dot><p className="br-small">Until we celebrate</p></Dot>
          <div className="br-count__g" role="timer">
            {([['days', cd.days], ['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]] as const).map(([l, v]) => (
              <div key={l}><span className="br-count__n">{String(v).padStart(2, '0')}</span><span className="br-count__l">{l}</span></div>
            ))}
          </div>
        </section>
      )}

      {/* 6 — chapters */}
      {events.length > 0 && (
        <section className="br-sec br-chs" id="br-chapters">
          <Dot><Divider className="br-div" /><h2 className="br-h br-h--c">The days we’ll share</h2></Dot>
          {events.map((e, i) => (
            <article key={e.key || i} className={`br-ch${i % 2 ? ' is-r' : ''}`} id={`br-ev-${e.key}`}>
              <div className="br-ch__t" data-reveal>
                <span className="br-ch__no" aria-hidden="true">{ROMAN[i] ?? i + 1}</span>
                <p className="br-ch__name">{e.name}</p>
                <h3>{e.title}</h3>
                <dl>
                  <div><dt>When</dt><dd>{fmtDate(e.eventDate)}{has(e.startTime) && <>, {fmtTime(e.startTime)}</>}</dd></div>
                  {(has(e.venueName) || has(e.venueAddress)) && <div><dt>Where</dt><dd>{e.venueName}{has(e.venueAddress) && <span className="br-addr">{e.venueAddress}</span>}</dd></div>}
                </dl>
                {has(e.description) && <p className="br-p">{e.description}</p>}
              </div>
              <div className="br-ch__a" data-reveal style={{ ['--d' as string]: '150ms' }} aria-hidden="true">
                <Bloom hue={(['blush', 'champagne', 'sage'] as const)[i % 3]} seed={40 + i} className="br-sway c1" />
                <Bloom hue={(['sage', 'blush', 'champagne'] as const)[i % 3]} seed={50 + i} className="br-sway c2" />
                <Sprig seed={60 + i} className="c3" flip={i % 2 === 1} leaves={8} />
              </div>
            </article>
          ))}
        </section>
      )}

      {/* 7 — gallery */}
      {gallery.length > 0 && (
        <section className="br-sec br-gal" id="br-gallery">
          <Dot><h2 className="br-h br-h--c">Moments</h2></Dot>
          <div className="br-gal__g">
            {gallery.map((g, i) => (
              <button key={i} className={`br-ph br-ph--${i % 6}`} onClick={() => setLb(i)} data-reveal aria-label={`Open photograph ${i + 1}${g.alt ? `: ${g.alt}` : ''}`}>
                <img src={g.url} alt={g.alt ?? ''} loading="lazy" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 8 — venue */}
      {venues.length > 0 && (
        <section className="br-sec br-venue" id="br-venue">
          <Sprig seed={9} className="br-side br-side--r" leaves={10} />
          <Dot><h2 className="br-h">The place</h2></Dot>
          {venues.map((v, i) => (
            <div key={i} className="br-v" data-reveal>
              <h3>{v.name}</h3>
              <address>{v.address}</address>
              <ul className="br-v__e">{v.events.map((e) => <li key={e.key}><span>{e.name}</span>{fmtTime(e.startTime)}</li>)}</ul>
              <div className="br-v__a">
                <a className="br-btn" href={mapUrl(v)} target="_blank" rel="noopener noreferrer">Open in Maps</a>
                {has(v.address) && <button className="br-btn br-btn--o" onClick={() => copy(`${v.name}, ${v.address}`, `v${i}`)}>{copied === `v${i}` ? 'Address copied' : 'Copy address'}</button>}
              </div>
              <span className="br-sr" role="status">{copied === `v${i}` ? 'Address copied to clipboard' : ''}</span>
            </div>
          ))}
        </section>
      )}

      {/* 9 — closing */}
      <footer className="br-close">
        <Bloom hue="blush" seed={71} className="br-sway k1" /><Bloom hue="champagne" seed={72} className="br-sway k2" />
        <Bloom hue="sage" seed={73} className="br-sway k3" /><Bloom hue="blush" seed={74} className="br-sway k4" />
        <Sprig seed={75} className="k5" leaves={9} /><Sprig seed={76} className="k6" leaves={9} flip />
        <div className="br-close__c" data-reveal>
          <Monogram a={ini(bride)} b={ini(groom)} />
          <p className="br-close__t">{has(couple.tagline) ? couple.tagline : 'With love and gratitude'}</p>
          <p className="br-close__n">{displayName}</p>
        </div>
      </footer>

      {music.available && (
        <button className="br-music" onClick={music.toggle} aria-pressed={music.playing} aria-label={music.playing ? 'Pause music' : 'Play music'}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            {music.playing ? <path d="M7 5v14M12 8v8M17 5v14" /> : <path d="M9 18V6l10-2v12M9 18a3 3 0 11-3-3M19 16a3 3 0 11-3-3" />}
          </svg>
        </button>
      )}

      {lb !== null && gallery[lb] && (
        <div className="br-lb" role="dialog" aria-modal="true" aria-label="Photograph viewer" onClick={() => setLb(null)}>
          <button ref={closeRef} className="br-lb__x" onClick={() => setLb(null)} aria-label="Close">×</button>
          <button className="br-lb__n br-lb__p" onClick={(e) => { e.stopPropagation(); setLb((lb - 1 + gallery.length) % gallery.length); }} aria-label="Previous photograph">‹</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={gallery[lb].url} alt={gallery[lb].alt ?? ''} />
            <figcaption>{gallery[lb].caption ?? ''} <span>{lb + 1} / {gallery.length}</span></figcaption>
          </figure>
          <button className="br-lb__n br-lb__nx" onClick={(e) => { e.stopPropagation(); setLb((lb + 1) % gallery.length); }} aria-label="Next photograph">›</button>
        </div>
      )}
    </div>
  );
}

export default BotanicalRomanceTemplate;
