import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "./Track.css";
import ToastNotification from "../ToastNotification/ToastNotification.js";


class Track extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toastMessage: "",
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  addTrack(event) {
    this.props.onAdd(this.props.track);
    if (
      this.props.currentTrack &&
      this.props.currentTrack.id === this.props.track.id
    ) {
      this.props.onToggle(this.props.track);
    }
  }

  removeTrack(event) {
    this.props.onRemove(this.props.track);
    if (
      this.props.currentTrack &&
      this.props.currentTrack.id === this.props.track.id
    ) {
      this.props.onToggle(this.props.track);
    }
  }

  handleClick() {
    this.setState({ toastMessage: "" }, () => {
      const audio = new Audio(this.props.track.preview_url);
      audio.onerror = () => {
        this.setState({
          toastMessage: `Sorry, the audio for ${this.props.track.name} isn't available.`,
        });
      };
      audio.oncanplaythrough = () => {
        this.props.onToggle(this.props.track);
      };
      audio.load();
    });
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

        {this.state.toastMessage && (
          <ToastNotification message={this.state.toastMessage} />
        )}
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;