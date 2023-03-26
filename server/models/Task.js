const mongoose = require("mongoose");
const dbName = "taskobeyDB";
const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
  },
  dayTime: {
    type: String,
    require: true,
    default: new Date().toISOString().split("T")[0],
  },
  status: {
    type: String,
  },
  userId: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  // taskDetailsId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "taskDetails",
  // },
});

module.exports = mongoose.model("tasks", taskSchema);