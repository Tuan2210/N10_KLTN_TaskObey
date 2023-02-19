const mongoose = require('mongoose');
const dbName = 'taskobeyDB';
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
    minlength: 10,
    maxlength: 12,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  refreshToken: {
    type: String,
  },
});

module.exports = mongoose.model("users", userSchema);