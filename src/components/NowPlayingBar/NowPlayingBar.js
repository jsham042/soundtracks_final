import React, { useState, useEffect, useContext, useRef } from "react";
import { CurrentTrackContext } from "../../contexts/CurrentTrackContext";

const NowPlayingBar = () => {
  const [songDetails, setSongDetails] = useState({
    title: "Unknown Title",
    artist: "Unknown Artist",
    album: "Unknown Album",
    artwork: "",
    duration: 0,
    currentTime: 0,
    isPlaying: false,
  });

  const currentTrack = useContext(CurrentTrackContext);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (currentTrack) {
      setSongDetails((prevDetails) => ({
        ...prevDetails,
        title: currentTrack.name,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: currentTrack.artwork,
        duration: currentTrack.duration,
        currentTime: prevDetails.currentTime, // Preserve current time on track change
        isPlaying: prevDetails.isPlaying,
      }));
    }
  }, [currentTrack]);

  useEffect(() => {
    if (songDetails.isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [songDetails.isPlaying]);

  useEffect(() => {
    audioRef.current.src = currentTrack ? currentTrack.preview_url : "";
    audioRef.current.load();

    const handleTimeUpdate = () => {
      setSongDetails((prevDetails) => ({
        ...prevDetails,
        currentTime: audioRef.current.currentTime,
      }));
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentTrack]);

  const handlePlayPause = () => {
    setSongDetails((prevDetails) => ({
      ...prevDetails,
      isPlaying: !prevDetails.isPlaying,
    }));
  };

  const handleNext = () => {
    // Logic to skip to the next song
    // This should update the `currentTrack` context
    // Placeholder for context update logic
  };

  const handlePrevious = () => {
    // Logic to go to the previous song
    // This should update the `currentTrack` context
    // Placeholder for context update logic
  };

  const updateProgress = (time) => {
    setSongDetails({ ...songDetails, currentTime: time });
    audioRef.current.currentTime = time;
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
        <button onClick={handlePrevious} aria-label="Play previous track">
          Previous
        </button>
        <button
          onClick={handlePlayPause}
          aria-label={songDetails.isPlaying ? "Pause" : "Play"}
        >
          {songDetails.isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={handleNext} aria-label="Play next track">
          Next
        </button>
      </div>
      <div className="progress-tracker">
        <input
          type="range"
          min="0"
          max={songDetails.duration}
          value={songDetails.currentTime}
          onChange={(e) => updateProgress(e.target.value)}
          aria-label="Song progress"
          aria-valuemin={0}
          aria-valuemax={songDetails.duration}
          aria-valuenow={songDetails.currentTime}
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
