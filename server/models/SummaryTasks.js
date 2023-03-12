const mongoose = require("mongoose");
const dbName = "taskobeyDB";
const summaryTasksSchema = new mongoose.Schema({
  idUser: {
    type: String,
  },
  quantityTasks: {
    type: Number
  },
  quantityFinishTasks: {
    type: Number 
  }
});

module.exports = mongoose.model("summarytasks", taskSchema);
