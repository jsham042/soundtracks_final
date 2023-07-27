import React from 'react';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { term: '' };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(event) {
    this.setState({ term: event.target.value });
  }

  render() {
    return (
      <div className="SearchBar">
        {/* Added a style prop to the input field to set the font to Arial Bold */}
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} style={{fontFamily: 'Arial', fontWeight: 'bold'}} />
        <button className="SearchButton" onClick={this.search}>SEARCH</button>
      </div>
    );
  }
}

export default SearchBar;