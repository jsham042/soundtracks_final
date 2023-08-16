import React from 'react';
import './App.css';
import defaultAlbumArt from './DALL·E 2023-03-01 20.07.50 - driving down the 101 with the top down.png';
import Playlist from '../Playlist/Playlist.js';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import LoginPage from '../LoginPage/LoginPage.js';
import Spotify from '../../util/Spotify.js';
import OpenAiAPIRequest, {generatePlaylistName, generateImage, generateTotalSongRecommendations} from '../../util/OpenAiAPIRequest.js';
import {faSpinner, faCommentAlt, faSearch,faMusic} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        loggedIn: true,
        searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      isFetching: false,
      searchState: true,
      albumArt: defaultAlbumArt,
        currentTrack: null,
        loggedInUser: '',
        userAvatar: '',
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
    this.toggleTrack = this.toggleTrack.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.generateAlbumArt = this.generateAlbumArt.bind(this);
    this.interpretPrompt= this.interpretPrompt.bind(this);
  }

  render() {
    if (!this.state.loggedIn) {
        return <LoginPage onLogin={() => this.handleLogin()}  />;
    }
    return (
        <div>
            <div className='Sidebar'>
                <img src={'/djboticon.png'} alt={'icon'} />
                <h1>SOUND<span className='highlight'>TRACKS</span></h1>
                <button onClick={this.setToSearchState}>
                    <FontAwesomeIcon icon={faSearch} style={{marginRight: '0.75em'}} />
                    Search
                </button>
                <button onClick={this.setToPlaylistState}>
                    <FontAwesomeIcon icon={faMusic} style={{marginRight: '0.75em'}} />
                    Playlist
                </button>
                <div>
                    <a href='https://docs.google.com/forms/d/e/1FAIpQLSeL0vWrUM-qIHzhfjeZUQE2ZwRRzQ74z0K1Mj4G7En2lo3-xQ/viewform?usp=sf_link'
                       className='feedback'
                       target='_blank'
                       rel='noopener noreferrer'
                    >
        <span style={{ paddingRight: '10px' }}>
          <FontAwesomeIcon icon={faCommentAlt} />
        </span>
                        Please Provide Feedback!
                    </a>
                </div>
                <div className='UserDetails'>
                    <p>Logged in as {this.state.loggedInUser}</p>
                    <img src={this.state.userAvatar} alt='User Avatar' />
                </div>
            </div>
        </div>
    );
  }
}

export default App;