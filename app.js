require('dotenv').config();

const express      = require('express');
const mongoose     = require('mongoose');
const hbs          = require('hbs');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const path         = require('path');
const logger       = require('morgan');
// const passport     = require("passport");

const app = express();

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/QnA-WebApp')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

//Initialize HBS Helpers 
hbs.registerHelper('ifNotEquals', function (arg1, arg2, options) { 
  return (arg1 != arg2) ? options.fn(this) : options.inverse(this); 
});

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

//Middleware Setup  
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'ask and you shall receive',
  resave: true,
  saveUninitialized: true,
  cookie: { },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUserInfo = req.session.currentUser;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }

  next();
});

// app.use((req, res, next) => {
//   // Adds user domain to be accessed from hbs to be used with axios on heroku 
//   req.userDomain = process.env.DOMAIN;
//   if(req.user){
//   User.findById(req.user._id)
//     .then(user => {
//       req.user = user;
//     });
//   }
//   // Allows request to be accessed from handlebars
//   app.locals.req = req;
//   // console.log(req.url)
//   next();
// });

// Passport Middleware Configuration
const passport = require('./routes/auth');
// app.use(passport.initialize());
// app.use(passport.session());

// Express View engine setup
hbs.registerPartials(__dirname + '/views/partials');

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.locals.title = 'sperq - connecting you with experts';

//route connections
const index = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const communityRoutes = require('./routes/community');
const likesRoutes = require('./routes/likes');

app.use('/', index);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', communityRoutes);
app.use('/', likesRoutes);

module.exports = app;