const router = require("express").Router();
const taskController = require("../controllers/taskController");

//ADD TASK
router.post("/addTask", taskController.addTask);

//GET ALL TASKS NOT FINISH BY USERID
router.get("/notFinishTasks/:userId/:initialDate", taskController.getNotFinishTasksByUserIdAndInittialDate);
router.get("/notFinishTasks/:userId", taskController.getNotFinishTasksByUserId);

//GET ALL TASK DETAILS NOT FINISH BY TASKID
router.get("/notFinishTaskDetails/:taskId", taskController.getNotFinishTaskDetailsByTaskId);

//GET ALL TASKS FINISH BY USERID
router.get("/finishTasks/:userId", taskController.getFinishTasksByUserId);

//DELETE A NOT FINISH TASK
router.get("/deleteNotFinishTask/:taskId/:taskDetailId/:scheduleId", taskController.deleteNotFinishTask);

module.exports = router;