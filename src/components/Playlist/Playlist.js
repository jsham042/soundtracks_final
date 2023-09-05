import React from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList.js";

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistName: props.playlistName, // add this line
      albumArt: props.albumArt,
      playlistLink: props.playlistLink,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.checkArtwork = this.checkArtwork.bind(this);
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  checkArtwork(image) {
    const originalArtwork = 'url_to_original_artwork';
    if (image !== originalArtwork) {
      this.setState({ albumArt: originalArtwork });
    }
  }

render() {
    this.checkArtwork(this.state.albumArt);
    return (
      <div className="Playlist">
        <div className="Playlist-album">
          <img src={this.state.albumArt} width="200" alt="AI Generated Image" />
          <div className="Playlist-info">
            <input
              value={this.state.playlistName}
              onChange={this.handleNameChange}
            />
            <button className="Playlist-save" onClick={this.props.onSave}>
              SAVE TO SPOTIFY
            </button>
            <a
              href={this.state.playlistLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="spotify-logo.png" alt="Spotify Logo" />
            </a>
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

