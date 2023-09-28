import React from "react";

import "./SearchResults.css";

import TrackList from "../TrackList/TrackList.js";

import Spotify from "../../util/Spotify";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.addTopFive = this.addTopFive.bind(this);
    this.addTopTen = this.addTopTen.bind(this);
    this.addAll = this.addAll.bind(this);
  }

  //add the top five tracks to the playlist
  addTopFive() {
    Spotify.addTracksToPlaylist(
      this.props.playlistId,
      this.props.searchResults.slice(0, 5).map((track) => track.uri),
    );
  }

  //add top 10 tracks to the playlist
  addTopTen() {
    Spotify.addTracksToPlaylist(
      this.props.playlistId,
      this.props.searchResults.slice(0, 10).map((track) => track.uri),
    );
  }

  addAll() {
    Spotify.addTracksToPlaylist(
      this.props.playlistId,
      this.props.searchResults.map((track) => track.uri),
    );
  }
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
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
