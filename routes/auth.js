const express      = require('express');
const mongoose     = require('mongoose');
const bcrypt       = require('bcrypt');
const passport     = require("passport");

const User = require('../models/user');

const router = express.Router();
const bcryptSalt = 10;

const auth = express();

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

//sign-up post route
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

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  });
});

//log-in post route
router.post('/login', (req, res, next) => {
  const {email, password} = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Enter both email and password to log in.'
    });
    return;
  }

  User.findOne({ email }, (err, theUser) => {
    if (err || theUser === null || !bcrypt.compareSync(password, theUser.password)) {
      res.render('auth/login', {
        errorMessage: `The email/password is invalid.`
      });
      return;
    }

    // if (!bcrypt.compareSync(password, theUser.password)) {
    //   res.render('auth/login', {
    //     errorMessage: 'Invalid password.'
    //   });
    //   return;
    // }

    req.session.currentUser = theUser;
    res.redirect('/');
  });
});

router.get('/logout', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/');
  });
});

module.exports = router;