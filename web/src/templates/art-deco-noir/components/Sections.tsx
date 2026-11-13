import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { CoupleStory, WeddingEvent } from '../types';
import { copyText } from '../lib/clipboard';
import { useCountdown, useInView } from '../lib/hooks';
import {
  formatClock,
  formatDay,
  formatLongDate,
  formatMonth,
  formatWeekday,
  formatYear,
  pad,
} from '../lib/time';
import { FanDivider, Monogram, Skyline, Sunburst } from './Deco';

/* ------------------------------------------------------------------ */
/* Invitation message                                                  */
/* ------------------------------------------------------------------ */

export function MessageSection({ message }: { message: string }) {
  const [ref, seen] = useInView<HTMLElement>(0.2);
  const paragraphs = message
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length === 0) return null;
  return (
    <section ref={ref} className={`adn-section adn-message${seen ? ' is-visible' : ''}`} data-section="invitation" aria-labelledby="adn-message-title">
      <FanDivider className="adn-message__rule" />
      <h2 id="adn-message-title" className="adn-sr">You are invited</h2>
      <div className="adn-message__body">
        {paragraphs.map((p, i) => (
          <p key={i} className={i === 0 ? 'adn-message__lead' : 'adn-message__text'}>
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Couple story                                                        */
/* ------------------------------------------------------------------ */

export function StorySection({ story }: { story: CoupleStory }) {
  const chapters = story.chapters.filter((c) => c.title || c.text);
  if (chapters.length === 0) return null;
  return (
    <section className="adn-section adn-story" data-section="story" aria-labelledby="adn-story-title">
      <h2 id="adn-story-title" className="adn-title">{story.title || 'Our story'}</h2>
      <ol className="adn-story__list">
        {chapters.map((chapter, i) => {
          const flip = i % 2 === 1;
          return (
            <li key={`${chapter.label}-${i}`} className={`adn-chapter${flip ? ' is-flipped' : ''}`}>
              <div className="adn-chapter__side adn-chapter__side--a">
                <p className="adn-chapter__year">{chapter.label}</p>
              </div>
              <div className="adn-chapter__axis" aria-hidden="true">
                <span className="adn-diamond" />
              </div>
              <div className="adn-chapter__side adn-chapter__side--b">
                <h3 className="adn-chapter__title">{chapter.title}</h3>
                <p className="adn-chapter__text">{chapter.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Countdown                                                           */
/* ------------------------------------------------------------------ */

export function CountdownSection({ target, eventLabel, whenLabel }: { target: number; eventLabel: string; whenLabel: string }) {
  const left = useCountdown(target);
  const [ref, seen] = useInView<HTMLElement>(0.2);
  if (!left) return null;
  const cells: Array<[string, string]> = [
    ['Days', pad(left.days, left.days > 99 ? 3 : 2)],
    ['Hours', pad(left.hours)],
    ['Minutes', pad(left.minutes)],
    ['Seconds', pad(left.seconds)],
  ];
  const elapsed = Date.now() - target;
  const doneText = elapsed < 36 * 3600 * 1000 ? 'The celebration is underway.' : 'Thank you for celebrating with us.';
  return (
    <section ref={ref} className={`adn-section adn-countdown${seen ? ' is-visible' : ''}`} data-section="countdown" aria-labelledby="adn-countdown-title">
      <Skyline />
      <h2 id="adn-countdown-title" className="adn-title">Until the day</h2>
      <div className="adn-display" role="timer" aria-label={`${left.days} days, ${left.hours} hours and ${left.minutes} minutes until ${eventLabel}`}>
        <span className="adn-display__crown" aria-hidden="true">
          <Sunburst rays={13} rings={[10, 30, 60, 92]} innerRadius={10} />
        </span>
        <div className="adn-display__frame">
          <div className="adn-display__gap">
            <div className="adn-display__ring">
              <div className="adn-display__inner">
                {cells.map(([label, value]) => (
                  <div className="adn-cell" key={label}>
                    <span className="adn-cell__value" aria-hidden="true">{value}</span>
                    <span className="adn-cell__label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {left.done ? <p className="adn-countdown__note">{doneText}</p> : null}
      <p className="adn-countdown__caption">
        <span className="adn-countdown__event">{eventLabel}</span>
        <span className="adn-countdown__when">{whenLabel}</span>
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Itinerary                                                           */
/* ------------------------------------------------------------------ */

interface DayGroup {
  date: string;
  events: WeddingEvent[];
}

export function ItinerarySection({ groups }: { groups: DayGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <section className="adn-section adn-itinerary" data-section="itinerary" aria-labelledby="adn-itinerary-title">
      <h2 id="adn-itinerary-title" className="adn-title">Itinerary</h2>
      <div className="adn-itinerary__days">
        {groups.map((group) => (
          <article className="adn-day" key={group.date} aria-label={formatLongDate(group.date)}>
            <header className="adn-day__head">
              <span className="adn-day__number" aria-hidden="true">{formatDay(group.date)}</span>
              <span className="adn-day__meta">
                <span className="adn-day__month">{formatMonth(group.date)}</span>
                <span className="adn-day__weekday">{formatWeekday(group.date)}</span>
                <span className="adn-day__year">{formatYear(group.date)}</span>
              </span>
            </header>
            <ol className="adn-day__rows">
              {group.events.map((event, i) => (
                <li className="adn-row" key={`${event.startTime}-${event.venueName}-${i}`}>
                  <time className="adn-row__time">{formatClock(event.startTime)}</time>
                  <div className="adn-row__main">
                    <h3 className="adn-row__title">{event.title || event.venueName}</h3>
                    {event.description ? <p className="adn-row__text">{event.description}</p> : null}
                  </div>
                  <p className="adn-row__venue">
                    <span className="adn-row__venue-name">{event.venueName}</span>
                    {event.venueAddress ? <span className="adn-row__venue-address">{event.venueAddress}</span> : null}
                  </p>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Venue information                                                   */
/* ------------------------------------------------------------------ */

export interface VenueInfo {
  key: string;
  name: string;
  address: string;
  mapLink: string;
  events: Array<{ time: string; title: string }>;
}

function VenueCard({ venue }: { venue: VenueInfo }) {
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await copyText(venue.address ? `${venue.name}, ${venue.address}` : venue.name);
    setCopied(ok ? 'done' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied('idle'), 2600);
  };

  const lines = venue.address.split(',').map((l) => l.trim()).filter(Boolean);
  return (
    <article className="adn-venue">
      <div className="adn-venue__arch">
        <h3 className="adn-venue__name">{venue.name}</h3>
        {lines.length > 0 ? (
          <address className="adn-venue__address">
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        ) : null}
        <div className="adn-venue__actions">
          {venue.mapLink ? (
            <a className="adn-button" href={venue.mapLink} target="_blank" rel="noopener noreferrer">
              <span>Get directions</span>
              <span className="adn-sr"> to {venue.name} (opens in a new tab)</span>
            </a>
          ) : null}
          <button type="button" className="adn-button adn-button--quiet" onClick={copy}>
            <span>{copied === 'done' ? 'Address copied' : 'Copy address'}</span>
          </button>
        </div>
        <p className="adn-sr" role="status" aria-live="polite">
          {copied === 'done' ? 'Address copied to clipboard.' : copied === 'failed' ? 'Copy failed. Select the address and copy it manually.' : ''}
        </p>
        {copied === 'failed' ? <p className="adn-venue__error">Copy failed. Select the address above and copy it manually.</p> : null}
        {venue.events.length > 0 ? (
          <ul className="adn-venue__events">
            {venue.events.map((e, i) => (
              <li key={`${e.time}-${i}`}>
                <span className="adn-venue__event-time">{e.time}</span>
                <span className="adn-venue__event-title">{e.title}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export function VenueSection({ venues }: { venues: VenueInfo[] }) {
  const [ref, seen] = useInView<HTMLElement>(0.2);
  if (venues.length === 0) return null;
  const count = Math.min(venues.length, 3);
  return (
    <section ref={ref} className={`adn-section adn-venues${seen ? ' is-visible' : ''}`} data-section="venue" aria-labelledby="adn-venue-title">
      <Skyline />
      <h2 id="adn-venue-title" className="adn-title">{venues.length > 1 ? 'Venues' : 'Venue'}</h2>
      <div className="adn-venues__grid" style={{ '--ih-cols': count } as CSSProperties}>
        {venues.map((v) => (
          <VenueCard key={v.key} venue={v} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing monogram                                                    */
/* ------------------------------------------------------------------ */

export function ClosingSection({ initials, names, dateLabel }: { initials: [string, string]; names: string; dateLabel: string }) {
  const [ref, seen] = useInView<HTMLElement>(0.35);
  return (
    <footer ref={ref} className={`adn-section adn-closing${seen ? ' is-visible' : ''}`} data-section="closing">
      <FanDivider className="adn-closing__rule" />
      <Monogram initials={initials} animate className="adn-closing__monogram" />
      <p className="adn-closing__names">{names}</p>
      {dateLabel ? <p className="adn-label adn-closing__date">{dateLabel}</p> : null}
    </footer>
  );
}
