const mongoose = require("mongoose");
const dbName = "taskobeyDB";
const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
  },
  initialDate: {
    type: String,
    require: true,
    default: new Date().toISOString().split("T")[0],
  },
  status: {
    type: String,
  },
  finishDateTime: {
    type: String,    
  },
  userId: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  taskDetailId: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "taskDetails",
  },
  // scheduleId: {
  //   // type: String,
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "schedules",
  // },
});

module.exports = mongoose.model("tasks", taskSchema);