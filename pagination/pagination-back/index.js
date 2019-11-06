// Database
const Sequelize = require('sequelize');

const databaseUrl = 'postgres://postgres:secret@localhost:5432/postgres';
const db = new Sequelize(databaseUrl);

const Movie = db.define('movies', {
  title: Sequelize.TEXT
});

db.sync({ force: true }) // Force true only for testing during writing code
  .then(() => {
    console.log('Database connected and schema updated');
    Movie.bulkCreate([
      {title: 'Spider-man'},
      {title: 'Iron man'},
      {title: 'Iron man 2'},
      {title: 'Iron man 3'},
      {title: 'Captain America'},
      {title: 'Captain America Civil War'},
      {title: 'Hulk'},
      {title: 'Thor'},
      {title: 'Thor: God of Thunder'},
      {title: 'The Avengers'},
      {title: 'Avengers: Age of Ultron'},
      {title: 'Avengers: Infinity War'}
    ]);
  })
  .catch(console.error);

// Server
const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors(), bodyParser.json());

// All movies with pagination
app.get('/movies', (req, res, next) => {
  // For pagination, there are different ways to do it:
  // 1) let the user decide the offset and limit
  // 2) Use a fixed limit and use some logic to calculate the offset
  // My prefered way is number 2
  // A request to this endpoint should be made with a URL query
  // like :4000/movies?page=1
  // The URL query in this example is called: page

  // save the value in a const
  const page = req.query.page || 1;
  // You can do some extra validation to be sure req.query.page is a number (parseInt)
  // but its not necessary for this pagination example 

  // Our fixed limit would be 5
  const limit = 5;

  // Our default offset should be 0
  let offset = 0;

  // Now we do some logic and math to decide the offset
  // We only have to do this if the page is larger than 1, otherwise offset can stay 0
  if (page > 1) {
    // We have a fixed limit. We use that to calculate the offset
    // If we want the result for page 3, we have to skip (offset) the first 10 results
    // So we do some math: offset = (page - 1) * limit
    // So that will be 10 = (3 - 1) * 5 === 10 = 2 * 5
    offset = (page - 1) * limit;
  }

  // Now we have our offset and limit, we select the data
  // But we also want to know how many rows there are in total. We use that for later logic
  // To do so we use: findAndCountAll
  Movie.findAndCountAll({offset, limit})
    .then(result => {
      // This sequelize query should return a object looking like:
      // {
      //   count: 12,  /* Total rows in the table */
      //   rows: [{}, {}, {}, {}, {}] /* Array of objects with the selected data */
      // }
      // now we can use count to calculate the number of pages
      // we need that for our front-end to do some 'logic'
      // we ceil the number because we cant have 2.3 pages, it should be 3 in that case
      const pages = Math.ceil(result.count / limit);

      // Now we've done all calculations and logic, we send everything to the client as 1 object
      res.status(200).send({ ...result, pages })
    })
    .catch(next)
});
app.listen(port, console.log(`App listening to port ${port}`));