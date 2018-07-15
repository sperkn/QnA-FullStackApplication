const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function capitalize (val) {
  if (typeof val !== 'string') val = '';
  return val.charAt(0).toUpperCase() + val.substring(1);
}

const userSchema = new Schema({
  firstName: {type: String, set: capitalize, required: true},
  lastName: {type: String, set: capitalize, required: true},
  email: {type: String, required: true},
  password: {type: String,  minlength: 8, required: true},
  role: {type: String, enum : ['GUEST', 'ADMIN', 'BOSS'], default : 'GUEST'},
  avatarUrl: {type: String, default: '/images/default-avatar.png'},
  account: {type: String, enum : ['STUDENT', 'EXPERT', 'HIDDEN', 'CLOSED'], default : 'STUDENT'}
});

userSchema.set('timestamps', true);

const User = mongoose.model('Users', userSchema);

module.exports = User;