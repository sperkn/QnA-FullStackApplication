// routes/student.js
// routes relating to student logged in with normal account
// this file will be used to render student's dashboard and 
// any pages pertaining to profile/settings 

const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect('/student-dashboard');
});


module.exports = router;