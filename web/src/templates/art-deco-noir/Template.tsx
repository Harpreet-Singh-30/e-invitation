import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import './art-deco-noir.css';
import type { GalleryImage, TemplateData, TemplateProps, WeddingEvent } from './types';
import { Gate } from './components/Gate';
import { Hero } from './components/Hero';
import { MusicToggle } from './components/MusicToggle';
import { GallerySection } from './components/Gallery';
import {
  ClosingSection,
  CountdownSection,
  ItinerarySection,
  MessageSection,
  StorySection,
  VenueSection,
} from './components/Sections';
import type { VenueInfo } from './components/Sections';
import { usePrefersReducedMotion, useScrollLock, useSmoothScroll } from './lib/hooks';
import { resolveTrack } from './lib/tracks';
import {
  formatClock,
  formatLongDate,
  parseDate,
  sortKey,
  toTimestamp,
} from './lib/time';

export type {
  Couple,
  CoupleStory,
  GalleryImage,
  MusicSettings,
  StoryChapter,
  TemplateData,
  TemplateProps,
  WeddingEvent,
} from './types';

type Phase = 'closed' | 'opening' | 'open';

const clean = (value: string | undefined): string => (value ?? '').trim();

function initialOf(name: string): string {
  const first = Array.from(clean(name))[0];
  return first ? first.toUpperCase() : '';
}

function mapLinkFor(event: WeddingEvent): string {
  const given = clean(event.mapLink);
  if (given) return given;
  const query = [clean(event.venueName), clean(event.venueAddress)].filter(Boolean).join(', ');
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '';
}

function pickCountdownTarget(events: WeddingEvent[]): { event: WeddingEvent; at: number } | null {
  const dated = events
    .map((event) => ({ event, at: toTimestamp(event.eventDate, event.startTime, event.timeZone) }))
    .filter((entry): entry is { event: WeddingEvent; at: number } => entry.at !== null)
    .sort((a, b) => a.at - b.at);
  if (dated.length === 0) return null;
  const now = Date.now();
  return dated.find((entry) => entry.at > now) ?? dated[dated.length - 1];
}

