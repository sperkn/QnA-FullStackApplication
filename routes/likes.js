const express = require('express');
const mongoose     = require('mongoose');
// const User = require('../models/user');
// const Question = require('../models/question');
// const Answer = require('../models/answer');
// // const QLikes = require('../models/qLike');
// const ALikes = require('../models/aLike');

const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }
  res.redirect('/login');
});

router.get('/like/answer/:id', (req, res, next) => {
  const user_id = req.session.currentUser._id; 

})

module.exports = router;