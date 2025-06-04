import React from 'react';
import './PreviousTracks.css';
import TrackList from '../TrackList/TrackList';

class PreviousTracks extends React.Component {
  render() {
    // If tracks array is empty, render nothing
    if (!this.props.tracks || this.props.tracks.length === 0) {
      return null;
    }

    // Otherwise render the component with heading and TrackList
    return (
      <div className="PreviousTracks">
        <h2>Previously Added Tracks</h2>
        <TrackList 
          tracks={this.props.tracks}
          onAdd={this.props.onAdd}
          onToggle={this.props.onToggle}
          currentTrack={this.props.currentTrack}
          isRemoval={false}
        />
      </div>
    );
  }
}

export default PreviousTracks;