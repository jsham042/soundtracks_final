import React from 'react';
import './SavedTracks.css';
import TrackList from '../TrackList/TrackList.js';

class SavedTracks extends React.Component {
  render() {
    const { savedTracks, onAdd, onToggle, currentTrack } = this.props;
    
    return (
      <div className="SavedTracks">
        {savedTracks.length > 0 && <h2>Saved Songs</h2>}
        <TrackList 
          tracks={savedTracks}
          onAdd={onAdd}
          onToggle={onToggle}
          currentTrack={currentTrack}
          isRemoval={false}
        />
      </div>
    );
  }
}

export default SavedTracks;