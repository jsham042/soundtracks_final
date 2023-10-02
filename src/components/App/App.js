import React from "react";
import "./App.css";
import defaultAlbumArt from "./DALL·E 2023-03-01 20.07.50 - driving down the 101 with the top down.png";
import Playlist from "../Playlist/Playlist.js";
import SearchBar from "../SearchBar/SearchBar.js";
import SearchResults from "../SearchResults/SearchResults.js";
import LoginPage from "../LoginPage/LoginPage.js";
import Spotify from "../../util/Spotify.js";

import OpenAiAPIRequest, {
  generatePlaylistName,
  generateImage,
  generateTotalSongRecommendations,
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
      isFetching: false,
      searchState: true,
      albumArt: defaultAlbumArt,
      currentTrack: null,
      spotifyUsername: null,
      spotifyAvatar: null,
    };

    this.search = this.search.bind(this);
    this.openAiSearch = this.openAiSearch.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.generatePlaylistName = this.generatePlaylistName.bind(this);
    this.setToSearchState = this.setToSearchState.bind(this);
    this.setToPlaylistState = this.setToPlaylistState.bind(this);
    this.toggleTrack = this.toggleTrack.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.generateAlbumArt = this.generateAlbumArt.bind(this);
    this.interpretPrompt = this.interpretPrompt.bind(this);
    this.removeDuplicateTracks = this.removeDuplicateTracks.bind(this);
    this.handleLogin();
  }
  async handleLogin() {
    // Use the Spotify utility to get the access token
    const accessToken = await Spotify.getAccessToken();
    // If an access token is obtained, update the loggedIn state
    if (accessToken) {
      this.setState({ loggedIn: true });
      const userInfo = await Spotify.getUserInfo();
      this.setState({
        spotifyUsername: userInfo.username,
        spotifyAvatar: userInfo.avatar,
      });
    } else {
      // Handle the case where the access token could not be obtained
      console.error("Authentication failed");
    }
  }

  handleLogout() {
    this.setState({
      loggedIn: false,
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
      isFetching: false,
      searchState: true,
      albumArt: defaultAlbumArt,
      currentTrack: null,
      spotifyUsername: null,
      spotifyAvatar: null,
    });
  }
  search(term) {
    Spotify.search(term).then((searchResults) => {
      this.setState({
        searchResults: this.removeDuplicateTracks(searchResults),
      });
    });
  }
  interpretPrompt(prompt) {
    OpenAiAPIRequest.interpretPrompt(prompt).then((response) => {
      console.log(response);
    });
  }
  openAiSearch(prompt) {
    this.setState({ isFetching: true });

    generateTotalSongRecommendations(prompt)
      .then((response) => {
        const songList = response.slice(0, 25);
        const promises = songList.map((song) => Spotify.openAiSearch(song));
        return Promise.all(promises);
      })
      .then((searchResultsArray) => {
        const searchResults = [].concat(...searchResultsArray);
        this.setState({
          searchResults: this.removeDuplicateTracks(searchResults),
        });

        // Generate 5 random track IDs.
        const fiveRandomTrackIds = [];
        for (let i = 0; i < 5; i++) {
          const randomIndex = Math.floor(
            Math.random() * this.state.searchResults.length,
          );
          fiveRandomTrackIds.push(this.state.searchResults[randomIndex].id);
        }
        console.log("Five random track IDs:", fiveRandomTrackIds);

        return Spotify.makeRecommendation(
          fiveRandomTrackIds[0],
          fiveRandomTrackIds[1],
          fiveRandomTrackIds[2],
          fiveRandomTrackIds[3],
          fiveRandomTrackIds[4],
        );
      })
      .then((recommendations) => {
        this.setState((prevState) => ({
          searchResults: this.removeDuplicateTracks(
            prevState.searchResults.concat(recommendations),
          ),
        }));

        return this.generatePlaylistName(prompt);
      })
      .then((playlistName) => {
        return this.generateAlbumArt(playlistName);
      })
      .then(() => {
        this.setState({ isFetching: false });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  generatePlaylistName(prompt) {
    return OpenAiAPIRequest.generatePlaylistName(
      `Come up with a name for playlist with the following prompt: ${prompt}. Make it less than 50 characters. For example if the prompt is: Soaking up the sun in California, you could return: California Dreamin.`,
    )
      .then((playlistName) => {
        console.log("Generated playlist name:", playlistName);
        this.setState({ playlistName: playlistName });
        return playlistName;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  generateAlbumArt(playlistName) {
    console.log(
      "Playlist name:",
      `Sigma 75mm lens capturing this: ${playlistName}. No words, just the image.`,
    );
    return OpenAiAPIRequest.generateImage(playlistName)
      .then((albumArt) => {
        console.log("API response:", albumArt);
        this.setState({ albumArt: albumArt });
        return albumArt;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  removeDuplicateTracks(tracks) {
    const trackIds = new Set();
    const uniqueTracks = [];
    for (const track of tracks) {
      if (!trackIds.has(track.id)) {
        trackIds.add(track.id);
        uniqueTracks.push(track);
      }
    }
    return uniqueTracks;
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
    let searchResults = this.state.searchResults;
    searchResults.splice(searchResults.indexOf(track), 1);
    this.setState({ searchResults: searchResults });
  }

  toggleTrack(track) {
    if (this.state.currentTrack && this.state.currentTrack.id === track.id) {
      // Pause the current track if it is already playing
      this.audio.pause();
      this.setState({ currentTrack: null });
    } else {
      // Play the new track
      if (this.audio) {
        this.audio.pause();
      }
      this.audio = new Audio(track.preview_url);
      this.audio.play();
      this.setState({ currentTrack: track });
    }
  }

  componentDidMount() {
    const accessToken = Spotify.getAccessToken();
    if (accessToken) {
      this.setState({ loggedIn: true });
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter((currentTrack) => currentTrack.id !== track.id);
    this.setState({ playlistTracks: tracks });
    let searchResults = this.state.searchResults;
    searchResults.push(track);
    this.setState({ searchResults: searchResults });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: "[NAME PLAYLIST]",
        playlistTracks: [],
      });
    });
  }

  setToSearchState(event) {
    this.setState({ searchState: true });
  }

  setToPlaylistState(event) {
    this.setState({ searchState: false });
  }

  render() {
    if (!this.state.loggedIn) {
      return <LoginPage onLogin={() => this.handleLogin()} />;
    }
    return (
      <div>
        <div className="Sidebar">
          <img src={"/djboticon.png"} alt={"icon"} />
          <h1>
            <span> SOUND</span>
            <span className="highlight">TRACKS</span>
          </h1>
          <button onClick={this.setToSearchState}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{ marginRight: "0.75em" }}
            />
            Search
          </button>
          <button onClick={this.setToPlaylistState}>
            <FontAwesomeIcon icon={faMusic} style={{ marginRight: "0.75em" }} />
            Playlist
          </button>
          <div>
            <div className="user-info-header">Logged in as:</div>
            <div className="user-info">
              <img
                className="avatar"
                src={this.state.spotifyAvatar || null}
                alt="avatar"
              />
              <h1 className="username">
                {" "}
                {this.state.spotifyUsername || null}{" "}
              </h1>
            </div>
            <div>
              <button className="Logout-button" onClick={this.handleLogout}>
                Logout
              </button>
            </div>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeL0vWrUM-qIHzhfjeZUQE2ZwRRzQ74z0K1Mj4G7En2lo3-xQ/viewform?usp=sf_link"
              className="feedback"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span style={{ paddingRight: "10px" }}>
                <FontAwesomeIcon icon={faCommentAlt} />
              </span>
              Please Provide Feedback!
            </a>
          </div>
        </div>

        <div className="App">
          {this.state.searchState ? (
            <div>
              <SearchBar onSearch={this.search} />
              {this.state.isFetching ? (
                <div className="Fetching-sign">
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Fetching results...
                </div>
              ) : null}
              <SearchResults
                searchResults={this.state.searchResults}
                onAdd={this.addTrack}
                onToggle={this.toggleTrack}
                currentTrack={this.state.currentTrack}
              />
            </div>
          ) : (
            <div className="App-playlist">
              <Playlist
                playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                albumArt={this.state.albumArt}
                onNameChange={this.updatePlaylistName}
                onRemove={this.removeTrack}
                onSave={this.savePlaylist}
                onToggle={this.toggleTrack}
                currentTrack={this.state.currentTrack}
              >
                <img
                  src={this.state.albumArt}
                  alt="Album Art"
                  style={{ width: "1rem", height: "1rem" }}
                />
              </Playlist>
            </div>
          )}
        </div>

        <div className="Navigator">
          <button
            onClick={this.setToSearchState}
            className={this.state.searchState ? "active" : ""}
          >
            <FontAwesomeIcon icon={faSearch} style={{ marginRight: "0.4em" }} />
            Search
          </button>
          <button
            onClick={this.setToPlaylistState}
            className={this.state.searchState ? "" : "active"}
          >
            <FontAwesomeIcon icon={faMusic} style={{ marginRight: "0.5em" }} />
            Playlist
          </button>
        </div>
      </div>
    );
  }
}
export default App;
