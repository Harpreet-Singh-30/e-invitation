import type { CSSProperties } from 'react';
import { CornerStep, Sunburst } from './Deco';

interface HeroProps {
  first: string;
  second: string;
  tagline?: string;
  image?: string;
  dateLine?: string;
  venueLine?: string;
}

function nameScale(...names: string[]): number {
  const longest = Math.max(...names.map((n) => Array.from(n).length), 1);
  return Math.min(1, 8 / longest);
}

export function Hero({ first, second, tagline, image, dateLine, venueLine }: HeroProps) {
  const style = { '--ih-name-scale': nameScale(first, second) } as CSSProperties;
  return (
    <section className="adn-hero" data-section="top" aria-labelledby="adn-hero-title" style={style}>
      <CornerStep className="adn-hero__corner adn-hero__corner--tl" />
      <CornerStep className="adn-hero__corner adn-hero__corner--tr" />
      <CornerStep className="adn-hero__corner adn-hero__corner--bl" />
      <CornerStep className="adn-hero__corner adn-hero__corner--br" />

      <p className="adn-label adn-hero__intro">The wedding of</p>

      <div className="adn-arch">
        <span className="adn-arch__line adn-arch__line--3" aria-hidden="true" />
        <span className="adn-arch__line adn-arch__line--2" aria-hidden="true" />
        <span className="adn-arch__line adn-arch__line--1" aria-hidden="true" />
        <div className="adn-arch__window">
          {image ? (
            <img className="adn-arch__photo" src={image} alt="" decoding="async" />
          ) : (
            <Sunburst className="adn-arch__fan" rays={21} rings={[12, 26, 46, 72, 98]} innerRadius={12} />
          )}
          <span className="adn-arch__scrim" aria-hidden="true" />
        </div>
        <h1 id="adn-hero-title" className="adn-hero__names" aria-label={`${first} and ${second}`} tabIndex={-1}>
          <span className="adn-hero__name" aria-hidden="true">{first}</span>
          <span className="adn-hero__amp" aria-hidden="true">&amp;</span>
          <span className="adn-hero__name" aria-hidden="true">{second}</span>
        </h1>
      </div>

      {tagline ? <p className="adn-hero__tagline">{tagline}</p> : null}

      {dateLine || venueLine ? (
        <div className="adn-hero__facts">
          <p className="adn-label adn-hero__fact adn-hero__fact--left">{dateLine}</p>
          <span className="adn-diamond" aria-hidden="true" />
          <p className="adn-label adn-hero__fact adn-hero__fact--right">{venueLine}</p>
        </div>
      ) : null}
    </section>
  );
}
