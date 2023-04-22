import React from 'react';

import './SearchBar.css';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      term: ''
    };

    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleTermChange(event) {
    this.setState({term: event.target.value});
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  render() {
    return (
      <div className="SearchBar">
        <input
            placeholder="Describe the vibe you're going for"
            onChange={this.handleTermChange} />
        <button onClick={this.search}>
          <FontAwesomeIcon icon={faSearch} />

        </button>
      </div>
    );
  }
}

export default SearchBar;