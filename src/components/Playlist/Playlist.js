import React from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList.js";

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistName: props.playlistName, // add this line
      albumArt: props.albumArt,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }


render() {
    return (
      <div className="Playlist">
        <div className="Playlist-album">
          <img src={this.state.albumArt} width="200" alt="AI Generated Image" />
          <div className="Playlist-info">
            <input
              value={this.state.playlistName}
              onChange={this.handleNameChange}
            />
            <img className='spotifyLogo' src={"./spotify-logo.png"} alt="Spotify Logo" />
            <button className="Playlist-save" onClick={this.props.onSave}>
              SAVE TO SPOTIFY
            </button>
          </div>
        </div>
        <TrackList
          tracks={this.props.playlistTracks}
          isRemoval={true}
          onRemove={this.props.onRemove}
          onToggle={this.props.onToggle}
          currentTrack={this.props.currentTrack}
        />
      </div>
    );
  }
}

export default Playlist;

