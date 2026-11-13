import { useId } from 'react';

/** Original vector ornaments for Coastal Pearl. All colours come from CSS variables. */

export function Pearl({ size = 18, className = '' }: { size?: number; className?: string }) {
  const id = useId();
  return (
    <svg className={`ih-pearl ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="34%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#F9F7F0" />
          <stop offset="100%" stopColor="#d9d0bb" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10.5" fill={`url(#${id})`} stroke="rgba(197,164,109,.55)" strokeWidth=".6" />
      <ellipse cx="8.6" cy="8" rx="3" ry="1.6" fill="#fff" opacity=".85" transform="rotate(-32 8.6 8)" />
    </svg>
  );
}

export function PearlStrand({ count = 9, className = '' }: { count?: number; className?: string }) {
  const id = useId();
  const w = 360;
  const pts = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const x = 14 + t * (w - 28);
    const y = 8 + 26 * 4 * t * (1 - t);
    const r = 4.5 + 5.5 * Math.sin(Math.PI * t);
    return { x, y, r };
  });
  return (
    <svg className={`ih-strand ${className}`} viewBox={`0 0 ${w} 56`} aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="34%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="50%" stopColor="#F9F7F0" />
          <stop offset="100%" stopColor="#d6cdb8" />
        </radialGradient>
      </defs>
      <path d={`M14 8 Q${w / 2} 60 ${w - 14} 8`} fill="none" stroke="var(--ih-champagne)" strokeWidth=".8" opacity=".7" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={p.r} fill={`url(#${id})`} stroke="rgba(197,164,109,.5)" strokeWidth=".5" />
          <ellipse cx={p.x - p.r * 0.3} cy={p.y - p.r * 0.35} rx={p.r * 0.32} ry={p.r * 0.18} fill="#fff" opacity=".8" />
        </g>
      ))}
    </svg>
  );
}

/** Shell-inspired fan: fine radiating lines and soft growth rings, deliberately abstract. */
export function ShellFan({ className = '' }: { className?: string }) {
  const rays = Array.from({ length: 19 }, (_, i) => {
    const a = Math.PI + (i / 18) * Math.PI;
    return { x: 100 + Math.cos(a) * 88, y: 96 + Math.sin(a) * 88 };
  });
  return (
    <svg className={`ih-fan ${className}`} viewBox="0 0 200 110" aria-hidden="true" fill="none" stroke="var(--ih-champagne)" strokeLinecap="round">
      {rays.map((r, i) => (
        <path key={i} d={`M100 96 Q${(100 + r.x) / 2 + (i - 9) * 0.6} ${(96 + r.y) / 2 - 4} ${r.x} ${r.y}`} strokeWidth=".6" opacity=".8" />
      ))}
      {[28, 46, 64, 88].map((r, i) => (
        <path key={r} d={`M${100 - r} 96 A${r} ${r} 0 0 1 ${100 + r} 96`} strokeWidth={i === 3 ? 0.9 : 0.5} opacity={0.35 + i * 0.15} />
      ))}
      <path d="M12 96 H188" strokeWidth=".6" opacity=".5" />
      <circle cx="100" cy="100" r="3.2" fill="var(--ih-ivory)" stroke="var(--ih-champagne)" strokeWidth=".6" />
    </svg>
  );
}

