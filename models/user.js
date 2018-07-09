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
  password: String,
  isLaunderer: { type: Boolean, default: false },
  fee: { type: Number, default: null }
});

userSchema.set('timestamps', true);

const User = mongoose.model('Users', userSchema);

module.exports = User;