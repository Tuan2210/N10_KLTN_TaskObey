const mongoose = require("mongoose");
const { Task, TaskDetail, Schedule } = require("../models");

const moment = require("moment");

const taskController = {
  //ADD TASK
  addTask: async (req, res) => {
    const {
      taskName,
      initialDate,
      userId,
      taskDetailId,
      scheduleId,
      taskType,
      description,
      priority,
      startTime,
      endTime,
      reminderTime,
      duration,
      deadline,
      repeat,
    } = req.body;

    if (!taskName || !userId)
      return res
        .status(400)
        .json({ success: false, message: "Missing this task" });

    try {
      //task
      const newTask = new Task({
        taskName,
        initialDate,
        status: "Chưa hoàn thành",
        finishDateTime: "",
        userId,
        taskDetailId: new mongoose.Types.ObjectId(),
      });
      await newTask.save();
      // res.json(newTask);

      //details task
      if (!newTask._id)
        return res
          .status(400)
          .json({ success: false, message: "Missing taskId in taskDetail" });
      const newTaskDetail = new TaskDetail({
        _id: newTask.taskDetailId,
        taskId: newTask._id,
        userId: newTask.userId,
        scheduleId: new mongoose.Types.ObjectId(),
        taskType,
        description,
        priority,
        startTime,
        endTime,
        reminderTime,
      });
      await newTaskDetail.save();

      //schedule
      if (!newTask._id || !newTaskDetail._id)
        return res
          .status(400)
          .json({ success: false, message: "Missing taskId or taskDetailId" });
      const newSchedule = new Schedule({
        _id: newTaskDetail.scheduleId,
        taskId: newTask._id,
        taskDetailId: newTaskDetail._id,
        userId: newTask.userId,
        duration,
        deadline,
        repeat,
      });
      await newSchedule.save();

      res.json([newTask, newTaskDetail, newSchedule]);
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
        // initialDate: req.params.initialDate,
        status: "Chưa hoàn thành",
      })
        .populate({ path: "taskDetailId", populate: { path: "scheduleId" } })
        .exec(function (err, tasks) {
          if (err) res.status(500).json(err);
          res.status(200).json(tasks);
        });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //GET ALL TASKS NOT FINISH BY USERID AND INITIAL DATE
  getNotFinishTasksByUserIdAndInittialDate: async (req, res) => {
    try {
      // await TaskDetail.find({
      //   userId: req.params.userId,
      //   initialDate: req.params.initialDate,
      //   status: "Chưa hoàn thành",
      // }).populate('taskId').then((resData1) => res.json(resData1));

      await Task.find({
        userId: req.params.userId,
        initialDate: req.params.initialDate,
        status: "Chưa hoàn thành",
      })
        .populate({ path: "taskDetailId", populate: { path: "scheduleId" } })
        .exec(function (err, tasks) {
          if (err) res.status(500).json(err);
          res.status(200).json(tasks);
        });

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

  //GET ALL DETAIL-TASKS NOT FINISH BY USERID
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

  //DELETE A NOT FINISH TASK
  deleteNotFinishTask: async (req, res) => {
    try {
      await Task.find({ _id: req.params.taskId }).then((data) => {
        {
          data.map((item, index) => {
            Task.deleteOne({ _id: item._id }).then(
              console.log("deleted taskId:", item._id)
            );
          });
        }
      });
    } catch (error) {
      res.status(500).json(error);
    }

    try {
      await TaskDetail.find({ _id: req.params.taskDetailId }).then((data) => {
        {
          data.map((item, index) => {
            TaskDetail.deleteOne({ _id: item._id }).then(
              console.log("deleted taskDetailId:", item._id)
            );
          });
        }
      });
    } catch (error) {
      res.status(500).json(error);
    }

    try {
      await Schedule.find({ _id: req.params.scheduleId }).then((data) => {
        {
          data.map((item, index) => {
            Schedule.deleteOne({ _id: item._id }).then(
              console.log("deleted scheduleId:", item._id)
            );
          });
        }
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //UPDATE NOT FINISH TASK
  updateNotFinishTask: async (req, res) => {
    const {
      taskName,
      description,
      taskType,
      priority,
      reminderTime,
      repeat,
      startTime,
      endTime,
    } = req.body;
    try {
      await Task.findOneAndUpdate(
        { _id: req.params.taskId },
        { taskName: taskName },
        { new: true }
      ).then((updated) => console.log(updated));
      await TaskDetail.findOneAndUpdate(
        { _id: req.params.taskDetailId },
        {
          taskType: taskType,
          description: description,
          priority: priority,
          startTime: startTime,
          endTime: endTime,
          reminderTime: reminderTime,
        },
        { new: true }
      ).then((updated) => console.log(updated));
      await Schedule.findOneAndUpdate(
        { _id: req.params.scheduleId },
        { repeat: repeat },
        { new: true }
      ).then((updated) => console.log(updated));
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //UPDATE STATUS TASK
  updateStatusTask: async (req, res) => {
    const { finishDateTime } = req.body;
    try {
      const resTask = await Task.findOneAndUpdate(
        { _id: req.params.taskId },
        { status: "Hoàn thành", finishDateTime: finishDateTime },
        { new: true }
      );
      // .then(async (updated) => {
      //   // await Task.find({ _id: updated._id }).then((data) => {
      //   //   res.status(200).json(data);
      //   // });
      // });

      const resTaskDetail = await TaskDetail.find({
        taskId: req.params.taskId,
      });
      res.status(200).json([resTask, resTaskDetail]);
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
      })
        .populate({ path: "taskDetailId", populate: { path: "scheduleId" } })
        .exec(function (err, tasks) {
          if (err) res.status(500).json(err);
          res.status(200).json(tasks);
        });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //COUNT NOT-FINISH + FINISH TASK BY THE DAY
  countTaskByTheDay: async (req, res) => {
    try {
      await Task.find({ userId: req.params.userId })
        .populate({ path: "taskDetailId", populate: { path: "scheduleId" } })
        .exec(async function (err, tasks) {
          if (err) res.status(500).json(err);
          // res.status(200).json(tasks);

          const arrNotFinishByDate = [];
          const arrFinishByDate = [];
          tasks.forEach((task) => {
            ////not finish
            if (task.status === "Chưa hoàn thành") {
              const startDate = moment(task.taskDetailId.startTime, "D/M/YYYY");
              if (arrNotFinishByDate[startDate]) {
                arrNotFinishByDate[startDate]++;
              } else {
                arrNotFinishByDate[startDate] = 1;
              }
            }

            ////finish
            if (task.status === "Hoàn thành") {
              const startDate = moment(task.taskDetailId.startTime, "D/M/YYYY");
              if (arrFinishByDate[startDate]) {
                arrFinishByDate[startDate]++;
              } else {
                arrFinishByDate[startDate] = 1;
              }
            }
          });
          const countNotFinishByDate = Object.values(arrNotFinishByDate);
          const countFinishByDate = Object.values(arrFinishByDate);
          // console.log("CHT theo ngày", countNotFinishByDate);
          // console.log("HT theo ngày", countFinishByDate);

          const resultArray = [];
          const dates = Object.keys(countNotFinishByDate);
          if (
            countNotFinishByDate.every((key) => countFinishByDate.includes(key))
          ) {
            // console.log("same key");
            dates.forEach((date) => {
              //   console.log(countFinishByDate[date]); //show values
              if (countNotFinishByDate[date] !== undefined) {
                resultArray.push(countNotFinishByDate[date]);
              } else {
                resultArray.push(0);
              }

              if (countFinishByDate[date] !== undefined) {
                resultArray.push(countFinishByDate[date]);
              } else {
                resultArray.push(0);
              }
            });
          }
          // console.log(resultArray);
          res.status(200).json(resultArray);
        });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = taskController;
