import React from "react";

import "./SearchResults.css";

import TrackList from "../TrackList/TrackList.js";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.addTopFive = this.addTopFive.bind(this);
    this.addTopTen = this.addTopTen.bind(this);
    this.addAll = this.addAll.bind(this);
  }

  //add the top five tracks to the playlist and store in local storage
  addTopFive() {
    const topFive = this.props.searchResults.slice(0, 5);
    this.props.onAdd(topFive);
    localStorage.setItem("searchResults", JSON.stringify(topFive));
  }

  //add top 10 tracks to the playlist and store in local storage
  addTopTen() {
    const topTen = this.props.searchResults.slice(0, 10);
    this.props.onAdd(topTen);
    localStorage.setItem("searchResults", JSON.stringify(topTen));
  }

  //add all tracks to the playlist and store in local storage
  addAll() {
    const allTracks = this.props.searchResults;
    this.props.onAdd(allTracks);
    localStorage.setItem("searchResults", JSON.stringify(allTracks));
  }

  render() {
    return (
      <div className="SearchResults">
        <TrackList
          tracks={this.props.searchResults}
          onAdd={this.props.onAdd}
          onToggle={this.props.onToggle}
          currentTrack={this.props.currentTrack}
        />
      </div>
    );
  }
}

export default SearchResults;
