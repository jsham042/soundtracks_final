import React from 'react';
import Track from '../Track/Track';
import './TrackList.css';
import type { TrackListProps } from './TrackList-js.types';

class TrackList extends React.Component<TrackListProps> {
  render() {
    return (
      <div className="TrackList">
        {
          this.props.tracks.map(track => {
            return <Track track={track}
                          key={track.id}
                          onAdd={this.props.onAdd}
                          isRemoval={this.props.isRemoval}
                          onRemove={this.props.onRemove}
                          onToggle={this.props.onToggle}
                          currentTrack={this.props.currentTrack}/>
          })
        }
      </div>
    );
  }
}

export default TrackList;
