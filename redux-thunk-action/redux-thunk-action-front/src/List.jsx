import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteMovie } from './actions';

class List extends Component {
  onClick = (id) => {
    this.props.deleteMovie(id, this.props.currentPage);
  }

  render() {
    return (
      <ul>
        {this.props.data.map(movie => {
          return <li key={movie.id}>{movie.id} - {movie.title} - <button onClick={() => this.onClick(movie.id)}>Delete</button></li>
        })}
      </ul>
    );
  }
}

export default connect(null, { deleteMovie })(List);
 