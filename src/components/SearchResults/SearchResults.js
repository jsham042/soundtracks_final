import React from 'react';

import './SearchResults.css';

import TrackList from '../TrackList/TrackList.js';

class SearchResults extends React.Component {
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
render() {
    let buttonVisibility = this.props.searchResults.length > 0 ? 'visible' : 'hidden';
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <button style={{visibility: buttonVisibility}} onClick={this.props.onGenerateMoreRecommendations} className='generate-more-button'>Create More Recommendations</button>
        <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} onToggle={this.props.onToggle}  currentTrack={this.props.currentTrack}/>
      </div>
    );
  }
}

export default SearchResults;