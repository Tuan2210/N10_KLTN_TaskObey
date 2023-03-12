const mongoose = require("mongoose");
const dbName = "taskobeyDB";
const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
  },
  dayTime: {
    type: Date,
    require: true,
    default: Date.now,
  },
  status: {
    type: String,
  },
  userId: {
    type: String,
  },
});

module.exports = mongoose.model("tasks", taskSchema);