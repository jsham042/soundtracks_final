import React from 'react';
import './SearchBar.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { SearchBarProps, SearchBarState } from './SearchBar-js.types';

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);

    this.state = {
      term: ''
    };

    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const storedSearchTerm = localStorage.getItem('searchTerm');
    if (storedSearchTerm) {
      this.setState({ term: storedSearchTerm });
    }
  }

  handleTermChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ term: event.target.value });
  }

  search() {
    const userSearchInput = this.state.term;
    localStorage.setItem('searchTerm', userSearchInput);
    this.props.onSearch(userSearchInput);
  }

  handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          placeholder="Describe the vibe you're going for"
          value={this.state.term}
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
