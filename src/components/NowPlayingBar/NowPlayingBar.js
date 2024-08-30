import React, { useState, useEffect, useContext } from "react";
import { CurrentTrackContext } from "../../contexts/CurrentTrackContext";

const NowPlayingBar = () => {
  const [songDetails, setSongDetails] = useState({
    title: "Unknown Title",
    artist: "Unknown Artist",
    album: "Unknown Album",
    artwork: "",
    duration: 0,
    currentTime: 0,
  });

  const currentTrack = useContext(CurrentTrackContext);

  useEffect(() => {
    if (currentTrack) {
      setSongDetails({
        title: currentTrack.name,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: currentTrack.artwork,
        duration: currentTrack.duration,
        currentTime: songDetails.currentTime, // Preserve current time on track change
      });
    }
  }, [currentTrack]);

  const handlePlayPause = () => {
    // Logic to play or pause the song
    // This should toggle the play state and possibly update the `currentTime`
  };

  const handleNext = () => {
    // Logic to skip to the next song
    // This should update the `currentTrack` context
  };

  const handlePrevious = () => {
    // Logic to go to the previous song
    // This should update the `currentTrack` context
  };

  const updateProgress = (time) => {
    setSongDetails({ ...songDetails, currentTime: time });
  };

  return (
    <div className="now-playing-bar">
      <div className="song-details">
        <img
          src={songDetails.artwork}
          alt="album artwork"
          className="album-artwork"
        />
        <div className="song-info">
          <span className="song-title">{songDetails.title}</span>
          <span className="song-artist">{songDetails.artist}</span>
          <span className="song-album">{songDetails.album}</span>
        </div>
      </div>
      <div className="playback-controls">
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handlePlayPause}>Play/Pause</button>
        <button onClick={handleNext}>Next</button>
      </div>
      <div className="progress-tracker">
        <input
          type="range"
          min="0"
          max={songDetails.duration}
          value={songDetails.currentTime}
          onChange={(e) => updateProgress(e.target.value)}
        />
        <div className="time-info">
          {Math.floor(songDetails.currentTime / 60)}:
          {Math.floor(songDetails.currentTime % 60)
            .toString()
            .padStart(2, "0")}{" "}
          /{Math.floor(songDetails.duration / 60)}:
          {Math.floor(songDetails.duration % 60)
            .toString()
            .padStart(2, "0")}
        </div>
      </div>
    </div>
  );
};

export default NowPlayingBar;
