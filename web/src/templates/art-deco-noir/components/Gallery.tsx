import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, TouchEvent } from 'react';
import type { GalleryImage } from '../types';
import { useInView, useScrollLock } from '../lib/hooks';

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */

function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onIndex: (next: number) => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const total = images.length;
  const image = images[index];

  useScrollLock(true);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      if (previous && typeof previous.focus === 'function') previous.focus({ preventScroll: true });
    };
  }, []);

  const step = useCallback(
    (delta: number) => {
      onIndex((index + delta + total) % total);
    },
    [index, onIndex, total],
  );

  // Warm the neighbouring images so arrow navigation feels instant.
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => {
      const neighbour = images[(i + total) % total];
      if (neighbour) {
        const probe = new Image();
        probe.src = neighbour.src;
      }
    });
  }, [images, index, total]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    } else if (event.key === 'ArrowRight') {
      step(1);
    } else if (event.key === 'ArrowLeft') {
      step(-1);
    } else if (event.key === 'Tab' && dialog.current) {
      const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>('button:not([disabled])'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchX.current = event.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchX.current;
    const end = event.changedTouches[0]?.clientX;
    touchX.current = null;
    if (start === null || end === undefined) return;
    const dx = end - start;
    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
  };

  if (!image) return null;
  return (
    <div
      ref={dialog}
      className="adn-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button ref={closeButton} type="button" className="adn-lightbox__close" onClick={onClose} aria-label="Close photo viewer">
        <span aria-hidden="true" />
      </button>
      <figure className="adn-lightbox__figure">
        <img key={image.src} className="adn-lightbox__image" src={image.src} alt={image.alt} />
        <figcaption className="adn-lightbox__caption">
          <span className="adn-lightbox__count" aria-live="polite">{`${index + 1} / ${total}`}</span>
          {image.caption ? <span className="adn-lightbox__text">{image.caption}</span> : null}
        </figcaption>
      </figure>
      {total > 1 ? (
        <>
          <button type="button" className="adn-lightbox__nav adn-lightbox__nav--prev" onClick={() => step(-1)} aria-label="Previous photo">
            <span aria-hidden="true" />
          </button>
          <button type="button" className="adn-lightbox__nav adn-lightbox__nav--next" onClick={() => step(1)} aria-label="Next photo">
            <span aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

interface Row {
  start: number;
  items: GalleryImage[];
}

const PATTERN = [1, 2, 3];

function buildRows(images: GalleryImage[]): Row[] {
  const rows: Row[] = [];
  let cursor = 0;
  let step = 0;
  while (cursor < images.length) {
    const size = Math.min(PATTERN[step % PATTERN.length], images.length - cursor);
    rows.push({ start: cursor, items: images.slice(cursor, cursor + size) });
    cursor += size;
    step += 1;
  }
  return rows;
}

function GalleryRow({ row, onOpen }: { row: Row; onOpen: (index: number) => void }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.18);
  return (
    <div ref={ref} className={`adn-gallery__row adn-gallery__row--${row.items.length}${seen ? ' is-visible' : ''}`}>
      {row.items.map((image, i) => (
        <button
          key={image.src}
          type="button"
          className="adn-photo"
          onClick={() => onOpen(row.start + i)}
          aria-label={`Open photo: ${image.alt}`}
        >
          <img src={image.src} alt="" loading="lazy" decoding="async" />
          {image.caption ? <span className="adn-photo__caption">{image.caption}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function GallerySection({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (images.length === 0) return null;
  const rows = buildRows(images);
  return (
    <section className="adn-gallery" data-section="gallery" aria-labelledby="adn-gallery-title">
      <h2 id="adn-gallery-title" className="adn-title adn-gallery__title">Gallery</h2>
      {rows.map((row) => (
        <GalleryRow key={row.start} row={row} onOpen={setOpen} />
      ))}
      {open !== null ? <Lightbox images={images} index={open} onClose={() => setOpen(null)} onIndex={setOpen} /> : null}
    </section>
  );
}
