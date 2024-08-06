// Derived from src/components/Playlist/Playlist.js

export type PlaylistProps = {
  albumArt: string;
  playlistName: string;
  playlistTracks: Track[];
  onNameChange: (name: string) => void;
  onSave: () => void;
  onRemove: (track: Track) => void;
  onToggle: (track: Track) => void;
  currentTrack: Track | null;
};

export type Track = {
  id: string;
  name: string;
  artist: string;
  album: string;
  uri: string;
};
