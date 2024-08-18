import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = () => {
    const storedPlaylists = localStorage.getItem("playlists");
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists));
    }
  };

  const handleEdit = (index) => {
    const newTitle = prompt(
      "Enter the new title for your playlist:",
      playlists[index].title,
    );
    if (newTitle) {
      const updatedPlaylists = [...playlists];
      updatedPlaylists[index].title = newTitle;
      setPlaylists(updatedPlaylists);
      localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    }
  };

  const handleDelete = (index) => {
    const updatedPlaylists = playlists.filter((_, i) => i !== index);
    setPlaylists(updatedPlaylists);
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
  };

  return (
    <div>
      <h1>Playlist Dashboard</h1>
      <ul>
        {playlists.map((playlist, index) => (
          <li key={index}>
            {playlist.title}
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
