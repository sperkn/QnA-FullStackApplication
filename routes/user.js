// routes/user.js
// routes relating to users functionality,
// (asking questions, rendering users dashboard and pages
// pertaining to profile/settings 

const express = require('express');
const mongoose     = require('mongoose');
const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
// const passport     = require("passport");

const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }
  res.redirect('/login');
});

// route for asking a question(and saving to the db)
router.post('/ask', (req, res, next) => {
  const user_id = req.session.currentUser._id; 
  const {industry, question} = req.body;

  const questionSubmission = {
    user_id,
    industry,
    question
  };

  const userQuestion = new Question(questionSubmission);

  userQuestion.save()
    .then(res.redirect('/dashboard'))
    .catch(err => {
      console.log(err);
      res.render('/', {
        errorMessage: 'Something went wrong. Try again later.'
      });
      return;
    })
});

// route for showing the user's dashboard/questions
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

// route for showing the question and any/all answers associated
router.get('/question/:id', (req, res, next) => {
  const questionId = req.params.id;

  Answer.find({question_id: questionId})
    .populate('user_id')
    .then(answers => {
      // console.log(answers)
      if(answers.length===0) {
        Question.findById(questionId)
          .populate('user_id')
          .then(question => {
          res.render('user/question', {
            thePost: question})
          })
          .catch(err => {
          console.log(err);
          next(err);
          return;
          })
        }
      else {
        Question.findById(questionId)
          .populate('user_id')
          .then(question => {
            res.render('user/question', {
            thePost: question,
            theAnswers: answers})
          })
          .catch(err => {
            console.log(err);
            next(err);
            return;
          })
      }
    })
    .catch(err =>{
      console.log(err);
      next(err);
      return;
    })
});

// route for deleting a question
router.get('/delete/:id', (req, res, next) => {
  const questionId = req.params.id;

  Question.findById(questionId)
  .then(question => {
    if (question.answers>0) {
      res.render('user/dashboard', {
        errorMessage: `A question with answers can't be deleted!`
      });
      return;
    }
    else {
      question.remove();
    }
  })
  .then(res.redirect('/dashboard'))
  .catch(err =>{
    console.log(err);
    next(err);
    return;
  })
});

// router.get('/feed', (req, res, next) => {
//   Question.find()
//   .populate('user_id')
//   .sort({createdAt:-1})
//   .then(communityQuestions => {
//     res.render('user/feed', {
//       questions: communityQuestions
//     })
//   })
//   .catch(err => {
//     console.log(err);
//     next(err);
//     return;
//   })
// });

router.get('/user/profile/:id', (req, res, next) => {
  const user_id = req.session.currentUser._id;

  User.findById(user_id)
  res.render('user/profile');
});


module.exports = router;