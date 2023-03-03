const router = require("express").Router();
const userController = require("../controllers/userController");

//GET USER NAME
router.get("/userName/:name", userController.getUserName);

//GET USER EMAIL
router.get("/userEmail/:email", userController.getUserEmail);

//GET USER PHONE-NUMBER
router.get("/userPhone/:phone", userController.getUserPhone);

//GET USER PW
router.get("/userPwByPhone/:phone/:password", userController.getUserPwByPhone);
router.get("/userPwByEmail/:email/:password", userController.getUserPwByEmail);

//CHANGE USER PW
router.post("/changePassword", userController.changePasswordWithPhoneNumber);

module.exports = router;