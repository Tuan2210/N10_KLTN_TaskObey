const router = require("express").Router();
const userController = require("../controllers/userController");

//GET USER NAME
router.get("/userName/:name", userController.getUserName);

//GET USER PHONE-NUMBER
router.get("/userPhone/:phone", userController.getUserPhone);

module.exports = router;