const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// function capitalize (val) {
//   if (typeof val !== 'string') val = '';
//   return val.charAt(0).toUpperCase() + val.substring(1);
// }

const qLikeSchema = new Schema({
  user_id: {type : Schema.Types.ObjectId, ref: 'Users', required: true},
  likedUser_id: {type : Schema.Types.ObjectId, ref: 'Users', required: true},
  question_id: {type : Schema.Types.ObjectId, ref: 'Questions', required: true},
});

qLikeSchema.set('timestamps', true);

const QLike = mongoose.model('qLikes', qLikeSchema);

module.exports = QLike;