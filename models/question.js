const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function capitalize (val) {
  if (typeof val !== 'string') val = '';
  return val.charAt(0).toUpperCase() + val.substring(1);
}

const questionSchema = new Schema({
  user_id: {type : Schema.Types.ObjectId, ref: 'Users', required:true},
  industry: {type: String, set: capitalize, required: true},
  question: {type: String, set: capitalize, required: true},
  answers: {type: Number, default: 0},
  likes: {type: Number, default: 0},
  status: {type: String, enum : ['open', 'closed'], default : 'open'}
});

questionSchema.set('timestamps', true);

const Question = mongoose.model('Questions', questionSchema);

module.exports = Question;