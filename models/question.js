const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: {type: String, lowercase: true, required: true},
  user_id: {type : ObjectId, ref: 'Users'},
  industry: [{type: String, required: true}],
  likes: {type: Number, default: 0},
  status: {type: String, enum : ['OPEN', 'CLOSED'], default : 'OPEN'}
});

questionSchema.set('timestamps', true);

const Question = mongoose.model('Questions', questionSchema);

module.exports = Question;