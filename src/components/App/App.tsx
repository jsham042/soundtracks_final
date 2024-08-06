import React from "react";
import "./App.css";
import defaultAlbumArt from "./DALL·E 2023-03-01 20.07.50 - driving down the 101 with the top down.png";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import LoginPage from "../LoginPage/LoginPage";
import Spotify from "../../util/Spotify";

import OpenAiAPIRequest, {
    generatePlaylistName,
    generateImage,
    generateAISongRecommendations,
} from "../../util/OpenAiAPIRequest";
import {
    faSpinner,
    faCommentAlt,
    faSearch,
    faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AppState, Track, UserInfo } from "./App-js.types";

class App extends React.Component<{}, AppState> {
    private audio: HTMLAudioElement | null = null;

    constructor(props: {}) {
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
        const accessToken = await Spotify.getAccessToken();
        if (accessToken) {
            this.setState({ loggedIn: true });
            const userInfo: UserInfo = await Spotify.getUserInfo();
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
            isFetching: false,
            searchState: true,
            albumArt: defaultAlbumArt,
            currentTrack: null,
            spotifyUsername: null,
            spotifyAvatar: null,
        });
    }

    interpretPrompt(prompt: string) {
        OpenAiAPIRequest.interpretPrompt(prompt).then((response) => {
            console.log(response);
        });
    }

    async openAiSearch(userSearchInput: string) {
        try {
            this.setState({ isFetching: true });

            const songList = await generateAISongRecommendations(userSearchInput);
            const promises = songList.map((song) => Spotify.openAiSearch(song));
            const searchResultsArray = await Promise.all(promises);
            const flattenedSearchResults = [].concat(...searchResultsArray);
            const uniqueSearchResults = this.removeDuplicateTracks(flattenedSearchResults);

            this.setState({
                searchResults: uniqueSearchResults,
            });

            console.log("Total length of search results: ", uniqueSearchResults.length);
            localStorage.setItem('searchResults', JSON.stringify(uniqueSearchResults));

            this.setState({ isFetching: false });

            const playlistName = await this.generatePlaylistName(userSearchInput);
            await this.generateAlbumArt(playlistName);
        } catch (error) {
            console.error(error);
            this.setState({ isFetching: false });
        }
    }

    async generatePlaylistName(prompt: string) {
        try {
            const playlistName = await OpenAiAPIRequest.generatePlaylistName(
                `Come up with a name for playlist with the following prompt: ${prompt}. Make it less than 50 characters. For example if the prompt is: Soaking up the sun in California, you could return: California Dreamin.`
            );
            console.log("Generated playlist name:", playlistName);
            this.setState({ playlistName: playlistName }, () => {
                console.log("State updated with playlist name:", this.state.playlistName);
            });
            localStorage.setItem('playlistName', playlistName);
            return playlistName;
        } catch (error) {
            console.error(error);
        }
    }

    async generateAlbumArt(playlistName: string) {
        console.log(
            "Playlist name:",
            `Sigma 75mm lens capturing this: ${playlistName}. No words, just the image.`,
        );
        return OpenAiAPIRequest.generateImage(playlistName)
            .then((albumArt) => {
                console.log("API response:", albumArt);
                this.setState({ albumArt: albumArt });
                localStorage.setItem('albumArt', albumArt);
                return albumArt;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    removeDuplicateTracks(tracks: Track[]): Track[] {
        const trackIds = new Set<string>();
        const uniqueTracks: Track[] = [];
        for (const track of tracks) {
            if (!trackIds.has(track.id)) {
                trackIds.add(track.id);
                uniqueTracks.push(track);
            }
        }
        return uniqueTracks;
    }

    addTrack(track: Track) {
        let tracks = this.state.playlistTracks;
        if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
            return;
        }
        tracks.push(track);
        this.setState({ playlistTracks: tracks });
        localStorage.setItem('playlistTracks', JSON.stringify(tracks));
        let searchResults = this.state.searchResults;
        searchResults.splice(searchResults.indexOf(track), 1);
        this.setState({ searchResults: searchResults });
        localStorage.setItem('searchResults', JSON.stringify(searchResults));
    }

    toggleTrack(track: Track) {
        if (this.state.currentTrack && this.state.currentTrack.id === track.id) {
            if (this.audio) {
                this.audio.pause();
            }
            this.setState({ currentTrack: null });
        } else {
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
            this.setState({ albumArt: storedAlbumArt });
        }
        const storedPlaylistTracks = localStorage.getItem('playlistTracks');
        if (storedPlaylistTracks) {
            this.setState({ playlistTracks: JSON.parse(storedPlaylistTracks) });
        }
        const accessToken = Spotify.getAccessToken();
        if (accessToken) {
            this.setState({ loggedIn: true });
        }
    }

    removeTrack(track: Track) {
        let tracks = this.state.playlistTracks;
        tracks = tracks.filter((currentTrack) => currentTrack.id !== track.id);
        this.setState({ playlistTracks: tracks });
        localStorage.setItem('playlistTracks', JSON.stringify(tracks));
        let searchResults = this.state.searchResults;
        searchResults.push(track);
        this.setState({ searchResults: searchResults });
        localStorage.setItem('searchResults', JSON.stringify(searchResults));
    }

    updatePlaylistName(name: string) {
        this.setState({ playlistName: name });
        localStorage.setItem('playlistName', name);
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

    setToSearchState(event: React.MouseEvent<HTMLButtonElement>) {
        this.setState({ searchState: true });
    }

    setToPlaylistState(event: React.MouseEvent<HTMLButtonElement>) {
        this.setState({ searchState: false });
    }

    render() {
        if (!this.state.loggedIn) {
            return <LoginPage onLogin={() => this.handleLogin()} />;
        }
        return (
            <div className="App">
                <div className="Header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem',marginLeft:'1rem' }}>
                        <img src={"/djboticon.png"} alt={"icon"} />
                        <h1>
                        <span> SOUND</span>
                        <span className="highlight">TRACKS</span>
                    </h1>
                    </div>
                    <div className="user-info">
                        <img
                            className="avatar"
                            src={this.state.spotifyAvatar || undefined}
                            alt="avatar"
                        />
                        <h1 className="username">
                            {" "}
                            {this.state.spotifyUsername || undefined}{" "}
                        </h1>
                        <button className="Logout-button" onClick={this.handleLogout}>
                            Logout
                        </button>
                    </div>

                </div>

                <div className="SearchAndPlaylist">
                    <div className="SearchSection">
                        <div className="SearchSectionHeader">
                            <h1 style={{ margin: 0 }}>Search</h1>
                                <SearchBar onSearch={this.openAiSearch} />
                        </div>
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
                    <div className="PlaylistSection">
                        <div className="PlaylistSectionHeader">
                            <h1 style={{ margin: 0 }}>Playlist</h1>
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
                        >
                            <img
                                src={this.state.albumArt}
                                alt="Album Art"
                                style={{ width: "1rem", height: "1rem" }}
                            />
                        </Playlist>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
