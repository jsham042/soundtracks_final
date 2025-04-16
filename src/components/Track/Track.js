import React from "react";

import "./Track.css";



class Track extends React.Component {
  constructor(props) {
    super(props);
    
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(event) {
    this.props.onAdd(this.props.track);
  }

  removeTrack(event) {
    this.props.onRemove(this.props.track);
  }

  

  renderAction() {
    if (this.props.isRemoval) {
      return (
        <button
          className="Track-action"
          onClick={(e) => {
            this.removeTrack();
            e.stopPropagation();
          }}
        >
          -
        </button>
      );
    }
    return (
      <button
        className="Track-action"
        onClick={(e) => {
          this.addTrack();
          e.stopPropagation();
        }}
      >
        +
      </button>
    );
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-image">
          <img
            src={this.props.track.image}
            alt="Album Art"
            style={{ width: "2.5rem" }}
          />
        </div>
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>
            {this.props.track.artist} | {this.props.track.album} | {this.props.track.genre}
          </p>

        </div>
        <a
          href={this.props.track.uri}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="spotifyLogo-small"
            src={"/spotify-logo-small.png"}
            alt="Spotify Logo"
          />
        </a>

        
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;