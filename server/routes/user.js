const router = require("express").Router();
const userController = require("../controllers/userController");

//GET USER NAME
router.get("/userName/:name", userController.getUserName);

//GET USER EMAIL
router.get("/userEmail/:email", userController.getUserEmail);

//GET USER PHONE-NUMBER
router.get("/userPhone/:phone", userController.getUserPhone);

//GET USER PW
router.get("/userPW/:phone/:password", userController.getUserPW);

module.exports = router;