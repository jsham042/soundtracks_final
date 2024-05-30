import React from 'react';
import { initiateSpotifyLogin } from '../../SpotifyAuth';

const LoginButton = () => {
  const handleLogin = () => {
    initiateSpotifyLogin();
  };

  return (
    <button onClick={handleLogin}>
      Log in with Spotify
    </button>
  );
};

export default LoginButton;