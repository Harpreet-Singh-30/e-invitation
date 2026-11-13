/** Original Phulkari-inspired tiles, generated as SVG strings. */
export type Pal = { bg: string; a: string; b: string; c: string; m: string };
export type Kind = 'diamond' | 'flower' | 'star' | 'lattice';

const inner: Record<Kind, (p: Pal) => [number, number, string]> = {
  diamond: (p) => [48, 48, `<rect width="48" height="48" fill="${p.bg}"/><path d="M24 2 46 24 24 46 2 24Z" fill="none" stroke="${p.a}" stroke-width="2" stroke-dasharray="3 2.2"/><path d="M24 9 39 24 24 39 9 24Z" fill="${p.b}"/><path d="M24 15 33 24 24 33 15 24Z" fill="none" stroke="${p.c}" stroke-width="1.6" stroke-dasharray="2 1.6"/><circle cx="24" cy="24" r="2.6" fill="${p.m}"/><circle cx="23.4" cy="23.4" r=".9" fill="#fff" opacity=".8"/><path d="M0 0h3v3H0zM45 0h3v3h-3zM0 45h3v3H0zM45 45h3v3h-3z" fill="${p.c}"/>`],
  flower: (p) => [48, 48, `<rect width="48" height="48" fill="${p.bg}"/>${[0, 45, 90, 135].map((r) => `<ellipse cx="24" cy="24" rx="4.4" ry="15" fill="${p.b}" stroke="${p.c}" stroke-width=".9" transform="rotate(${r} 24 24)"/>`).join('')}<circle cx="24" cy="24" r="5.2" fill="${p.a}"/><circle cx="24" cy="24" r="2.2" fill="${p.m}"/><path d="M0 0 3 3 0 6zM48 0 45 3 48 6zM0 42 3 45 0 48zM48 42 45 45 48 48z" fill="${p.c}"/>`],
  star: (p) => [48, 48, `<rect width="48" height="48" fill="${p.bg}"/><rect x="11" y="11" width="26" height="26" fill="none" stroke="${p.a}" stroke-width="2" stroke-dasharray="3 2"/><rect x="11" y="11" width="26" height="26" fill="${p.b}" transform="rotate(45 24 24)"/><circle cx="24" cy="24" r="4.4" fill="${p.c}"/><circle cx="24" cy="24" r="1.8" fill="${p.m}"/><circle cx="2" cy="2" r="1.6" fill="${p.a}"/><circle cx="46" cy="2" r="1.6" fill="${p.a}"/><circle cx="2" cy="46" r="1.6" fill="${p.a}"/><circle cx="46" cy="46" r="1.6" fill="${p.a}"/>`],
  lattice: (p) => [32, 32, `<rect width="32" height="32" fill="${p.bg}"/><path d="M0 16 16 0 32 16 16 32Z" fill="none" stroke="${p.a}" stroke-width="1.6"/><path d="M16 0v32M0 16h32" stroke="${p.b}" stroke-width="1.2" stroke-dasharray="2 2"/><path d="M16 9 23 16 16 23 9 16Z" fill="${p.c}" opacity=".85"/><circle cx="16" cy="16" r="2" fill="${p.m}"/>`],
};

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
export const uri = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
export const tile = (k: Kind, p: Pal) => { const [w, h, b] = inner[k](p); return svg(w, h, b); };

/** Running-stitch border strip */
export const stitch = (a: string, b: string) =>
  svg(24, 14, `<path d="M0 11 6 3 12 11 18 3 24 11" fill="none" stroke="${a}" stroke-width="2.2" stroke-dasharray="4 2.4"/><circle cx="12" cy="12.4" r="1.3" fill="${b}"/><circle cx="0" cy="12.4" r="1.3" fill="${b}"/>`);

export const PAL = {
  fuchsia: { bg: '#A52B59', a: '#D9A629', b: '#D94B83', c: '#FFF9EF', m: '#FFF9EF' },
  rani: { bg: '#D94B83', a: '#FFF9EF', b: '#A52B59', c: '#D9A629', m: '#FFF9EF' },
  indigo: { bg: '#26345E', a: '#D9A629', b: '#D94B83', c: '#D56A36', m: '#FFF9EF' },
  orange: { bg: '#D56A36', a: '#FFF9EF', b: '#A52B59', c: '#D9A629', m: '#FFF9EF' },
  mustard: { bg: '#D9A629', a: '#26345E', b: '#D56A36', c: '#A52B59', m: '#FFF9EF' },
  ivory: { bg: '#FFF9EF', a: '#D94B83', b: '#F7DCE5', c: '#D9A629', m: '#A52B59' },
} satisfies Record<string, Pal>;

export type EventStyle = 'mehendi' | 'jaggo' | 'sangeet' | 'karaj' | 'reception' | 'default';
export const EVENT_TILE: Record<EventStyle, string> = {
  mehendi: tile('flower', PAL.orange),
  jaggo: tile('star', PAL.rani),
  sangeet: tile('diamond', PAL.indigo),
  karaj: tile('lattice', PAL.fuchsia),
  reception: tile('star', PAL.indigo),
  default: tile('diamond', PAL.fuchsia),
};

/** Gallery placeholder artwork (used by scripts/make-assets.ts) */
export function swatch(k: Kind, p: Pal, accent: string, scale = 1.5) {
  const [w, h, b] = inner[k](p);
  return svg(800, 600, `<defs><pattern id="t" width="${w}" height="${h}" patternUnits="userSpaceOnUse" patternTransform="scale(${scale})">${b}</pattern></defs><rect width="800" height="600" fill="url(#t)"/><path d="M250 560V290a150 150 0 0 1 300 0V560Z" fill="#FFF9EF" stroke="${accent}" stroke-width="7"/><path d="M280 560V292a120 120 0 0 1 240 0V560Z" fill="none" stroke="${p.b === '#FFF9EF' ? p.c : p.b}" stroke-width="3" stroke-dasharray="9 6"/><path d="M400 250 470 330 400 410 330 330Z" fill="${p.bg}"/><path d="M400 280 440 330 400 380 360 330Z" fill="${accent}"/><circle cx="400" cy="330" r="9" fill="#FFF9EF"/>`);
}
