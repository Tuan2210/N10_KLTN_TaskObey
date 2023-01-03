const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userName: {
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
});

module.exports = mongoose.model("Users", userSchema);