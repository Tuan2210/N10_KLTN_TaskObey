const router = require("express").Router();
const taskController = require("../controllers/taskController");

//ADD TASK
router.post("/addTask", taskController.addTask);

//GET ALL TASKS NOT FINISH BY USERID
router.get("/notFinishTasks/:userId/:initialDate", taskController.getNotFinishTasksByUserIdAndInittialDate);
router.get("/notFinishTasks/:userId", taskController.getNotFinishTasksByUserId);

//GET ALL TASK DETAILS NOT FINISH BY TASKID
router.get("/notFinishTaskDetails/:taskId", taskController.getNotFinishTaskDetailsByTaskId);

//DELETE A NOT FINISH TASK - dùng get vì có find id và xóa theo id
router.get("/deleteNotFinishTask/:taskId/:taskDetailId/:scheduleId", taskController.deleteNotFinishTask);

//UPDATE A NOT FINISH TASK
router.put("/updateNotFinishTask/:taskId/:taskDetailId/:scheduleId", taskController.updateNotFinishTask);

//UPDATE STATUS TASK
router.put("/updateStatusTask/:taskId", taskController.updateStatusTask);

//GET ALL TASKS FINISH BY USERID
router.get("/finishTasks/:userId", taskController.getFinishTasksByUserId);

//COUNT NOT-FINISH + FINISH TASK BY THE DAY
router.get("/countTaskByTheDay/:userId/:numberOfDay/:numberOfMonth/:numberOfYear", taskController.countTaskByTheDay);

//COUNT NOT-FINISH + FINISH TASK BY THE MONTH
router.get("/countTaskByTheMonth/:userId/:numberOfMonth/:numberOfYear", taskController.countTaskByTheMonth);

//COUNT NOT-FINISH + FINISH TASK BY THE YEAR
// router.get("/countTaskByTheYear/:userId", taskController.countTaskByTheYear);

module.exports = router;