import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { remaining } from './time';
import type { Remaining } from './time';

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Adds `is-visible` the first time the element scrolls into view. */
export function useInView<T extends HTMLElement>(threshold = 0.25): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, seen];
}

export function useCountdown(target: number | null): Remaining | null {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    if (target === null) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);
  return target === null ? null : remaining(target, now);
}

/** Locks page scroll while `locked` is true and restores the previous value. */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    // Do not lock global body scroll in embedded or multi-component contexts
    if (typeof window !== 'undefined') {
      const isEmbedded =
        window.location.pathname.startsWith('/templates') ||
        window.location.pathname.startsWith('/invitations') ||
        window.location.pathname === '/';
      if (isEmbedded) return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

/** Enables smooth anchor scrolling while the template is mounted. */
export function useSmoothScroll(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'smooth';
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, [enabled]);
}
