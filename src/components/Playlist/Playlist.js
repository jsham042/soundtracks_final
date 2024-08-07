import React from "react";
import "./Playlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import TrackList from "../TrackList/TrackList.js";

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.state = {
      loadingPlaylistName: false,
      loadingAlbumArt: false,
    };
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  render() {
    return (
      <div className="Playlist">
        <div className="Playlist-header">
          {this.props.loadingAlbumArt ? (
            <div className="Fetching-sign">
              <FontAwesomeIcon icon={faSpinner} spin />
              {" "}
              Fetching album art...
            </div>
          ) : (
            <img className="Playlist-album" src={this.props.albumArt} width="200" alt="AI Generated Image" />
          )}
          <div className="Playlist-info">
            <input style={{marginTop: '0rem', padding: '0rem'}}
              value={this.props.playlistName}
              onChange={this.handleNameChange}
            />
            
            <button className="Playlist-save" onClick={this.props.onSave}>
              SAVE TO <img className='spotifyLogo' src={"./512px-Black_Spotify_logo_with_text.svg.png"} alt="Spotify Logo" />
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