import React from 'react';
import TrackList from '../TrackList/TrackList.js';
import './SavedTracks.css';

class SavedTracks extends React.Component {
  render() {
    return (
      <div className="SavedTracks">
        <h2>Saved Songs</h2>
        
        {this.props.savedTracks.length === 0 ? (
          <p className="saved-tracks-placeholder">
            No songs saved yet – when you save or clear a playlist the songs will appear here.
          </p>
        ) : (
          <TrackList
            tracks={this.props.savedTracks}
            onAdd={this.props.onAdd}
            onToggle={this.props.onToggle}
            currentTrack={this.props.currentTrack}
          />
        )}
      </div>
    );
  }
}

export default SavedTracks;