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

router.get('/post/:id', (req, res, next) => {
  const questionId = req.params.id;

  Question.findById(questionId, (err, theQuestion) => {
    if (err) {
      next(err);
      return;
    }

    res.render('question/post', {
      thePost: theQuestion
    });
  });
});

router.get('/ask', (req, res, next) => {
  const user_id = req.session.currentUser._id; 
  const {industry, question} = req.query;

  const questionSubmission = {
    user_id,
    industry,
    question
  };

  const userQuestion = new Question(questionSubmission);

  userQuestion.save((err) => {
    if (err) {
      console.log(err);
      res.render('/', {
        errorMessage: 'Something went wrong. Try again later.'
      });
      return;
    }
    res.redirect('/dashboard');
  });
});

module.exports = router;
