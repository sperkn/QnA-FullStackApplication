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
  res.redirect('/login');
});

router.get('/community/question/:id', (req,res, next) =>{
  const questionId = req.params.id;

    Answer.find({question_id: questionId})
      .populate('user_id')
      .then(answers => {
        if(answers.length===0) {
          Question.findById(questionId)
            .populate('user_id')
            .then(question => {
            res.render('community/question', {
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
              res.render('community/question', {
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
})

module.exports = router;