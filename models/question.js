const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  user_id: {type : Schema.Types.ObjectId, ref: 'Users', required:true},
  industry: {type: String, required: true},
  question: {type: String, lowercase: true, required: true},
  likes: {type: Number, default: 0},
  status: {type: String, enum : ['OPEN', 'CLOSED'], default : 'OPEN'}
});

questionSchema.set('timestamps', true);

const Question = mongoose.model('Questions', questionSchema);

module.exports = Question;