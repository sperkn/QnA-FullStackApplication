const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  answer: {type: String, lowercase: true, required: true},
  user_id: {type : ObjectId, ref: 'Users', required: true},
  question_id: {type : ObjectId, ref: 'Questions', required: true},
  likes: {type: Number, default: 0},
});

answerSchema.set('timestamps', true);

const Answer = mongoose.model('Answers', answerSchema);

module.exports = Answer;