function scrollToSection(root: HTMLElement | null, key: string, reduced: boolean): void {
  if (!root) return;
  const target = root.querySelector<HTMLElement>(`[data-section="${key}"]`);
  if (!target) return;
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

export default function ArtDecoNoirTemplate({ data }: TemplateProps) {
  const isThumb = Boolean((data as any)?._isThumbnail);
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>(isThumb ? 'open' : 'closed');
  const [scrolled, setScrolled] = useState(false);

  useScrollLock(!isThumb && phase !== 'open');
  useSmoothScroll(!reduced);

  const model = useMemo(() => buildModel(data), [data]);

  const open = useCallback(() => {
    setPhase((current) => (current === 'closed' ? 'opening' : current));
  }, []);

  useEffect(() => {
    if (phase !== 'opening') return;
    const id = window.setTimeout(() => {
      setPhase('open');
      const title = root.current?.querySelector<HTMLElement>('#adn-hero-title');
      title?.focus({ preventScroll: true });
    }, reduced ? 200 : 1500);
    return () => window.clearTimeout(id);
  }, [phase, reduced]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (key: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(root.current, key, reduced);
  };

  const classes = ['ih-art-deco-noir'];
  if (phase === 'closed') classes.push('is-closed');
  if (phase !== 'closed') classes.push('is-revealed');
  if (phase === 'open') classes.push('is-open');
  if (reduced) classes.push('is-reduced');

  return (
    <div ref={root} className={classes.join(' ')} data-phase={phase}>
      {phase !== 'open' ? (
        <Gate initials={model.initials} dateLabel={model.gateDate} opening={phase === 'opening'} onOpen={open} />
      ) : null}

      <header className={`adn-bar${scrolled ? ' is-scrolled' : ''}`}>
        <a className="adn-bar__mark" href="#top" onClick={go('top')} aria-label="Back to the top">
          <span>{model.initials[0]}</span>
          <i aria-hidden="true" />
          <span>{model.initials[1]}</span>
        </a>
        <nav className="adn-bar__nav" aria-label="Invitation sections">
          {model.nav.map((item) => (
            <a key={item.key} href={`#${item.key}`} onClick={go(item.key)}>
              {item.label}
            </a>
          ))}
        </nav>
        {model.track ? <MusicToggle track={model.track} /> : <span />}
      </header>

      <main>
        <Hero
          first={model.first}
          second={model.second}
          tagline={model.tagline}
          image={model.heroImage}
          dateLine={model.heroDate}
          venueLine={model.heroVenue}
        />
        {model.message ? <MessageSection message={model.message} /> : null}
        {data.story ? <StorySection story={data.story} /> : null}
        {model.countdown ? (
          <CountdownSection target={model.countdown.at} eventLabel={model.countdown.label} whenLabel={model.countdown.when} />
        ) : null}
        <ItinerarySection groups={model.groups} />
        <GallerySection images={model.gallery} />
        <VenueSection venues={model.venues} />
      </main>

      <ClosingSection initials={model.initials} names={`${model.first} & ${model.second}`} dateLabel={model.closingDate} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function buildModel(data: TemplateData) {
  const groom = clean(data.couple?.groom);
  const bride = clean(data.couple?.bride);
  const brideFirst = data.couple?.nameOrder === 'bride-first';
  const first = brideFirst ? bride : groom;
  const second = brideFirst ? groom : bride;

  const events = (data.events ?? [])
    .filter((e) => parseDate(e.eventDate) !== null)
    .slice()
    .sort((a, b) => sortKey(a) - sortKey(b));

  // Itinerary: group by calendar day.
  const groups: Array<{ date: string; events: WeddingEvent[] }> = [];
  events.forEach((event) => {
    const date = event.eventDate.slice(0, 10);
    const last = groups[groups.length - 1];
    if (last && last.date === date) last.events.push(event);
    else groups.push({ date, events: [event] });
  });

  // Venues: one card per distinct venue, listing the events held there.
  const venueMap = new Map<string, VenueInfo>();
  events.forEach((event) => {
    const name = clean(event.venueName);
    const address = clean(event.venueAddress);
    if (!name && !address) return;
    const key = `${name.toLowerCase()}|${address.toLowerCase()}`;
    const entry = venueMap.get(key) ?? { key, name: name || address, address: name ? address : '', mapLink: mapLinkFor(event), events: [] };
    entry.events.push({ time: formatClock(event.startTime), title: event.title || name });
    venueMap.set(key, entry);
  });
  const venues = Array.from(venueMap.values());

  const target = pickCountdownTarget(events);
  const countdown = target
    ? {
        at: target.at,
        label: target.event.title || target.event.venueName || 'the wedding',
        when: `${formatLongDate(target.event.eventDate)}, ${formatClock(target.event.startTime)}`,
      }
    : null;

  const lead = events[0];
  const gallery: GalleryImage[] = (data.gallery ?? []).filter((g) => clean(g?.src));
  const track = data.music?.enabled ? resolveTrack(data.music.trackId) : null;

  const nav: Array<{ key: string; label: string }> = [];
  if (clean(data.message)) nav.push({ key: 'invitation', label: 'Invitation' });
  if (data.story && data.story.chapters.length > 0) nav.push({ key: 'story', label: 'Story' });
  if (countdown) nav.push({ key: 'countdown', label: 'Countdown' });
  if (groups.length > 0) nav.push({ key: 'itinerary', label: 'Itinerary' });
  if (gallery.length > 0) nav.push({ key: 'gallery', label: 'Gallery' });
  if (venues.length > 0) nav.push({ key: 'venue', label: 'Venue' });

  const shortDate = lead ? formatLongDate(lead.eventDate) : '';
  return {
    first,
    second,
    initials: [initialOf(first), initialOf(second)] as [string, string],
    tagline: clean(data.couple?.tagline),
    heroImage: clean(data.heroImage),
    heroDate: shortDate,
    heroVenue: lead ? clean(lead.venueName) : '',
    gateDate: shortDate,
    closingDate: shortDate,
    message: clean(data.message),
    groups,
    venues,
    countdown,
    gallery,
    track,
    nav,
  };
}
