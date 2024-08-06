import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "./Track.css";
import type { TrackProps, TrackState } from "./Track-js.types";

class Track extends React.Component<TrackProps, TrackState> {
  constructor(props: TrackProps) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  addTrack(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.onAdd(this.props.track);
    if (
      this.props.currentTrack &&
      this.props.currentTrack.id === this.props.track.id
    ) {
      this.props.onToggle(this.props.track);
    }
  }

  removeTrack(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.onRemove(this.props.track);
    if (
      this.props.currentTrack &&
      this.props.currentTrack.id === this.props.track.id
    ) {
      this.props.onToggle(this.props.track);
    }
  }

  handleClick() {
    if (!this.props.track.preview_url || this.props.track.preview_url === "") {
      console.error("Invalid or missing preview URL");
    } else {
      this.props.onToggle(this.props.track);
    }
  }

  renderAction() {
    if (this.props.isRemoval) {
      return (
        <button
          className="Track-action"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            this.removeTrack(e);
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
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          this.addTrack(e);
          e.stopPropagation();
        }}
      >
        +
      </button>
    );
  }

  render() {
    const isCurrentTrack =
      this.props.currentTrack &&
      this.props.currentTrack.id === this.props.track.id;
    return (
      <div className="Track" onClick={this.handleClick}>
        <button className="playButton">
          {isCurrentTrack ? (
            <FontAwesomeIcon icon={faPause} style={{ width: "1rem" }} />
          ) : (
            <FontAwesomeIcon icon={faPlay} style={{ width: "1rem" }} />
          )}
        </button>
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
            {this.props.track.artist} | {this.props.track.album} |{" "}
            {this.props.track.genre}
          </p>
        </div>

        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
