require('dotenv').config();

const express      = require('express');
const mongoose     = require('mongoose');
const hbs          = require('hbs');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
// const session      = require('express-session');
// const MongoStore   = require('connect-mongo')(session);
const path         = require('path');
const logger       = require('morgan');

const app = express();

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/QnA-WebApp')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

//Middleware Setup  
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(mongoose());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials');

app.locals.title = 'Sperk - Connecting You With The Experts';

//route connections
const index = require('./routes/index');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
app.use('/', index);
app.use('/', authRoutes);
app.use('/', studentRoutes);

module.exports = app;