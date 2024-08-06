// Derived from src/components/Track/Track.js

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  genre: string;
  image: string;
  preview_url: string;
}

export interface TrackProps {
  track: Track;
  currentTrack: Track | null;
  isRemoval: boolean;
  onAdd: (track: Track) => void;
  onRemove: (track: Track) => void;
  onToggle: (track: Track) => void;
}

export interface TrackState {

  // Currently, the Track component does not maintain its own state.
  // If state properties are needed in the future, they should be defined here.
}
