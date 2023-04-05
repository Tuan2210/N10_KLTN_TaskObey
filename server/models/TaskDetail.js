const mongoose = require("mongoose");
const dbName = "taskobeyDB";
const taskDetailSchema = new mongoose.Schema({
  taskId: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "tasks",
  },
  userId: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  scheduleId: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "schedules",
  },
  taskType: {
    type: String,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  reminderTime: {
    type: String,
  },
});

module.exports = mongoose.model("taskDetails", taskDetailSchema);
