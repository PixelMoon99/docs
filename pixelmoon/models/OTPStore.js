const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  email: String,
  codeHash: String,
  used: {type:Boolean, default:false},
  createdAt: {type:Date, default:Date.now},
  expiresAt: Date
});
module.exports = mongoose.model('OTPStore', schema);
