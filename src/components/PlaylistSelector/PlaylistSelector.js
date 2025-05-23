import React, { useState, useEffect } from 'react';

const PlaylistSelector = ({ playlists, onSelect, selectedId }) => {
  const [currentSelection, setCurrentSelection] = useState(selectedId || '');

  // Update currentSelection when selectedId prop changes
  useEffect(() => {
    setCurrentSelection(selectedId || '');
  }, [selectedId]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setCurrentSelection(selectedValue);
    
    // Find the selected playlist object
    const selectedPlaylist = playlists.find(playlist => playlist.id === selectedValue);
    
    // Call onSelect with the entire playlist object
    if (selectedPlaylist) {
      onSelect(selectedPlaylist);
    }
  };

  return (
    <div className="PlaylistSelector">
      <select 
        value={currentSelection} 
        onChange={handleChange}
      >
        <option value="">Select a playlist</option>
        {playlists.map(playlist => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PlaylistSelector;