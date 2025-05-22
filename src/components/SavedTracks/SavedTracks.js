import React from 'react';
import './SavedTracks.css';
import TrackList from '../TrackList/TrackList.js';

class SavedTracks extends React.Component {
  render() {
    // If there are no saved tracks, render a placeholder or nothing
    if (!this.props.savedTracks || this.props.savedTracks.length === 0) {
      return <div className="SavedTracks empty">No saved tracks yet</div>;
    }

    return (
      <div className="SavedTracks">
        <h1>Saved Tracks</h1>
        <TrackList
          tracks={this.props.savedTracks}
          onAdd={this.props.onAdd}
          onToggle={this.props.onToggle}
          currentTrack={this.props.currentTrack}
          isRemoval={false}
          extraButton={(track) => (
            <button 
              className="Track-action secondary" 
              onClick={(e) => {
                e.stopPropagation();
                this.props.onRemoveSaved(track);
              }}
            >
              Remove
            </button>
          )}
        />
      </div>
    );
  }
}

export default SavedTracks;