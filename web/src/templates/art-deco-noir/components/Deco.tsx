import type { CSSProperties } from 'react';

/** Half-disc fan of rays with concentric rings. Origin is bottom-centre. */
export function Sunburst({
  rays = 17,
  rings = [16, 34, 62, 94],
  innerRadius = 16,
  className,
}: {
  rays?: number;
  rings?: number[];
  innerRadius?: number;
  className?: string;
}) {
  const outer = rings[rings.length - 1] ?? 94;
  const lines: string[] = [];
  for (let i = 0; i < rays; i += 1) {
    const a = Math.PI * (i / (rays - 1));
    const x0 = 100 + Math.cos(a) * innerRadius;
    const y0 = 100 - Math.sin(a) * innerRadius;
    const x1 = 100 + Math.cos(a) * outer;
    const y1 = 100 - Math.sin(a) * outer;
    lines.push(`M${x0.toFixed(2)} ${y0.toFixed(2)}L${x1.toFixed(2)} ${y1.toFixed(2)}`);
  }
  const arcs = rings.map((r) => `M${100 - r} 100A${r} ${r} 0 0 1 ${100 + r} 100`);
  return (
    <svg className={className} viewBox="0 0 200 100" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d={lines.join('')} vectorEffect="non-scaling-stroke" />
        {arcs.map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}

/** Symmetrical horizontal divider: stepped rules either side of a small fan. */
export function FanDivider({ className }: { className?: string }) {
  const fan: string[] = [];
  const count = 9;
  for (let i = 0; i < count; i += 1) {
    const a = Math.PI * (i / (count - 1));
    fan.push(`M${(320 + Math.cos(a) * 9).toFixed(2)} ${(40 - Math.sin(a) * 9).toFixed(2)}L${(320 + Math.cos(a) * 36).toFixed(2)} ${(40 - Math.sin(a) * 36).toFixed(2)}`);
  }
  const strokes = [
    'M20 40H272',
    'M60 33H272',
    'M112 26H272',
    'M368 40H620',
    'M368 33H580',
    'M368 26H528',
    'M284 40H356',
    'M284 40A36 36 0 0 1 356 40',
    'M311 40A9 9 0 0 1 329 40',
    fan.join(''),
  ];
  return (
    <svg className={className} viewBox="0 0 640 48" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.3">
        {strokes.map((d, i) => (
          <path key={i} className="adn-draw" pathLength={1} d={d} style={{ '--ih-i': i } as CSSProperties} />
        ))}
        <path d="M8 40l5-5 5 5-5 5z M622 40l5-5 5 5-5 5z" className="adn-fade" />
      </g>
    </svg>
  );
}

/** Stepped skyline: symmetrical bars that rise from the centre outwards. */
export function Skyline({ bars = 31 }: { bars?: number }) {
  const mid = (bars - 1) / 2;
  const steps = [58, 58, 48, 48, 38, 38, 30, 30, 22, 22, 16, 16, 10, 10, 6, 6];
  const items = Array.from({ length: bars }, (_, i) => {
    const distance = Math.abs(i - mid);
    const height = steps[Math.min(steps.length - 1, Math.round(distance))] ?? 6;
    return { i, distance, height };
  });
  return (
    <div className="adn-skyline" aria-hidden="true">
      {items.map(({ i, distance, height }) => (
        <i key={i} style={{ '--ih-h': `${height}px`, '--ih-d': `${Math.round(distance * 38)}ms` } as CSSProperties} />
      ))}
    </div>
  );
}

/** Three nested stepped squares for frame corners. */
export function CornerStep({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <path d="M1 39V1H39" vectorEffect="non-scaling-stroke" />
        <path d="M8 39V8H39" vectorEffect="non-scaling-stroke" />
        <path d="M15 39V15H39" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

/** Hexagonal monogram. Strokes draw themselves when `animate` is true. */
export function Monogram({
  initials,
  className,
  animate = false,
}: {
  initials: [string, string];
  className?: string;
  animate?: boolean;
}) {
  const cls = animate ? 'adn-monogram is-animated' : 'adn-monogram';
  const rays: string[] = [];
  const count = 9;
  for (let i = 0; i < count; i += 1) {
    const a = Math.PI * (i / (count - 1));
    rays.push(`M${(120 + Math.cos(a) * 12).toFixed(2)} ${(98 - Math.sin(a) * 12).toFixed(2)}L${(120 + Math.cos(a) * 46).toFixed(2)} ${(98 - Math.sin(a) * 46).toFixed(2)}`);
  }
  const paths = [
    'M120 6L226 56V224L120 274L14 224V56Z',
    'M120 18L214 62V218L120 262L26 218V62Z',
    'M120 98m-46 0a46 46 0 0 1 92 0',
    rays.join(''),
    'M120 118V202',
    'M72 238H168',
    'M92 246H148',
  ];
  return (
    <svg className={`${cls}${className ? ` ${className}` : ''}`} viewBox="0 0 240 280" role="img" aria-label={`Monogram ${initials[0]} and ${initials[1]}`}>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="miter">
        {paths.map((d, i) => (
          <path key={i} className="adn-monogram__line" pathLength={1} d={d} fill={i === 0 ? '#1C1B1A' : 'none'} style={{ '--ih-i': i } as CSSProperties} />
        ))}
      </g>
      <g className="adn-monogram__letters" textAnchor="middle">
        <text x="82" y="178" className="adn-monogram__letter">{initials[0]}</text>
        <text x="158" y="178" className="adn-monogram__letter">{initials[1]}</text>
      </g>
    </svg>
  );
}
