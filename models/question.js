const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function capitalize (val) {
  if (typeof val !== 'string') val = '';
  return val.charAt(0).toUpperCase() + val.substring(1);
}

function questionMark (val) {
  let lastChar = val.slice(-1);
  if(lastChar == '?') { return val; }
  else {
    return val+"?";
  }
}

const questionSchema = new Schema({
  user_id: {type : Schema.Types.ObjectId, ref: 'Users', required:true},
  industry: {type: String, set: capitalize, required: true},
  question: {type: String, set: capitalize, set: questionMark, required: true},
  answers: {type: Number, default: 0},
  likes: {type: Number, default: 0},
  status: {type: String, enum : ['Open', 'Closed'], default : 'Open'}
});

questionSchema.set('timestamps', true);

const Question = mongoose.model('Questions', questionSchema);

module.exports = Question;