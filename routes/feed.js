const express = require('express');
const mongoose     = require('mongoose');
const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');

const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }
  res.redirect('/');
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

router.get('/feed/question/:id', (req,res, next) =>{
  const questionId = req.params.id;

    Answer.find({question_id: questionId})
      .populate('user_id')
      .sort({likes:-1})
      .then(answers => {
        if(answers.length===0) {
          Question.findById(questionId)
            .populate('user_id')
            .then(question => {
            res.render('feed/question', {
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
              res.render('feed/question', {
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

router.post('/answer', (req, res, next) => {
  const user_id = req.session.currentUser._id;
  const {answer, question_id} = req.body;

  const answerSubmission = {
    answer,
    user_id,
    question_id
  };

  const userAnswer = new Answer(answerSubmission);

  userAnswer.save()
    .then(res.redirect(`/feed/question/${question_id}`))
    .catch(err => {
      console.log(err);
      res.render('/', {
      errorMessage: 'Something went wrong. Try again later.'
      });
      return;
    })
});

router.post('/feed/like/:id',(req, res, next) => {
  const user_id = req.session.currentUser._id;
});

module.exports = router;