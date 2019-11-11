import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addMovie } from './actions';

class AddMovie extends Component {
  state = {
    title: ''
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.addMovie(this.state.title, this.props.currentPage);
    this.setState({ title: '' });
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <React.Fragment>
        <h3>Add movie</h3>
        <form onSubmit={this.onSubmit}>
          <input type="text" name="title" value={this.state.title} placeholder="Title" onChange={this.onChange} />
          <button type="submit">Add</button>
        </form>
      </React.Fragment>
    );
  }
}

export default connect(null, { addMovie })(AddMovie);