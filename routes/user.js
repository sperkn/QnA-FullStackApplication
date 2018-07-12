// routes/student.js
// routes relating to users logged in for
// rendering users dashboard and pages
// pertaining to profile/settings 

const express = require('express');
// const mongoose     = require('mongoose');
const User = require('../models/user');
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

  res.render('user/dashboard');
});

module.exports = router;