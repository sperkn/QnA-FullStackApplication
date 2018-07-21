// const express = require('express');

// const User = require('../models/user');
// const Question = require('../models/question');
// const Answer = require('../models/answer');

// const router = express.Router();

// router.use((req, res, next) => {
//   if (req.session.currentUser) {
//     next();
//     return;
//   }
//   res.redirect('/login');
// });

// router.get('/ask', (req, res, next) => {
//   const user_id = req.session.currentUser._id; 
//   const {industry, question} = req.query;

//   const questionSubmission = {
//     user_id,
//     industry,
//     question
//   };

//   const userQuestion = new Question(questionSubmission);


//   userQuestion.save()
//     .then(res.redirect('/dashboard'))
//     .catch(err => {
//       console.log(err);
//       res.render('/', {
//         errorMessage: 'Something went wrong. Try again later.'
//       });
//       return;
//     })
// });

// // NEED TO FIX!!!!!
// // route for showing the question and any/all answers associated
// router.get('/question/:id', (req, res, next) => {
//   const questionId = req.params.id;

//   Answer.find({question_id: questionId})
//     .then(answers => {
//       // console.log(answers)
//       if(answers.length===0) {
//         Question.findById(questionId)
//           .then(question => {
//           res.render('question/post', {
//             thePost: question})
//           })
//           .catch(err => {
//           console.log(err);
//           next(err);
//           return;
//           })
//         }
//       else {
//         console.log("im here3");
//         Question.findById(questionId)
//           .then(question => {
//             res.render('question/post', {
//             thePost: question,
//             theAnswers: answers})
//           })
//           .catch(err => {
//             console.log(err);
//             next(err);
//             return;
//           })
//       }
//     })
//     .catch(err =>{
//       console.log(err);
//       next(err);
//       return;
//     })
// });

// // route for deleting a question
// router.get('/delete/:id', (req, res, next) => {
//   const questionId = req.params.id;

//   Question.findById(questionId)
//   .then(question => {
//     if (question.answers>0) {
//       res.render('user/dashboard', {
//         errorMessage: `A question with answers can't be deleted!`
//       });
//       return;
//     }
//     else {
//       question.remove();
//       res.redirect('/dashboard')
//       // res.render('user/dashboard')
//     }
//   })
//   .catch(err =>{
//     console.log(err);
//     next(err);
//     return;
//   })
//     // AndRemove(questionId)
//     // .then(res.redirect('/dashboard'))
//     // .catch(err => {
//     //   console.log(err);
//     //   next(err);
//     //   return;
//     // })
// });

// module.exports = router;
