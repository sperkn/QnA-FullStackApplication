const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function capitalize (val) {
  if (typeof val !== 'string') val = '';
  return val.charAt(0).toUpperCase() + val.substring(1);
}

const answerSchema = new Schema({
  answer: {type: String, set: capitalize, required: true},
  user_id: {type : Schema.Types.ObjectId, ref: 'Users', required: true},
  question_id: {type : Schema.Types.ObjectId, ref: 'Questions', required: true},
  likes: {type: Number, default: 0},
  status: {type: String, enum : ['OPEN', 'FLAGGED'], default : 'OPEN'}
});

answerSchema.set('timestamps', true);

const Answer = mongoose.model('Answers', answerSchema);

module.exports = Answer;