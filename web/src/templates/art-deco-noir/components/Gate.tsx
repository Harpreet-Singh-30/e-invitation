import { useEffect, useRef } from 'react';
import { Monogram, Sunburst } from './Deco';

interface GateProps {
  initials: [string, string];
  dateLabel: string;
  opening: boolean;
  onOpen: () => void;
}

/** Full-screen monogram opening. Two sunburst doors part when the guest opens the invitation. */
export function Gate({ initials, dateLabel, opening, onOpen }: GateProps) {
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    button.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className={`adn-gate${opening ? ' is-opening' : ''}`} role="dialog" aria-modal="true" aria-label="Invitation">
      <div className="adn-gate__door adn-gate__door--left" aria-hidden="true">
        <Sunburst className="adn-gate__fan" rays={27} rings={[8, 18, 32, 50, 72, 94]} innerRadius={8} />
      </div>
      <div className="adn-gate__door adn-gate__door--right" aria-hidden="true">
        <Sunburst className="adn-gate__fan" rays={27} rings={[8, 18, 32, 50, 72, 94]} innerRadius={8} />
      </div>
      <div className="adn-gate__center">
        <Monogram initials={initials} animate className="adn-gate__monogram" />
        {dateLabel ? <p className="adn-gate__date">{dateLabel}</p> : null}
        <button ref={button} type="button" className="adn-button" onClick={onOpen} disabled={opening}>
          <span>Open the invitation</span>
        </button>
      </div>
    </div>
  );
}
