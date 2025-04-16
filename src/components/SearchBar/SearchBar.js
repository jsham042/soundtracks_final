import React from 'react';
import './SearchBar.css';
import { faSearch, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      term: ''
    };

    this.handleTermChange = this.handleTermChange.bind(this);
    this.aiSearch = this.aiSearch.bind(this);
    this.directSearch = this.directSearch.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const storedSearchTerm = localStorage.getItem('searchTerm');
    if (storedSearchTerm) {
      this.setState({ term: storedSearchTerm });
    }
  }

  handleTermChange(event) {
    this.setState({ term: event.target.value });
  }

  aiSearch() {
    const userSearchInput = this.state.term;
    localStorage.setItem('searchTerm', userSearchInput);
    this.props.onAiSearch(userSearchInput);
  }

  directSearch() {
    const userSearchInput = this.state.term;
    localStorage.setItem('searchTerm', userSearchInput);
    this.props.onDirectSearch(userSearchInput);
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.directSearch();
    }
  }

  render() {
    return (
      <div className="SearchBar-container">
      <div className="SearchBar">
        <input
          placeholder="Describe the vibe you're going for"
          value={this.state.term}
          onChange={this.handleTermChange}
          onKeyDown={this.handleKeyDown}
        />
        </div>
        <div className="search-buttons">
          <button 
            className="search-button" 
            onClick={this.directSearch}
            data-tooltip="Search for songs and artists"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button 
            className="ai-search-button" 
            onClick={this.aiSearch}
            data-tooltip="AI-powered search for mood-based recommendations"
          >
            <FontAwesomeIcon icon={faMagicWandSparkles} />
          </button>
        </div>
        </div> 
    );
  }
}

export default SearchBar;