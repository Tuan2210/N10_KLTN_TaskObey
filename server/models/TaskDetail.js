const mongoose = require("mongoose");
const dbName = "taskobeyDB";
const taskDetailSchema = new mongoose.Schema({
  idTask: {
    type: String,
  },
  idUser: {
    type: String,
  },
  idSchedule: {
    type: String,
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
    type: Date,
  },
  endTime: {
    type: Date,
  },
  reminderTime: {
    type: Date,
  },
});

module.exports = mongoose.model("taskDetails", taskDetailSchema);
