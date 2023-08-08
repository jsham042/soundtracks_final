import React from 'react';

import './SearchBar.css';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      isHovered: false
    };

    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleTermChange(event) {
    this.setState({term: event.target.value});
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  handleMouseEnter() {
    this.setState({isHovered: true});
  }

  handleMouseLeave() {
    this.setState({isHovered: false});
  }

  render() {
    return (
      <div className={`SearchBar ${this.state.isHovered ? 'hovered' : ''}`}
           onMouseEnter={this.handleMouseEnter}
           onMouseLeave={this.handleMouseLeave}
      >
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