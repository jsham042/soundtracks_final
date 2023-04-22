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
    return (
      <div className="SearchResults">
        <h2>Results</h2>
          {/*<button className="addTopFive" onClick={this.addTopFive}>Add Top 5</button>*/}
          {/*  <button className="addTopTen" onClick={this.addTopTen}>Add Top 10</button>*/}
          {/*  <button className="addAll" onClick={this.addAll}>Add All</button>*/}
        <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} />
      </div>
    );
  }
}

export default SearchResults;