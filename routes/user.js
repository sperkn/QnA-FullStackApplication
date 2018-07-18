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
  // let user = req.session.currentUser._id; 
  // populate('user_id', 'firstName')
  // path: 'user_id', select: 'firstName -_id'
  Question.find()
  .populate({path: 'user_id', select: 'firstName avatarUrl -_id'})
  .sort({createdAt:-1})
  .exec( (err, communityQuestions) => { 
    if (err) {
      console.log(err);
      next(err);
      return;
    }
    console.log(communityQuestions);
    res.render('user/feed', {
      questions: communityQuestions
    });
  });
});

router.get('/profile', (req, res, next) => {
  res.render('user/profile');
});


module.exports = router;