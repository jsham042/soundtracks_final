import React from "react";

import "./SearchResults.css";

import TrackList from "../TrackList/TrackList.js";


class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.clearSearchResults = this.clearSearchResults.bind(this);
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
         {this.props.searchResults.length > 0 && (
          <div className="action-buttons-mobile">
            <button
              className="action-button clear"
              onClick={this.clearSearchResults}
            >
              Clear Results
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default SearchResults;