/** Fine-line coastal sprig. */
export function Sprig({ className = '' }: { className?: string }) {
  const leaves = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    const y = 276 - t * 244;
    const x = 60 + Math.sin(t * 3.2) * 7;
    const s = 1 - t * 0.55;
    return { x, y, s };
  });
  const leaf = (x: number, y: number, s: number, dir: 1 | -1) =>
    `M${x} ${y} C${x + dir * 14 * s} ${y - 3 * s}, ${x + dir * 27 * s} ${y - 14 * s}, ${x + dir * 36 * s} ${y - 32 * s} C${x + dir * 19 * s} ${y - 28 * s}, ${x + dir * 6 * s} ${y - 15 * s}, ${x} ${y}Z`;
  return (
    <svg className={`ih-sprig ${className}`} viewBox="0 0 120 300" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 296 C57 200 71 118 60 22" strokeWidth="1" />
      {leaves.map((l, i) => (
        <g key={i} strokeWidth=".8">
          <path d={leaf(l.x, l.y, l.s, -1)} fill="currentColor" fillOpacity=".08" />
          <path d={leaf(l.x, l.y - 9 * l.s, l.s * 0.92, 1)} fill="currentColor" fillOpacity=".08" />
        </g>
      ))}
      <circle cx="60" cy="18" r="3" fill="currentColor" fillOpacity=".15" strokeWidth=".8" />
    </svg>
  );
}

/** Fine-line palm-like frond used as botanical frame. */
export function Frond({ className = '' }: { className?: string }) {
  const P0 = { x: 10, y: 196 };
  const P1 = { x: 150, y: -14 };
  const P2 = { x: 292, y: 118 };
  const n = 30;
  const strokes = Array.from({ length: n - 3 }, (_, k) => {
    const i = k + 2;
    const t = i / n;
    const px = (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x;
    const py = (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y;
    const tx = 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
    const ty = 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
    const tl = Math.hypot(tx, ty);
    const nx = -ty / tl;
    const ny = tx / tl;
    const L = 12 + 52 * Math.sin(Math.PI * Math.min(1, t * 1.04));
    return [-1, 1].map((s) => {
      const ex = px + nx * s * L + (tx / tl) * L * 0.55;
      const ey = py + ny * s * L + (ty / tl) * L * 0.55 + L * 0.28;
      const qx = px + nx * s * L * 0.5 + (tx / tl) * L * 0.2;
      const qy = py + ny * s * L * 0.5 + (ty / tl) * L * 0.2 + L * 0.06;
      return `M${px.toFixed(1)} ${py.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    });
  });
  return (
    <svg className={`ih-frond ${className}`} viewBox="0 0 300 200" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d={`M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`} strokeWidth="1.1" />
      {strokes.flat().map((d, i) => (
        <path key={i} d={d} strokeWidth=".7" />
      ))}
    </svg>
  );
}

export function Monogram({ a, b }: { a: string; b: string }) {
  return (
    <svg className="ih-monogram" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="none" stroke="var(--ih-champagne)" strokeWidth=".8" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--ih-champagne)" strokeWidth=".4" strokeDasharray="1 3.2" />
      <text x="60" y="58" textAnchor="middle" className="ih-monogram__t">
        {a}
        <tspan className="ih-monogram__amp" dx="3">
          &amp;
        </tspan>
        <tspan dx="3">{b}</tspan>
      </text>
      <circle cx="60" cy="82" r="3" fill="var(--ih-ivory)" stroke="var(--ih-champagne)" strokeWidth=".7" />
    </svg>
  );
}

function wave(amp: number, base: number) {
  let d = `M0 ${base}`;
  for (let k = 0; k < 8; k++) {
    const x = k * 300;
    d += ` Q${x + 150} ${base + (k % 2 ? amp : -amp) * 2} ${x + 300} ${base}`;
  }
  return `${d} L2400 200 L0 200Z`;
}

/** Layered, gently drifting waves. `tone` picks the layer colours. */
export function Waves({ tone = 'ivory', className = '' }: { tone?: 'ivory' | 'deep' | 'sand'; className?: string }) {
  return (
    <div className={`ih-waves ih-waves--${tone} ${className}`} aria-hidden="true">
      <svg className="ih-wave ih-wave--1" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d={wave(26, 90)} />
      </svg>
      <svg className="ih-wave ih-wave--2" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d={wave(20, 118)} />
      </svg>
      <svg className="ih-wave ih-wave--3" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d={wave(14, 146)} />
      </svg>
    </div>
  );
}
