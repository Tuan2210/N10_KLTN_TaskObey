const { Task } = require("../models");

const taskController = {
  //ADD TASK
  addTask: async (req, res) => {
    const { taskName, dayTime, status, userId } = req.body;

    if (!taskName || !userId)
      return res
        .status(400)
        .json({ success: false, message: "Missing this task" });

    try {
      const newTask = new Task({
        taskName,
        dayTime,
        status: "Chưa hoàn thành",
        userId,
      });
      await newTask.save();

      res.json(newTask);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error" });
    }
  },

  //GET ALL TASKS NOT FINISH BY USERID
  getNotFinishTasksByUserId: async (req, res) => {
    try {
      await Task.find({
        userId: req.params.userId,
        status: "Chưa hoàn thành",
      }).then((data) => res.status(200).json(data));
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = taskController;