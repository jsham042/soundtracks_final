import React from "react";

import "./SearchResults.css";

import TrackList from "../TrackList/TrackList.js";
import Spotify from "../../util/Spotify.js";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.addTopFive = this.addTopFive.bind(this);
    this.addTopTen = this.addTopTen.bind(this);
    this.addAll = this.addAll.bind(this);
    this.fetchMoreRecommendations = this.fetchMoreRecommendations.bind(this);
    this.clearSearchResults = this.clearSearchResults.bind(this);
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
  async fetchMoreRecommendations() {
    const topFiveTracks = this.props.searchResults.slice(0, 5);
    const trackIds = topFiveTracks.map((track) => track.id);
    try {
      const recommendations = await Spotify.makeRecommendation(trackIds);
      console.log(recommendations);
      // Use the new prop to update search results in the parent component
      this.props.onUpdateSearchResults([...recommendations, ...this.props.searchResults]);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  }

  // Clear search results
  clearSearchResults() {
    this.props.onUpdateSearchResults([]);
  }

  render() {
    return (
      <div className="SearchResults">
        {this.props.searchResults.length > 0 && (
          <div className="action-buttons">
            <button
              className="action-button"
              onClick={this.fetchMoreRecommendations}
            >
              More Recommendations
            </button>
            <button
              className="action-button clear"
              onClick={this.clearSearchResults}
            >
              Clear Results
            </button>
          </div>
        )}
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