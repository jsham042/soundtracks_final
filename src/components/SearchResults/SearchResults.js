import React from "react";

import "./SearchResults.css";

import TrackList from "../TrackList/TrackList.js";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.addTopFive = this.addTopFive.bind(this);
    this.addTopTen = this.addTopTen.bind(this);
    this.addAll = this.addAll.bind(this);
    this.fetchMoreRecommendations = this.fetchMoreRecommendations.bind(this);
  }

  // Add the top five tracks to the playlist
  addTopFive() {
    this.props.onAdd(this.props.searchResults.slice(0, 5));
  }

  // Add top 10 tracks to the playlist
  addTopTen() {
    this.props.onAdd(this.props.searchResults.slice(0, 10));
  }

  // Add all tracks to the playlist
  addAll() {
    this.props.onAdd(this.props.searchResults);
  }

  // Fetch more recommendations based on the top 5 tracks
  fetchMoreRecommendations() {
    const topFiveTracks = this.props.searchResults.slice(0, 5);
    this.props.onFetchMoreRecommendations(topFiveTracks);
  }

  render() {
    return (
      <div className="SearchResults">
        <button
          className="show-more-btn"
          onClick={this.fetchMoreRecommendations}
        >
          Show More Recommendations
        </button>
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
