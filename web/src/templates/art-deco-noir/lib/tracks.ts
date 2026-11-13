import overture from '../assets/audio/midnight-overture.mp3';

export interface Track {
  title: string;
  src: string;
}

/**
 * Registered soundtrack ids. Add your own entries here, or pass a direct URL
 * as `music.trackId` (anything starting with `http`, `//`, `/` or `./`).
 */
export const TRACKS: Record<string, Track> = {
  'midnight-overture': { title: 'Midnight Overture', src: overture },
};

export function resolveTrack(trackId: string | undefined): Track | null {
  if (!trackId) return null;
  const registered = TRACKS[trackId];
  if (registered) return registered;
  if (/^(https?:)?\/\//.test(trackId) || trackId.startsWith('/') || trackId.startsWith('./')) {
    return { title: 'Soundtrack', src: trackId };
  }
  return null;
}
