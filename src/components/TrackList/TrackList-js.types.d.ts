// Derived from src/components/TrackList/TrackList.js

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  uri: string;
}

export interface TrackListProps {
  tracks: Track[];
  onAdd: (track: Track) => void;
  isRemoval: boolean;
  onRemove: (track: Track) => void;
  onToggle: (track: Track) => void;
  currentTrack: Track | null;
}
