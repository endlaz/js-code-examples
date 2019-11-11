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
  const page = req.query.page || 1;
  const limit = 5;
  let offset = 0;

  if (page > 1) {
    offset = (page - 1) * limit;
  }

  Movie.findAndCountAll({
    order: [['id', 'DESC']],
    offset, 
    limit})
    .then(result => {
      const pages = Math.ceil(result.count / limit);
      res.status(200).send({ ...result, pages })
    })
    .catch(next)
});

// Create movie
app.post('/movies', (req, res, next) => {
  const { title } = req.body;

  // Check if title is set
  if (title) {
    // Add the movie title to the database
    Movie.create({title})
      .then(result => {
        res.status(201).send(result);
      })
      .catch(next)
  } else {
    // Title was false (not set or empty)
    res.status(400).send('Provide a title');
  }
});

// Delete movie
app.delete('/movies/:id', (req, res, next) => {
  const { id } = req.params;

  // Find the movie first
  Movie.findByPk(id)
    .then(movie => {
      if (!movie) { // Movie not found
        res.status(404).end();
      } else {
        movie.destroy()
        .then(result => {
          res.status(200).end();
        })
      }
    })
    .catch(next);
});
app.listen(port, console.log(`App listening to port ${port}`));