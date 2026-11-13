import { useEffect, useRef, useState } from 'react';
import type { Track } from '../lib/tracks';

/** Click-to-play soundtrack. Never autoplays; playback only starts from this button. */
export function MusicToggle({ track }: { track: Track }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = audio.current;
    return () => {
      if (node) node.pause();
    };
  }, []);

  const toggle = () => {
    const node = audio.current;
    if (!node) return;
    if (playing) {
      node.pause();
      setPlaying(false);
      return;
    }
    node.volume = 0.6;
    const attempt = node.play();
    if (attempt && typeof attempt.then === 'function') {
      attempt
        .then(() => {
          setFailed(false);
          setPlaying(true);
        })
        .catch(() => {
          setFailed(true);
          setPlaying(false);
        });
    } else {
      setPlaying(true);
    }
  };

  const label = failed ? 'Soundtrack unavailable' : playing ? 'Pause soundtrack' : 'Play soundtrack';
  return (
    <div className="adn-music">
      <audio ref={audio} src={track.src} loop preload="none" onEnded={() => setPlaying(false)} />
      <button type="button" className="adn-music__button" onClick={toggle} aria-pressed={playing} title={track.title}>
        <span className={`adn-eq${playing ? ' is-playing' : ''}`} aria-hidden="true">
          <i /><i /><i /><i />
        </span>
        <span className="adn-music__text">{label}</span>
      </button>
    </div>
  );
}
