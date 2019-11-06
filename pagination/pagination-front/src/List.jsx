import React, { Component } from 'react';

class List extends Component {
  render() {
    return (
      <ul>
        {this.props.data.map(movie => {
          return <li key={movie.id}>{movie.title}</li>
        })}
      </ul>
    );
  }
}

export default List;
 