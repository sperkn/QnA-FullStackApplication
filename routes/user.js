// routes/user.js
// routes relating to users logged in for
// rendering users dashboard and pages
// pertaining to profile/settings 

const express = require('express');
const mongoose     = require('mongoose');
const User = require('../models/user');
const Question = require('../models/question');
// const passport     = require("passport");

const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect('/login');
});


router.get('/dashboard', (req, res, next) => {
  let user = req.session.currentUser._id;
  Question.find({user_id: user}, (err, userQuestions) => { 
    if (err) {
      console.log(err);
      next(err);
      return;
    }
    res.render('user/dashboard', {
      questions: userQuestions
    });
  });
});

router.get('/feed', (req, res, next) => {
  Question.find()
  .populate('user_id')
  .sort({createdAt:-1})
  .then(communityQuestions => {
    res.render('user/feed', {
      questions: communityQuestions
    })
  })
  .catch(err => {
    console.log(err);
    next(err);
    return;
  })
});

router.get('/profile', (req, res, next) => {
  res.render('user/profile');
});


module.exports = router;