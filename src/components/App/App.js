import React from "react";
import "./App.css";
import defaultAlbumArt from "./djboticon.png";
import Playlist from "../Playlist/Playlist.js";
import SearchBar from "../SearchBar/SearchBar.js";
import SearchResults from "../SearchResults/SearchResults.js";
import RecentSongs from "../RecentSongs/RecentSongs.js";
import LoginPage from "../LoginPage/LoginPage.js";
import Spotify from "../../util/Spotify.js";

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
    faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from 'react';

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
            loadingAlbumArt: false,
            loadingPlaylistName: false,
            showSearchResults: true, // New state to toggle between search results and playlist
            recentlyAddedSongs: [], // Array to store recently added songs with timestamps
            currentView: 'search', // 'search', 'playlist', or 'recent'
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
        this.directSearch = this.directSearch.bind(this);
        this.addFromRecent = this.addFromRecent.bind(this);
        this.removeFromRecent = this.removeFromRecent.bind(this);
        this.clearRecentHistory = this.clearRecentHistory.bind(this);
        this.setCurrentView = this.setCurrentView.bind(this);
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
            recentlyAddedSongs: [],
            currentView: 'search',
        });
        localStorage.clear();
    }

    async directSearch(userSearchInput) {
        try {
            this.setState({ isFetching: true });

            const searchResults = await Spotify.directSearch(userSearchInput);
            const uniqueSearchResults = this.removeDuplicateTracks(searchResults);

            // Combine new results with existing ones
            const combinedSearchResults = [...uniqueSearchResults, ...this.state.searchResults];
            const finalUniqueSearchResults = this.removeDuplicateTracks(combinedSearchResults);

            this.setState({
                searchResults: finalUniqueSearchResults,
            });

            // Save results to local storage
            localStorage.setItem('searchResults', JSON.stringify(finalUniqueSearchResults));

            this.setState({ isFetching: false });
        } catch (error) {
            console.error("Error in directSearch:", error);
            this.setState({ isFetching: false });
        }
    }

    interpretPrompt(prompt) {
        OpenAiAPIRequest.interpretPrompt(prompt).then((response) => {
            console.log(response);
        });
    }

    async openAiSearch(userSearchInput) {
        try {
            this.setState({ isFetching: true });

            const songList = await generateAISongRecommendations(userSearchInput);
            const promises = songList.map((song) => Spotify.openAiSearch(song));
            const searchResultsArray = await Promise.all(promises);
            const flattenedSearchResults = [].concat(...searchResultsArray);
            const newUniqueSearchResults = this.removeDuplicateTracks(flattenedSearchResults);

            // Combine new results with existing ones
            const combinedSearchResults = [...newUniqueSearchResults, ...this.state.searchResults];
            const finalUniqueSearchResults = this.removeDuplicateTracks(combinedSearchResults);

            this.setState({
                searchResults: finalUniqueSearchResults,
            });

            console.log("Total length of search results: ", finalUniqueSearchResults.length);
            // Print the tracks
            finalUniqueSearchResults.forEach((track) => {
                console.log(`Track: ${track.name} by ${track.artist}`);
                console.log(`Album: ${track.album}`);
                console.log(`Preview URL: ${track.preview_url}`);
                console.log('---');
            });
            // Save results to local storage
            localStorage.setItem('searchResults', JSON.stringify(finalUniqueSearchResults));

            this.setState({ isFetching: false });
            if (this.state.playlistName === "New Playlist" && this.state.albumArt === defaultAlbumArt) {
                const playlistName = await this.generatePlaylistName(userSearchInput);
                await this.generateAlbumArt(playlistName);
            }
        } catch (error) {
            console.error(error);
            this.setState({ isFetching: false });
        }
    }

    async generatePlaylistName(prompt) {
        try {
            this.setState({ loadingPlaylistName: true });
            const playlistName = await OpenAiAPIRequest.generatePlaylistName(
                `Come up with a name for playlist with the following prompt: ${prompt}. Make it less than 50 characters. For example if the prompt is: Soaking up the sun in California, you could return: California Dreamin.`
            );
            console.log("Generated playlist name:", playlistName);
            this.setState({ playlistName: playlistName }, () => {
                console.log("State updated with playlist name:", this.state.playlistName);
            });
            this.setState({ loadingPlaylistName: false });
            localStorage.setItem('playlistName', playlistName);
            return playlistName;
        } catch (error) {
            console.error(error);
            this.setState({ loadingPlaylistName: false });
        }
    }

    regenerateAlbumArt = async () => {
        this.setState({ loadingAlbumArt: true });
        try {
          await this.generateAlbumArt(this.state.playlistName);
        } catch (error) {
          console.error("Error regenerating album art:", error);
        } finally {
          this.setState({ loadingAlbumArt: false });
        }
      }

    async generateAlbumArt(playlistName) {
        this.setState({ loadingAlbumArt: true });
        console.log(
            "Playlist name:",
            `Sigma 75mm lens capturing this: ${playlistName}. No words, just the image.`,
        );
        return OpenAiAPIRequest.generateImage(playlistName)
            .then((albumArt) => {
                console.log("API response:", albumArt);
                this.setState({ albumArt: albumArt });
                this.setState({ loadingAlbumArt: false });
                localStorage.setItem('albumArt', albumArt);
                
                // Add an error handler for the image
                const img = new Image();
                img.onerror = () => {
                    console.log("Image failed to load, using default album art");
                    this.setState({ albumArt: defaultAlbumArt });
                    localStorage.setItem('albumArt', defaultAlbumArt);
                    this.setState({ loadingAlbumArt: false });
                };
                img.src = albumArt;
                this.setState({ loadingAlbumArt: false });
                return albumArt;
            })
            .catch((error) => {
                console.error(error);
                this.setState({ albumArt: defaultAlbumArt });
                localStorage.setItem('albumArt', defaultAlbumArt);
                this.setState({ loadingAlbumArt: false });
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
        localStorage.setItem('playlistTracks', JSON.stringify(tracks));
        
        // Add to recently added songs
        this.addToRecentlyAdded(track);
        
        let searchResults = this.state.searchResults;
        searchResults.splice(searchResults.indexOf(track), 1);
        this.setState({ searchResults: searchResults });
        localStorage.setItem('searchResults', JSON.stringify(searchResults));
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
        const storedResults = localStorage.getItem('searchResults');
        if (storedResults) {
            this.setState({ searchResults: JSON.parse(storedResults) });
        }
        const storedPlaylistName = localStorage.getItem('playlistName');
        if (storedPlaylistName) {
            this.setState({ playlistName: storedPlaylistName });
        }
        const storedAlbumArt = localStorage.getItem('albumArt');
        if (storedAlbumArt) {
            const img = new Image();
            img.onerror = () => {
                console.log("Stored image failed to load, using default album art");
                this.setState({ albumArt: defaultAlbumArt });
                localStorage.setItem('albumArt', defaultAlbumArt);
            };
            img.onload = () => {
                this.setState({ albumArt: storedAlbumArt });
            };
            img.src = storedAlbumArt;
        }
        const storedPlaylistTracks = localStorage.getItem('playlistTracks');
        if (storedPlaylistTracks) {
            this.setState({ playlistTracks: JSON.parse(storedPlaylistTracks) });
        }
        
        // Load recently added songs
        const storedRecentSongs = localStorage.getItem('recentlyAddedSongs');
        if (storedRecentSongs) {
            try {
                let recentSongs = JSON.parse(storedRecentSongs);
                // Clean up old entries beyond 50 items
                if (recentSongs.length > 50) {
                    recentSongs = recentSongs.slice(0, 50);
                    localStorage.setItem('recentlyAddedSongs', JSON.stringify(recentSongs));
                }
                this.setState({ recentlyAddedSongs: recentSongs });
            } catch (error) {
                console.error("Error loading recent songs from localStorage:", error);
                // Reset to empty array if corrupted
                this.setState({ recentlyAddedSongs: [] });
                localStorage.setItem('recentlyAddedSongs', JSON.stringify([]));
            }
        }
        
        const accessToken = Spotify.getAccessToken();
        if (accessToken) {
            this.setState({ loggedIn: true });
        }
    }

    removeTrack(track) {
        let tracks = this.state.playlistTracks;
        tracks = tracks.filter((currentTrack) => currentTrack.id !== track.id);
        this.setState({ playlistTracks: tracks });
        localStorage.setItem('playlistTracks', JSON.stringify(tracks));
        let searchResults = this.state.searchResults;
        searchResults.push(track);
        this.setState({ searchResults: searchResults });
        localStorage.setItem('searchResults', JSON.stringify(searchResults));
    }

    updatePlaylistName(name) {
        this.setState({ playlistName: name });
        localStorage.setItem('playlistName', name);
    }

    clearPlaylist() {
        const confirmClear = window.confirm("Careful! Your playlist will be lost forever unless you save it to Spotify. Are you sure you want to clear the playlist?");
        if (confirmClear) {
            this.setState({ playlistName: "New Playlist" });
            localStorage.setItem('playlistName', "New Playlist");
            this.setState({ playlistTracks: [] });
            localStorage.setItem('playlistTracks', JSON.stringify([]));
            this.setState({ albumArt: defaultAlbumArt });
            localStorage.setItem('albumArt', defaultAlbumArt);
        }
    }


    savePlaylist() {
        const trackUris = this.state.playlistTracks.map((track) => track.uri);
        Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
            this.updatePlaylistName("New Playlist");
            this.setState({ playlistTracks: [] });
            localStorage.setItem('playlistTracks', JSON.stringify([]));
            this.setState({ albumArt: defaultAlbumArt });
            localStorage.setItem('albumArt', defaultAlbumArt);
        });
    }

    setToSearchState(event) {
        this.setState({ searchState: true });
    }

    setToPlaylistState(event) {
        this.setState({ searchState: false });
    }

    updateSearchResults = (newResults) => {
        const uniqueResults = this.removeDuplicateTracks(newResults);
        
        this.setState({ searchResults: uniqueResults });
        
        localStorage.setItem('searchResults', JSON.stringify(uniqueResults));
    }

    addToRecentlyAdded(track) {
        let recentSongs = [...this.state.recentlyAddedSongs];
        
        // Remove existing entry if it exists (to update timestamp)
        recentSongs = recentSongs.filter(recentTrack => recentTrack.track.id !== track.id);
        
        // Add new entry with current timestamp
        const recentEntry = {
            track: track,
            addedAt: new Date().toISOString()
        };
        
        // Add to beginning of array (most recent first)
        recentSongs.unshift(recentEntry);
        
        // Keep only last 50 entries to prevent storage bloat
        if (recentSongs.length > 50) {
            recentSongs = recentSongs.slice(0, 50);
        }
        
        this.setState({ recentlyAddedSongs: recentSongs });
        localStorage.setItem('recentlyAddedSongs', JSON.stringify(recentSongs));
    }

    addFromRecent(recentEntry) {
        // Add the track from recent history back to current playlist
        this.addTrack(recentEntry.track);
    }

    removeFromRecent(recentEntry) {
        let recentSongs = this.state.recentlyAddedSongs.filter(
            item => item.track.id !== recentEntry.track.id || item.addedAt !== recentEntry.addedAt
        );
        
        this.setState({ recentlyAddedSongs: recentSongs });
        localStorage.setItem('recentlyAddedSongs', JSON.stringify(recentSongs));
    }

    clearRecentHistory() {
        const confirmClear = window.confirm("Are you sure you want to clear your recent songs history?");
        if (confirmClear) {
            this.setState({ recentlyAddedSongs: [] });
            localStorage.setItem('recentlyAddedSongs', JSON.stringify([]));
        }
    }

    setCurrentView(view) {
        this.setState({ currentView: view });
        // Update showSearchResults for backward compatibility
        this.setState({ showSearchResults: view === 'search' });
    }

    toggleView() {
        this.setState(prevState => ({ showSearchResults: !prevState.showSearchResults }));
    }

    render() {
        if (!this.state.loggedIn) {
            return <LoginPage onLogin={() => this.handleLogin()} />;
        }
        return (
            <div className="App">
                <div className="Header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem',marginLeft:'1rem', cursor: 'default' }}>
                        <h1>
                        <span> SOUND</span>
                        <span className="highlight">TRACKS</span>
                    </h1>
                    </div>
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
                        <button className="Logout-button" onClick={this.handleLogout}>
                            Logout
                        </button>
                    </div>
                    
                </div>

                <div className="SearchAndPlaylist">
                    <div className={`SearchSection ${this.state.currentView === 'search' ? 'active' : ''}`}>
                        <div className="SearchSectionHeader">
                            <h1 className="search-header">Search</h1>
                            <SearchBar 
                                onAiSearch={this.openAiSearch}
                                onDirectSearch={this.directSearch}
                            />
                        </div>
                        {this.state.isFetching ? (
                            <div className="Fetching-sign">
                                <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '10px' }}/>
                                Fetching results...
                            </div>
                        ) : null}
                        <SearchResults
                            searchResults={this.state.searchResults}
                            onAdd={this.addTrack}
                            onToggle={this.toggleTrack}
                            currentTrack={this.state.currentTrack}
                            onUpdateSearchResults={this.updateSearchResults}
                        />
                    </div>
                    <div className={`PlaylistSection ${this.state.currentView === 'playlist' ? 'active' : ''}`}>
                        <div className="PlaylistSectionHeader">
                            <h1 style={{ margin: 0, cursor: 'default' }}>Playlist</h1>
                            {this.state.playlistName !== "New Playlist" && this.state.albumArt !== "./default-album-art.png" && (
                                <button className="new-playlist-button" onClick={this.clearPlaylist}>
                                    Create New Playlist
                                </button>
                            )}
                        </div>
                        <Playlist
                            playlistName={this.state.playlistName}
                            playlistTracks={this.state.playlistTracks}
                            albumArt={this.state.albumArt}
                            onNameChange={this.updatePlaylistName}
                            onRemove={this.removeTrack}
                            onSave={this.savePlaylist}
                            onToggle={this.toggleTrack}
                            currentTrack={this.state.currentTrack}
                            loadingAlbumArt={this.state.loadingAlbumArt}
                            loadingPlaylistName={this.state.loadingPlaylistName}
                            onRegenerateAlbumArt={this.regenerateAlbumArt}
                        >
                        </Playlist>
                    </div>
                    <div className={`RecentSection ${this.state.currentView === 'recent' ? 'active' : ''}`}>
                        <RecentSongs
                            recentlyAddedSongs={this.state.recentlyAddedSongs}
                            onAddFromRecent={this.addFromRecent}
                            onRemoveFromRecent={this.removeFromRecent}
                            onClearHistory={this.clearRecentHistory}
                            currentTrack={this.state.currentTrack}
                            onToggle={this.toggleTrack}
                        />
                    </div>
                </div>

                <div className="Navigator">
                    <button
                        onClick={() => this.setCurrentView('search')}
                        className={this.state.currentView === 'search' ? "active" : ""}
                    >
                        <FontAwesomeIcon icon={faSearch} style={{ marginRight: "0.4em" }} />
                        Search
                    </button>
                    <button
                        onClick={() => this.setCurrentView('playlist')}
                        className={this.state.currentView === 'playlist' ? "active" : ""}
                    >
                        <FontAwesomeIcon icon={faMusic} style={{ marginRight: "0.5em" }} />
                        Playlist
                    </button>
                    <button
                        onClick={() => this.setCurrentView('recent')}
                        className={this.state.currentView === 'recent' ? "active" : ""}
                    >
                        <FontAwesomeIcon icon={faHistory} style={{ marginRight: "0.4em" }} />
                        Recent
                    </button>
                </div>
            </div>
        );
    }
}

export default App;
