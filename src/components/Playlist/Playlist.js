import React from "react";
import "./Playlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPencil, faCheck } from "@fortawesome/free-solid-svg-icons";
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
              Fetching album art...
            </div>
          ) : (
            <img className="Playlist-album" src={this.props.albumArt} width="200" alt="AI Generated Image" />
          )}
          <div className="Playlist-info">
            <div>
              {! this.state.showNameEditor ? (
                <div className='playlist-name'>
                  <p style={{marginTop: '0rem', padding: '0rem'}}>
                    {this.props.playlistName}
                  </p>
                  <div className='edit-button' onClick={this.handleShowNameEditor}>
                    <FontAwesomeIcon icon={faPencil} />
                  </div>
                </div>
              ) : (
              <div className='playlist-name'>
                <input
                  ref={this.inputRef}
                  className="edit-playlist-name"
                  value={this.props.playlistName}
                  onChange={this.handleNameChange}
                  onBlur={this.handleShowNameEditor}
                />
                <div className='edit-button' onClick={this.handleShowNameEditor}>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                </div>
              )}

            </div>
           
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