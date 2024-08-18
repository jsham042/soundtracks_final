import React from "react";
import "./App.css";
import defaultAlbumArt from "./djboticon.png";
import Playlist from "../Playlist/Playlist.js";
import SearchBar from "../SearchBar/SearchBar.js";
import SearchResults from "../SearchResults/SearchResults.js";
import LoginPage from "../LoginPage/LoginPage.js";
import Spotify from "../../util/Spotify.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard.js";

import OpenAiAPIRequest, {
  generatePlaylistName,
  generateImage,
  generateAISongRecommendations,
} from "../../util/OpenAiAPIRequest.js";
import {
  faSpinner,
  faCommentAlt,
  faSearch,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: true,
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
      playlists: [], // Array to store playlists
      isFetching: false,
      searchState: true,
      albumArt: defaultAlbumArt,
      currentTrack: null,
      spotifyUsername: null,
      spotifyAvatar: null,
      loadingAlbumArt: false,
      loadingPlaylistName: false,
      showSearchResults: true,
    };

    this.openAiSearch = this.openAiSearch.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.generatePlaylistName = this.generatePlaylistName.bind(this);
    this.setToSearchState = this.setToSearchState.bind(this);
    this.setToPlaylistState = this.setToPlaylistState.bind(this);
    this.clearPlaylist = this.clearPlaylist.bind(this);
    this.toggleTrack = this.toggleTrack.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.generateAlbumArt = this.generateAlbumArt.bind(this);
    this.interpretPrompt = this.interpretPrompt.bind(this);
    this.removeDuplicateTracks = this.removeDuplicateTracks.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.regenerateAlbumArt = this.regenerateAlbumArt.bind(this);
    this.updatePlaylists = this.updatePlaylists.bind(this);
    this.handleLogin();
  }

  updatePlaylists(newPlaylist) {
    this.setState((prevState) => ({
      playlists: [...prevState.playlists, newPlaylist],
    }));
  }

  async handleLogin() {
    const accessToken = await Spotify.getAccessToken();
    if (accessToken) {
      this.setState({ loggedIn: true });
      const userInfo = await Spotify.getUserInfo();
      this.setState({
        spotifyUsername: userInfo.username,
        spotifyAvatar: userInfo.avatar,
      });
    } else {
      console.error("Authentication failed");
    }
  }

  handleLogout() {
    this.setState({
      loggedIn: false,
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
      playlists: [],
      isFetching: false,
      searchState: true,
      albumArt: defaultAlbumArt,
      currentTrack: null,
      spotifyUsername: null,
      spotifyAvatar: null,
    });
    localStorage.clear();
  }

  // Other methods remain unchanged...

  render() {
    if (!this.state.loggedIn) {
      return <LoginPage onLogin={() => this.handleLogin()} />;
    }
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/dashboard">
              <Dashboard
                playlists={this.state.playlists}
                updatePlaylists={this.updatePlaylists}
              />
            </Route>
            <Route path="/">
              {/* Existing App content */}
              <div className="Header">
                {/* Header content remains unchanged */}
              </div>
              <div className="SearchAndPlaylist">
                {/* Search and Playlist content remains unchanged */}
              </div>
              <div className="Navigator">
                {/* Navigator content remains unchanged */}
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
