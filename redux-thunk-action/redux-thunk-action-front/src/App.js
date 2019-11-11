import React, { Component } from 'react';
import List from './List.jsx';
import { Link } from 'react-router-dom';
import queryString from 'query-string'
import { connect } from 'react-redux';
import { fetchList } from './actions';
import AddMovie from './AddMovie';

class App extends Component {
  componentDidMount() {
    const page = parseInt(queryString.parse(this.props.location.search).page) || 1;
    this.props.fetchList(page);
  }

  pagination = (pages) => {
    if (pages <= 1 ) {
      // There is only one page so we dont need pagination
      return;
    }

    const pagination = [];
    for (let i = 1; i <= pages; i++) {
      pagination.push(<Link to={`?page=${i}`} key={i} style={{margin: '5px', padding: '5px'}}>{i}</Link>);
    }

    return pagination;
  }

  componentDidUpdate(prevProps) {
    const newPageNum = queryString.parse(this.props.location.search).page;
    const oldPageNum = queryString.parse(prevProps.location.search).page;
    if (newPageNum !== oldPageNum) {
      this.props.fetchList(newPageNum);
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Pagination + Redux Thunk Actions example</h1>
        <List data={this.props.movies.rows} currentPage={parseInt(queryString.parse(this.props.location.search).page)} />
        {this.pagination(this.props.movies.pages)}
        <AddMovie currentPage={parseInt(queryString.parse(this.props.location.search).page)} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    movies: state
  }
}

export default connect(mapStateToProps, {fetchList})(App);
