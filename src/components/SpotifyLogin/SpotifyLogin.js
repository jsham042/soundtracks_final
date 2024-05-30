import React from 'react';
import { initiateSpotifyLogin } from '../../SpotifyAuth';
import './SpotifyLogin.css'; // Assuming you have a CSS file for styling

const SpotifyLogin = () => {
  const handleLogin = () => {
    initiateSpotifyLogin();
  };

  return (
    <div className="spotify-login-container">
      <h1>Welcome to Spotify</h1>
      <button onClick={handleLogin} className="login-button">
        Log in with Spotify
      </button>
    </div>
  );
};

export default SpotifyLogin;