import React from "react";

import "./TrackList.css";

import Track from "../Track/Track.js";

import Spotify from "../../util/Spotify.js";

class TrackList extends React.Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.tracks.map((track) => {
          return (
            <Track
              track={track}
              key={track.id}
              onAdd={this.props.onAdd}
              isRemoval={this.props.isRemoval}
              onRemove={this.props.onRemove}
              onToggle={this.props.onToggle}
              currentTrack={this.props.currentTrack}
            />
          );
        })}
      </div>
    );
  }
}

export default TrackList;
