require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const hbs      = require('hbs');

const app = express();

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/QnA-WebApp', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });
  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');