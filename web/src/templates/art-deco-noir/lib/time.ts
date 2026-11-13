import type { WeddingEvent } from '../types';

export interface Clock {
  h: number;
  m: number;
}

export interface CalendarDate {
  y: number;
  mo: number;
  d: number;
}

export function parseDate(value: string | undefined): CalendarDate | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const mo = Number(match[2]);
  const d = Number(match[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, mo, d };
}

/** Accepts `HH:mm`, `H:mm`, `h:mm AM`, `h AM`. */
export function parseTime(value: string | undefined): Clock | null {
  if (!value) return null;
  const match = /^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?$/.exec(value.trim());
  if (!match) return null;
  let h = Number(match[1]);
  const m = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3] ? match[3].toLowerCase() : '';
  if (m > 59) return null;
  if (meridiem) {
    if (h < 1 || h > 12) return null;
    if (meridiem === 'pm' && h !== 12) h += 12;
    if (meridiem === 'am' && h === 12) h = 0;
  } else if (h > 23) {
    return null;
  }
  return { h, m };
}

function zoneOffsetMs(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const pick = (type: string): number => {
    const part = parts.find((p) => p.type === type);
    return part ? Number(part.value) : 0;
  };
  const asUtc = Date.UTC(pick('year'), pick('month') - 1, pick('day'), pick('hour') % 24, pick('minute'), pick('second'));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/**
 * Wall-clock date + time → UTC timestamp. When `timeZone` is a valid IANA zone
 * the wall-clock time is interpreted there, otherwise in the viewer's zone.
 */
export function toTimestamp(date: string, time: string, timeZone?: string): number | null {
  const d = parseDate(date);
  const t = parseTime(time) ?? { h: 0, m: 0 };
  if (!d) return null;
  if (timeZone) {
    try {
      const guess = Date.UTC(d.y, d.mo - 1, d.d, t.h, t.m);
      const first = zoneOffsetMs(guess, timeZone);
      let ts = guess - first;
      const second = zoneOffsetMs(ts, timeZone);
      if (second !== first) ts = guess - second;
      return ts;
    } catch {
      /* invalid zone: fall through to local time */
    }
  }
  return new Date(d.y, d.mo - 1, d.d, t.h, t.m).getTime();
}

/** Sort key that ignores zones: date then time. */
export function sortKey(event: WeddingEvent): number {
  const d = parseDate(event.eventDate);
  const t = parseTime(event.startTime) ?? { h: 0, m: 0 };
  if (!d) return Number.MAX_SAFE_INTEGER;
  return Date.UTC(d.y, d.mo - 1, d.d, t.h, t.m);
}

const utcDate = (d: CalendarDate): Date => new Date(Date.UTC(d.y, d.mo - 1, d.d, 12));

export function formatWeekday(date: string): string {
  const d = parseDate(date);
  return d ? new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(utcDate(d)) : '';
}

export function formatMonth(date: string): string {
  const d = parseDate(date);
  return d ? new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(utcDate(d)) : '';
}

export function formatDay(date: string): string {
  const d = parseDate(date);
  return d ? String(d.d) : '';
}

export function formatYear(date: string): string {
  const d = parseDate(date);
  return d ? String(d.y) : '';
}

export function formatLongDate(date: string): string {
  const d = parseDate(date);
  return d
    ? new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(utcDate(d))
    : '';
}

export function formatClock(time: string): string {
  const t = parseTime(time);
  if (!t) return time;
  const suffix = t.h >= 12 ? 'PM' : 'AM';
  const hour = t.h % 12 === 0 ? 12 : t.h % 12;
  return `${hour}:${String(t.m).padStart(2, '0')} ${suffix}`;
}

export function pad(n: number, size = 2): string {
  return String(Math.max(0, n)).padStart(size, '0');
}

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

export function remaining(target: number, now: number): Remaining {
  const diff = Math.max(0, target - now);
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: diff === 0,
  };
}
