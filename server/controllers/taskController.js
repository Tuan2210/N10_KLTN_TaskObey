const { Task, TaskDetail } = require("../models");

const taskController = {
  //ADD TASK
  addTask: async (req, res) => {
    const {
      taskName,
      initialDate,
      userId,
      // taskDetailsId,
      scheduleId,
      taskType,
      description,
      priority,
      startTime,
      endTime,
      reminderTime,
    } = req.body;

    if (!taskName || !userId)
      return res.status(400).json({ success: false, message: "Missing this task" });

    try {
      //task
      const newTask = new Task({
        taskName,
        initialDate,
        status: "Chưa hoàn thành",
        userId,
        // taskDetailsId,
      });
      await newTask.save();
      // res.json(newTask);

      //details task
      if (!newTask._id)
        return res.status(400).json({ success: false, message: "Missing taskId in taskDetail" });
      const newTaskDetail = new TaskDetail({
        taskId: newTask._id,
        userId: newTask.userId,
        scheduleId,
        taskType,
        description,
        priority,
        startTime,
        endTime,
        reminderTime,
      });
      await newTaskDetail.save();

      res.json([newTask, newTaskDetail]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error" });
    }
  },

  //GET ALL TASKS NOT FINISH BY USERID
  getNotFinishTasksByUserId: async (req, res) => {
    try {
      await TaskDetail.find({
        userId: req.params.userId,
        initialDate: req.params.initialDate,
        status: "Chưa hoàn thành",
      }).populate('taskId').then((resData1) => res.json(resData1));

      // const taskDetail = await TaskDetail.findOne({dayTime: "2023-03-25"}).populate('taskId');
      // res.json(taskDetail);

      // const pineline = [
      //   { $match: {"_id": req.params.taskId} },
      //   { $lookup: {
      //       from: "taskdetails",
      //       localField: "_id",
      //       foreignField: "taskId",
      //       as: "details"
      //     }
      //   }
      // ];
      // Task.aggregate(pineline).exec().then((queryTask) => {
      //   res.json(queryTask)
      // }).catch(err => next(err));

      // TaskDetail.find().populate({
      //     "path": "task",
      //     "match": { "status": "task" }
      // }).exec(function(err,entries) {
      //   // Now client side filter un-matched results
      //   entries = entries.filter(function(entry) {
      //     res.json(entry.task)
      //       // return entry.task != null;
      //   });
      //   // Anything not populated by the query condition is now removed
      // });

      // TaskDetail.find().populate('tasks').exec(function(err, taskDetails) {
      //   if(err) res.status(500).json(err);
      //   res.status(200).json(taskDetails.taskId)
      // })

    } catch (error) {
      res.status(500).json(error);
    }


    // TaskDetail.find().populate('taskId').exec(function(err, tasks) {
    //   if(err) throw err;

    //   var specificTask = [];
    //   tasks.forEach(function(task) {
    //     task.taskDetailsId.forEach(function(taskDetail) {
    //       specificTask.push(taskDetail._id);
    //     });
    //   });
    //   res.json(specificTask);
    // });


  },

  //GET ALL TASKS NOT FINISH BY USERID
  getNotFinishTaskDetailsByTaskId: async (req, res) => {
    try {
      await TaskDetail.find({
        taskId: req.params.taskId,
        // userId: req.params.userId,
      }).then((resData2) => {
        res.json(resData2);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //GET ALL TASKS FINISH BY USERID
  getFinishTasksByUserId: async (req, res) => {
    try {
      await Task.find({
        userId: req.params.userId,
        status: "Hoàn thành",
      }).then((data) => res.status(200).json(data));
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = taskController;