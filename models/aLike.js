const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// function capitalize (val) {
//   if (typeof val !== 'string') val = '';
//   return val.charAt(0).toUpperCase() + val.substring(1);
// }

const aLikeSchema = new Schema({
  user_id: {type : Schema.Types.ObjectId, ref: 'Users', required: true},
  likedUser_id: {type : Schema.Types.ObjectId, ref: 'Users', required: true},
  answer_id: {type : Schema.Types.ObjectId, ref: 'Answers', required: true},
});

aLikeSchema.set('timestamps', true);

const ALike = mongoose.model('aLikes', aLikeSchema);

module.exports = ALike;