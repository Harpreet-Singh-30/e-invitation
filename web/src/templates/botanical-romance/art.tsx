import type { CSSProperties } from 'react';

const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Shared SVG filter (watercolour edge). Render once per template. */
export const ArtDefs = () => (
  <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
    <defs>
      <filter id="br-wc" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="9" result="d" />
        <feGaussianBlur in="d" stdDeviation="0.9" />
      </filter>
    </defs>
  </svg>
);

const HUES = {
  blush: ['#E8C9C4', '#D9A9A4', '#C98F8C'],
  champagne: ['#EADFC4', '#D3BD93', '#B99E68'],
  sage: ['#C4CFBC', '#9BAA91', '#7D8F72'],
  ivory: ['#F6EFE3', '#E8DCC8', '#D3BD93'],
} as const;
export type Hue = keyof typeof HUES;

export function Bloom({ hue = 'blush', seed = 1, className, style }: { hue?: Hue; seed?: number; className?: string; style?: CSSProperties }) {
  const r = rng(seed * 97);
  const [c1, c2, c3] = HUES[hue];
  const rings = [
    { n: 8, k: 1, col: c1, o: 0.78 },
    { n: 6, k: 0.7, col: c2, o: 0.6 },
    { n: 5, k: 0.42, col: c3, o: 0.55 },
  ];
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} aria-hidden="true" focusable="false">
      <g filter="url(#br-wc)" style={{ mixBlendMode: 'multiply' }}>
        {rings.map((g, ri) =>
          Array.from({ length: g.n }, (_, i) => {
            const a = (i * 360) / g.n + r() * 24 + ri * 17;
            return <ellipse key={`${ri}-${i}`} cx="0" cy={-48 * g.k} rx={34 * g.k * (0.85 + r() * 0.3)} ry={58 * g.k * (0.9 + r() * 0.2)} fill={g.col} opacity={g.o} transform={`rotate(${a.toFixed(1)})`} />;
          }),
        )}
        <circle r="9" fill="#D3BD93" opacity=".9" />
      </g>
      {Array.from({ length: 14 }, (_, i) => {
        const a = r() * Math.PI * 2, d = r() * 7;
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r=".9" fill="#59694E" opacity=".7" />;
      })}
    </svg>
  );
}

/** Delicate botanical line drawing: a curving stem with paired leaves and a bud. */
export function Sprig({ leaves = 9, seed = 1, className, style, flip }: { leaves?: number; seed?: number; className?: string; style?: CSSProperties; flip?: boolean }) {
  const r = rng(seed * 31);
  const P = [[60, 236], [14, 170], [104, 104], [58, 14]];
  const pt = (t: number) => {
    const u = 1 - t;
    const x = u ** 3 * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t ** 3 * P[3][0];
    const y = u ** 3 * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t ** 3 * P[3][1];
    const dx = 3 * u * u * (P[1][0] - P[0][0]) + 6 * u * t * (P[2][0] - P[1][0]) + 3 * t * t * (P[3][0] - P[2][0]);
    const dy = 3 * u * u * (P[1][1] - P[0][1]) + 6 * u * t * (P[2][1] - P[1][1]) + 3 * t * t * (P[3][1] - P[2][1]);
    return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
  };
  return (
    <svg viewBox="0 0 120 250" className={className} style={{ ...style, ...(flip ? { scale: '-1 1' } : null) }} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round">
      <path d={`M${P[0]} C${P[1]} ${P[2]} ${P[3]}`} />
      {Array.from({ length: leaves }, (_, i) => {
        const t = 0.12 + (i / leaves) * 0.8;
        const p = pt(t);
        const L = 30 - t * 14 + r() * 5;
        return [1, -1].map((s) => (
          <g key={`${i}${s}`} transform={`translate(${p.x} ${p.y}) rotate(${p.a + s * (48 + r() * 14)})`}>
            <path d={`M0 0 Q${L * 0.5} ${-L * 0.3} ${L} 0 Q${L * 0.5} ${L * 0.3} 0 0Z`} fill="currentColor" fillOpacity=".08" />
            <path d={`M2 0 L${L * 0.85} 0`} strokeWidth=".5" />
          </g>
        ));
      })}
      <circle cx={P[3][0]} cy={P[3][1] - 4} r="3.2" fill="currentColor" fillOpacity=".15" />
    </svg>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth=".8">
      <path d="M0 12H96M144 12H240" />
      <path d="M120 3C128 8 128 16 120 21C112 16 112 8 120 3Z" fill="currentColor" fillOpacity=".12" />
      <path d="M104 12C98 7 92 7 88 10M136 12C142 7 148 7 152 10" />
      <circle cx="120" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function Monogram({ a, b }: { a: string; b: string }) {
  const leaves = Array.from({ length: 11 }, (_, i) => (i / 10) * 150 - 75);
  return (
    <svg viewBox="-120 -120 240 240" className="br-mono" role="img" aria-label={`Monogram ${a} and ${b}`}>
      <g fill="none" stroke="currentColor" strokeWidth=".8">
        <circle r="84" /><circle r="79" strokeOpacity=".5" />
        {[1, -1].map((s) =>
          leaves.map((ang, i) => (
            <g key={`${s}${i}`} transform={`scale(${s} 1) rotate(${ang + 90}) translate(0 -101)`}>
              <path d="M0 0Q6-9 0-20Q-6-9 0 0Z" fill="currentColor" fillOpacity=".1" transform="rotate(26)" />
            </g>
          )),
        )}
      </g>
      <text x="-6" y="14" textAnchor="end" className="br-mono__t">{a}</text>
      <text x="0" y="10" textAnchor="middle" className="br-mono__amp">&amp;</text>
      <text x="6" y="14" textAnchor="start" className="br-mono__t">{b}</text>
    </svg>
  );
}
