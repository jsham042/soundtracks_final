import React from 'react';
import './PlaylistSelector.css';

class PlaylistSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
  }

  handleOverlayClick(e) {
    // Call onClose when clicking outside the modal (on the overlay)
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  }

  handleModalClick(e) {
    // Prevent clicks inside the modal from bubbling up to the overlay
    e.stopPropagation();
  }

  render() {
    const { playlists, onSelect, onClose } = this.props;

    return (
      <div className="overlay" onClick={this.handleOverlayClick}>
        <div className="modal" onClick={this.handleModalClick}>
          <div className="modal-header">
            <h2>Select a Playlist</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          
          {playlists && playlists.length > 0 ? (
            <ul className="playlist-list">
              {playlists.map((playlist) => (
                <li 
                  key={playlist.id} 
                  className="playlist-item" 
                  onClick={() => onSelect(playlist)}
                >
                  {playlist.image ? (
                    <img src={playlist.image} alt={playlist.name} />
                  ) : (
                    <div className="playlist-image-placeholder"></div>
                  )}
                  <span className="playlist-name">{playlist.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-playlists">
              <p>No playlists found</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default PlaylistSelector;