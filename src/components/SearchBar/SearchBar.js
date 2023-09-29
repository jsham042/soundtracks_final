import React from "react";

import "./SearchBar.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spotify from "../../util/Spotify";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      term: "",
    };

    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleTermChange(event) {
    this.setState({ term: event.target.value });
  }

  search() {
    Spotify.search(this.state.term).then((searchResults) => {
      this.props.onSearch(searchResults);
    });
  }
  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.search();
    }
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          placeholder="Describe the vibe you're going for"
          onChange={this.handleTermChange}
          onKeyDown={this.handleKeyDown}
        />
        <button onClick={this.search}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    );
  }
}

export default SearchBar;
