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

//DELETE A NOT FINISH TASK - dùng get vì có find id và xóa theo id
router.get("/deleteNotFinishTask/:taskId/:taskDetailId/:scheduleId", taskController.deleteNotFinishTask);

//UPDATE A NOT FINISH TASK
router.put("/updateNotFinishTask/:taskId/:taskDetailId/:scheduleId", taskController.updateNotFinishTask);

module.exports = router;