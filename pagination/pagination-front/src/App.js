import React, { Component } from 'react';
import * as request from 'superagent';
import List from './List.jsx';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

/*
 * IMPORTANT 
 * YOU NEED TO INSTALL REACT-ROUTER-DOM AND WRAP APP INSIDE BROWSERROUTER IN INDEX.JS
 * OTHERWISE YOU CANT USE THIS.PROPS.LOCATION.SEARCH
 * 
 * FOR EASIER USE OF URL QUERIES, INSTALL QUERY-STRING AS WELL
 * QUERY-STRING WILL CONVERT YOU WHOLE URL QUERY INTO AN OBJECT
 * EXAMPLE:
 * STRING ?PAGE=1&HELLO=WORLD WILL BE CONVERTED INTO { PAGE: 1, HELLO: WORLD}
 * OTHERWISE YOU HAVE TO SUBSTRING IT YOURSELF. SEE AND UNCOMMENT THE LINES IN COMPONENTDIDMOUNT AND TEST BY LOCALHOST:3000/?PAGE=1&HELLO=WORLD
 * 
 * I INSTALLED IT ALREADY IN THIS CASE SO DONT FORGET TO RUN `NPM INSTALL`
 */

class App extends Component {
  state = {
    rows: [] // Default, will be overwritten after we get a response from the back-end
  }

  requestList = (page) => {
    request.get(`http://localhost:4000/movies?page=${page}`)
      .then(response => {
        // Reponse.body should be a object like
        // {
        //   count: 12
        //   pages: 3
        //   rows: (5)[{ … }, { … }, { … }, { … }, { … }]
        // }
        // In this example we just use the local state
        this.setState(response.body)
      });
  }

  componentDidMount() {
    // const urlQuery = this.props.location.search;
    // console.log('URL QUERY NOT CONVERTED:', urlQuery);
    // console.log('URL QUERY CONVERTED:', queryString.parse(urlQuery));
    const page = parseInt(queryString.parse(this.props.location.search).page) || 1;
    this.requestList(page);
  }

  // Now we have our pagination data from the back-end
  // We can create our pagination, normally i seperate this function in an other file for reusability
  pagination = (pages) => {
    if (pages <= 1 ) {
      // There is only one page so we dont need pagination
      return;
    }

    const pagination = [];
    for (let i = 1; i <= pages; i++) {
      // As long as i is smaller or equal to the total number of pages (that is calculated in the back-end)
      // We add a button/link for that 'page' to the pagination array
      pagination.push(<Link to={`?page=${i}`} key={i} style={{margin: '5px', padding: '5px'}}>{i}</Link>);
      // Ive added a little bit of styling to the Link so its better to see and click in the browser
      // In fact we are not linking to a new page or component
      // We only change the url query named page. To handle that change and make pagination working we need to compare values, what we do in componentDidUpdate()
    }

    // If we return a array of JSX elements, React will render all of them automaticly. Fancy huh!?
    return pagination;
  }

  // Now we have buttons that link to a new 'page'
  // We compare and handle the url query change
  componentDidUpdate(prevProps) {
    // You can write this with fewer lines but i believe this is easier to read for you
    const newPageNum = queryString.parse(this.props.location.search).page;
    const oldPageNum = queryString.parse(prevProps.location.search).page;
    if (newPageNum !== oldPageNum) {
      // If the url query is different we need to update the List
      this.requestList(newPageNum);
    }
  }

  // We have all our functions and data
  // We can render all of it now and test it in the browser
  render() {
    return (
      <React.Fragment>
        <h1>Pagination example</h1>
        {/* We use a component to render the list for better readability */}
        {/* This example is about pagination so i try to keep code clean as possible */}
        <List data={this.state.rows} />
        {this.pagination(this.state.pages)}
      </React.Fragment>
    );
  }
}

export default App;
