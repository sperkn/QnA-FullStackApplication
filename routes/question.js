const express = require('express');

const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');

const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect('/login');
});
