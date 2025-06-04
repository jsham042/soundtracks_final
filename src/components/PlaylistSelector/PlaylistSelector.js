import React from 'react';
import './PlaylistSelector.css';

class PlaylistSelector extends React.Component {
  render() {
    const { playlists, onSelect, onClose } = this.props;
    
    return (
      <div className="selector-overlay">
        <div className="selector-panel">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Select a Playlist</h2>
          {playlists.length === 0 ? (
            <div className="no-playlists">
              <p>No playlists found</p>
            </div>
          ) : (
            playlists.map(playlist => (
              <div 
                key={playlist.id} 
                className="playlist-item" 
                onClick={() => onSelect(playlist)}
              >
                {playlist.image ? (
                  <img 
                    src={playlist.image} 
                    alt={playlist.name} 
                    className="playlist-image" 
                  />
                ) : (
                  <div className="playlist-image-placeholder"></div>
                )}
                <div className="playlist-info">
                  <span className="playlist-name">{playlist.name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default PlaylistSelector;