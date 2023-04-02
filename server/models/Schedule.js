const mongoose = require("mongoose");
const dbName = "taskobeyDB";
const scheduleSchema = new mongoose.Schema({
  taskId: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "tasks",
  },
  taskDetailId: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "taskDetails",
  },
  userId: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  duration: {
    type: String
  },
  deadline: {
    type: String
  },
  repeat: {
    type: String
  }
});

module.exports = mongoose.model("schedules", scheduleSchema);
