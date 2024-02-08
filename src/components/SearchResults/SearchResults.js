import React from 'react';

import './SearchResults.css';

import TrackList from '../TrackList/TrackList.js';

class SearchResults extends React.Component {
class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = { partialTracks: [] };
        this.addTopFive = this.addTopFive.bind(this);
        this.addTopTen = this.addTopTen.bind(this);
        this.addAll = this.addAll.bind(this);
        this.updateSearchResults = this.updateSearchResults.bind(this);
    }

    // Existing methods...

    //add the top five tracks to the playlist
    addTopFive() {
        this.props.onAdd(this.props.searchResults.slice(0, 5));
    }

    //add top 10 tracks to the playlist
    addTopTen() {
        this.props.onAdd(this.props.searchResults.slice(0, 10));
    }

    addAll() {
        this.props.onAdd(this.props.searchResults);
    }

    render() {
      return (
        <div className="SearchResults">
          <h2>Results</h2>
          <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} onToggle={this.props.onToggle}  currentTrack={this.props.currentTrack}/>
        </div>
      );
    }
}

export default SearchResults;
        this.setState({ partialTracks: [...this.state.partialTracks, track] });
    }

    // Existing methods...
}
    constructor(props) {
        super(props);
        this.addTopFive = this.addTopFive.bind(this);
        this.addTopTen = this.addTopTen.bind(this);
        this.addAll = this.addAll.bind(this);
    }

    //add the top five tracks to the playlist
    addTopFive() {
        this.props.onAdd(this.props.searchResults.slice(0, 5));
    }

    //add top 10 tracks to the playlist
    addTopTen() {
        this.props.onAdd(this.props.searchResults.slice(0, 10));
    }

    addAll() {
        this.props.onAdd(this.props.searchResults);
    }
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} onToggle={this.props.onToggle}  currentTrack={this.props.currentTrack}/>
      </div>
    );
  }
}

export default SearchResults;