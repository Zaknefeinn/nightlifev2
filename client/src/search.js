import React, { Component } from 'react';

class Search extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="search-container">
        <form onSubmit={this.props.handleSubmit}>
          <input
            className="form-control"
            onChange={this.props.editTerm}
            value={this.props.term}
            placeholder="City Name"
          />
          <button className="btn btn-outline-secondary" type="submit">
            Go
          </button>
        </form>
      </div>
    );
  }
}

export default Search;
