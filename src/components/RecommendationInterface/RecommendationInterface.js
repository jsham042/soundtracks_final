import React, { useState, useEffect } from "react";

const RecommendationInterface = () => {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    fetchRecommendedTracks();
  }, []);

  const fetchRecommendedTracks = async () => {
    try {
      const response = await fetch("/api/recommendations");
      const data = await response.json();
      setTracks(data.tracks);
    } catch (error) {
      console.error("Failed to fetch tracks", error);
    }
  };

  const addToPlaylist = (track) => {
    setPlaylist([...playlist, track]);
  };

  const removeFromPlaylist = (trackId) => {
    setPlaylist(playlist.filter((track) => track.id !== trackId));
  };

  return (
    <div className="recommendation-interface">
      <h2>Recommended Tracks</h2>
      <div className="tracks">
        {tracks.map((track) => (
          <div key={track.id} className="track">
            <h3>{track.name}</h3>
            <p>{track.artist}</p>
            <button onClick={() => addToPlaylist(track)}>
              Add to Playlist
            </button>
          </div>
        ))}
      </div>
      <h2>Your Playlist</h2>
      <div className="playlist">
        {playlist.map((track) => (
          <div key={track.id} className="playlist-track">
            <h3>{track.name}</h3>
            <p>{track.artist}</p>
            <button onClick={() => removeFromPlaylist(track.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationInterface;
