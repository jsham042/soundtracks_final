import React from "react";
import SearchBar from "../SearchBar/SearchBar.js";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  return (
    <div className="LoginPage">
      <div className="App-logo">
        <img src="/djboticon.png" alt="App Logo" />
      </div>
      <h1>
        SOUND<span className="highlight">TRACKS</span>
      </h1>
      <p className="subtitle">
        Get music to perfectly match the vibe you're going for
      </p>
      <SearchBar style={{ color: "green" }} />
      <button className="login-button" onClick={onLogin}>
        Connect Your Spotify Account
      </button>
      <p className="disclaimer">
        *You need a Spotify Premium account to use this app
      </p>
    </div>
  );
};
export default LoginPage;
