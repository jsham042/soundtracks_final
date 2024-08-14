import React from "react";
import "./Playlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPencil, faCheck, faSync } from "@fortawesome/free-solid-svg-icons";
import TrackList from "../TrackList/TrackList.js";

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.state = {
      loadingPlaylistName: false,
      loadingAlbumArt: false,
      showNameEditor: false,
    };
    this.handleShowNameEditor = this.handleShowNameEditor.bind(this);
    this.inputRef = React.createRef();
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  handleShowNameEditor() {
    this.setState(prevState => ({ 
      showNameEditor: !prevState.showNameEditor 
    }), () => {
      if (this.state.showNameEditor && this.inputRef.current) {
        this.inputRef.current.focus();
        this.inputRef.current.select();
      }
    });
    if (this.props.playlistName === "") {
      this.props.onNameChange("My Playlist");
    }
  }

  render() {
    return (
      <div className="Playlist">
        <div className="Playlist-header">
          {this.props.loadingAlbumArt ? (
            <div className="Fetching-sign">
              <FontAwesomeIcon icon={faSpinner} spin />
              {" "}
              Generating Album Art...
            </div>
          ) : (
            <div className="Playlist-album-container" onClick={this.props.onRegenerateAlbumArt}>
              <img className="Playlist-album" src={this.props.albumArt} width="200" alt="AI Generated Image" />
              <div className="Playlist-album-overlay">
                <span style={{ fontSize: "1rem", fontWeight: "bold", textAlign: "center" }}>Regenerate artwork</span>
              </div>
            </div>
          )}
          <div className="Playlist-info">
            <div className="playlist-name">
              {this.state.showNameEditor ? (
                <input
                  ref={this.inputRef}
                  className="edit-playlist-name"
                  onChange={this.handleNameChange}
                  value={this.props.playlistName}
                  onBlur={this.handleShowNameEditor}
                />
              ) : (
                <p>{this.props.playlistName}</p>
              )}
              <FontAwesomeIcon
                icon={this.state.showNameEditor ? faCheck : faPencil}
                className="edit-button"
                onClick={this.handleShowNameEditor}
              />
            </div>
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