import React from 'react';
import './App.css';
import defaultAlbumArt from './DALL·E 2023-03-01 20.07.50 - driving down the 101 with the top down.png';
import Playlist from '../Playlist/Playlist.js';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Spotify from '../../util/Spotify.js';
import OpenAiAPIRequest, {generatePlaylistName, generateSongRecommendations} from "../../util/OpenAiAPIRequest.js";
import {faSpinner, faCommentAlt, faSearch,faMusic} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      isFetching: false,
      searchState: true,
      albumArt: defaultAlbumArt,
    };

    this.search = this.search.bind(this);
    this.openAiSearch = this.openAiSearch.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.generatePlaylistName = this.generatePlaylistName.bind(this);
    this.setToSearchState = this.setToSearchState.bind(this);
    this.setToPlaylistState=this.setToPlaylistState.bind(this);
    Spotify.getAccessToken();
  }



  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }


    openAiSearch(prompt) {
        this.setState({ isFetching: true });
        generateSongRecommendations(`Give me 25 song recommendations for this prompt: ${prompt}. Format the response with this convention Song Name - Artist Name 2. Song Name - Artist Name`)
            .then((response) => {
                const songList = response.slice(0, 25);
                const promises = songList.map(song => Spotify.openAiSearch(song));
                Promise.all(promises)
                    .then((searchResultsArray) => {
                        const searchResults = [].concat(...searchResultsArray);
                        this.setState({ searchResults: searchResults});
                        const playlistNamePromise = this.generatePlaylistName(prompt);
                        playlistNamePromise.then((playlistName) => {

                            this.generateAlbumArt(playlistName);
                        }).then(() => this.setState({ isFetching: false }));
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
    }


    generatePlaylistName(prompt) {
        return OpenAiAPIRequest.generatePlaylistName(`Come up with a name for playlist with the following prompt: ${prompt}. Make it less than 50 characters. For example if the prompt is: Soaking up the sun in California, you could return: California Dreamin.`)
            .then(playlistName => {
                console.log('Generated playlist name:', playlistName);
                this.setState({ playlistName: playlistName });
                return playlistName;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    generateAlbumArt(playlistName) {
        console.log('Playlist name:', `Sigma 75mm lens capturing this: ${playlistName}. No words, just the image.`);
        return OpenAiAPIRequest.generateImage(playlistName)
            .then(albumArt => {
                console.log('API response:', albumArt);
                this.setState({ albumArt: albumArt });
                return albumArt;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    //play the full track and stop it when the user clicks on the track
    playTrack(track) {
        let tracks = this.state.playlistTracks;
        tracks = tracks.filter(currentTrack => currentTrack.id === track.id);
        this.setState({playlistTracks: tracks});
    }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
    let searchResults = this.state.searchResults;
    searchResults.splice(searchResults.indexOf(track),1);
    this.setState({searchResults: searchResults })
  }

  //add multiple tracks to playlist
    addTracks(tracks) {
        let playlistTracks = this.state.playlistTracks;
        tracks.forEach(track => {
            if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
                return;
            }
            playlistTracks.push(track);
        });
        this.setState({playlistTracks: playlistTracks});
    }


  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
    let searchResults = this.state.searchResults;
    searchResults.push(track);
    this.setState({searchResults: searchResults })
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: '[NAME PLAYLIST]',
        playlistTracks: []
      });
    });
  }

  setToSearchState(event){
    this.setState({searchState:true});
  }

  setToPlaylistState(event){
    this.setState({searchState:false});
  }

    render() {

        return (
            <div>
                <div className="Sidebar">
                    <img src={'/djboticon.png'} alt={'icon'} />
                    <h1>SOUND<span className="highlight">TRACKS</span></h1>
                    <button onClick={this.setToSearchState}>
                        <FontAwesomeIcon icon={faSearch} style={{marginRight: '0.75em'}} />
                        Search
                    </button>
                    <button onClick={this.setToPlaylistState}>
                        <FontAwesomeIcon icon={faMusic} style={{marginRight: '0.75em'}} />
                        Playlist
                    </button>
                    <div>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSeL0vWrUM-qIHzhfjeZUQE2ZwRRzQ74z0K1Mj4G7En2lo3-xQ/viewform?usp=sf_link"
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
                    {this.state.searchState ?
                        <div>
                            <SearchBar onSearch={this.openAiSearch} />
                            {this.state.isFetching ? (
                                <div className="Fetching-sign">
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    Fetching results...
                                </div>
                            ) : null}
                            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
                        </div>
                        :
                        <div className="App-playlist">
                            <Playlist
                                playlistName={this.state.playlistName}
                                playlistTracks={this.state.playlistTracks}
                                albumArt={this.state.albumArt}
                                onNameChange={this.updatePlaylistName}
                                onRemove={this.removeTrack}
                                onSave={this.savePlaylist}>
                                <img src={this.state.albumArt} alt="Album Art" style={{ width: '1rem', height: '1rem' }} />
                            </Playlist>
                        </div>
                    }
                </div>

                <div className="Navigator">
                    <button onClick={this.setToSearchState} className={this.state.searchState ? "active" : ""}>
                        <FontAwesomeIcon icon={faSearch} style={{marginRight: '0.4em'}} />
                        Search
                    </button>
                    <button onClick={this.setToPlaylistState} className={this.state.searchState ? "" : "active"}>
                        <FontAwesomeIcon icon={faMusic} style={{marginRight: '0.5em'}} />
                        Playlist
                    </button>
                </div>
            </div>
        );
    }


}

export default App;
