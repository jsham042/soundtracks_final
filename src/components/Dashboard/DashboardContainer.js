import React, { useState, useEffect } from "react";

const DashboardContainer = () => {
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = () => {
    const storedPlaylists = JSON.parse(localStorage.getItem("playlists")) || [];
    setPlaylists(storedPlaylists);
  };

  const savePlaylists = (updatedPlaylists) => {
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    setPlaylists(updatedPlaylists);
  };

  const handleDeletePlaylist = (id) => {
    const updatedPlaylists = playlists.filter((playlist) => playlist.id !== id);
    savePlaylists(updatedPlaylists);
  };

  const handleEditPlaylist = (id, newName) => {
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === id) {
        return { ...playlist, name: newName };
      }
      return playlist;
    });
    savePlaylists(updatedPlaylists);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  const getFilteredAndSortedPlaylists = () => {
    const filteredPlaylists = playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return filteredPlaylists.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search playlists..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <select
        value={sortOrder}
        onChange={(e) => handleSortOrderChange(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <div>
        {getFilteredAndSortedPlaylists().map((playlist) => (
          <div key={playlist.id}>
            <h3>{playlist.name}</h3>
            <button onClick={() => handleEditPlaylist(playlist.id, "New Name")}>
              Edit
            </button>
            <button onClick={() => handleDeletePlaylist(playlist.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContainer;
