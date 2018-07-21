require('dotenv').config();

const express      = require('express');
const mongoose     = require('mongoose');
const bcrypt       = require('bcrypt');
const passport     = require("passport");
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


const User = require('../models/user');

const router = express.Router();
const bcryptSalt = 10;
router.use(passport.initialize());
router.use(passport.session());

const auth = express();

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

//sign-up post route NORMAL USER
router.post('/signup', (req, res, next) => {
  const {firstName, lastName, email, password} = req.body;

  if (firstName === ''|| lastName === '' || email === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Enter missing field above to join!'
    });
    return;
  }

  User.findOne({ email }, '_id', (err, existingUser) => {
    if (err) {
      next(err);
      return;
    }

    if (existingUser !== null) {
      res.render('auth/signup', {
        errorMessage: `The email ${email} is already in use.`
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(password, salt);

    const userSubmission = {
      firstName,
      lastName,
      email,
      password: hashedPass
    };

    const theUser = new User(userSubmission);

    theUser.save((err) => {
      if (err) {
        res.render('auth/signup', {
          errorMessage: 'Something went wrong. Try again later.'
        });
        return;
      }

      res.redirect('/');
    });
  });
});

// route for log-in page
router.get('/login', (req, res, next) => {
  res.render('index', {
    errorMessage: ''
  });
});

// middleware for using LinkedIn API to login with linkedin credentials
passport.serializeUser(function(user, cb) { cb(null, user); });
passport.deserializeUser(function(obj, cb) { cb(null, obj);  });


passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
    req.session.accessToken = accessToken;
  // asynchronous verification, for effect...
  process.nextTick(function () {
    // const linkedinId = profile.id;
    // const firstName = profile.firstname;
    // const lastName = profile.lastname;
    // const email = profile.emailaddress;
    // const headline = profile.headline;
    // const position = profile.positions;
    // const profileUrl = profile.publicprofileurl;
    // const avatarUrl = profile.pictureurl;

  // const {
  //   id:linkedinId, 
  //   "first-name":firstName,
  //   "last-name":lastName, 
  //   "email-address":email,
  //   headline,
  //   positions:position,
  //   "public-profile-url":profileUrl,
  //   "picture-url":avatarUrl} = profile;
    
  // let newUser = new User({
  //   linkedinId,
  //   firstName,
  //   lastName,
  //   email,
  //   headline,
  //   position,
  //   profileUrl,
  //   avatarUrl,
  //   account: "EXPERT"
  // });

  // User.find({'linkedinId': linkedinId}, (err, userCheck)=> {
  //   if (err) { res.status(500).send('Something broke!') }
  //   if (!userCheck.length) {
  //       newUser.save(newUser, (err) => {
  //           return done(err, newUser);
  //       })
  //     }
  //   else {return done(err, newUser);}
  // })
    console.log("profile", profile);
    return done(null, profile);
  });
}));

// routes to handle linkedin log-in
router.get('/auth/linkedin',
  passport.authenticate('linkedin'));

router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }

// router.get('/auth/linkedin',
//   passport.authenticate('linkedin'),
//   function(req, res){
//     // The request will be redirected to LinkedIn for authentication, so this
//     // function will not be called.
// });

// router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     // failureFlash: true
// })
// );

//log-in post route normal user
router.post('/', (req, res, next) => {
  const {email, password} = req.body;

  if (email === '' || password === '') {
    res.render('index', {
      errorMessage: 'Enter both email and password to log in.'
    });
    return;
  }

  User.findOne({ email }, (err, theUser) => {
    if (err || theUser === null || !bcrypt.compareSync(password, theUser.password)) {
      res.render('index', {
        errorMessage: `The email/password is invalid.`
      });
      return;
    }
    req.session.currentUser = theUser;
    res.redirect('/');
  });
});

router.get('/logout', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }

  req.session.destroy()
    .then(res.redirect('/'))
    .catch(err => {
      console.log(err);
      next(err);
      return;
    })

  // req.session.destroy((err) => {
  //   if (err) {
  //     next(err);
  //     return;
  //   }

  //   res.redirect('/');
  // });

});

module.exports = router;