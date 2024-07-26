import React, { useState } from "react";

const AddToPlaylistButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddToPlaylist = (playlistId) => {
    console.log(`Track added to playlist ${playlistId}`);
    setShowModal(false);
  };

  const handleCreateNewPlaylist = () => {
    console.log("New playlist created and track added");
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Add to Playlist</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Select Playlist</h2>
            <ul>
              <li onClick={() => handleAddToPlaylist(1)}>Playlist 1</li>
              <li onClick={() => handleAddToPlaylist(2)}>Playlist 2</li>
              <li onClick={() => handleAddToPlaylist(3)}>Playlist 3</li>
              <li onClick={handleCreateNewPlaylist}>+ Create New Playlist</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToPlaylistButton;
