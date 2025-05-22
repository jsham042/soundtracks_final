import React from 'react';
import './PlaylistSelector.css';

const PlaylistSelector = ({ playlists, onSelect, selectedPlaylistId }) => {
  const handleChange = (event) => {
    const playlistId = event.target.value;
    onSelect(playlistId === '' ? null : playlistId);
  };

  return (
    <div className="PlaylistSelector">
      <select 
        value={selectedPlaylistId || ''} 
        onChange={handleChange}
      >
        <option value="">-- Select Existing Playlist --</option>
        {playlists && playlists.map(playlist => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PlaylistSelector;