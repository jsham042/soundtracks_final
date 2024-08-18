import React from "react";

class PlaylistItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      newName: this.props.playlist.name,
    };
  }

  handleEdit = () => {
    this.setState({ editing: true });
  };

  handleDelete = () => {
    this.props.onDelete(this.props.playlist.id);
  };

  handleNameChange = (event) => {
    this.setState({ newName: event.target.value });
  };

  handleSave = () => {
    this.props.onEdit(this.props.playlist.id, this.state.newName);
    this.setState({ editing: false });
  };

  render() {
    const { playlist } = this.props;
    const { editing, newName } = this.state;

    return (
      <div className="playlist-item">
        {editing ? (
          <input
            type="text"
            value={newName}
            onChange={this.handleNameChange}
            onBlur={this.handleSave}
          />
        ) : (
          <h3>{playlist.name}</h3>
        )}
        <p>Tracks: {playlist.tracksCount}</p>
        <p>Duration: {playlist.totalDuration}</p>
        <button onClick={this.handleEdit}>Edit Name</button>
        <button onClick={this.handleDelete}>Delete Playlist</button>
      </div>
    );
  }
}

export default PlaylistItem;
