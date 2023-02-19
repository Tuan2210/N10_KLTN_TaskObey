const router = require('express').Router();
// const argon2 = require('argon2');
// const jwt = require('jsonwebtoken');

// const User = require('../models/User');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const middlewareController = require('../controllers/middlewareController')

// router.get('/', (req, res) => res.send('user route'));

//demo get users
router.get('/users', userController.getAllUsers);

//demo get all numbers
// router.get('/phones', userController.getAllNumber);

//REGISTER
router.post('/register', userController.addUser);

//LOGIN
router.post("/loginEmail", authController.loginUserEmail);
router.post('/loginPhone', authController.loginUserPhone);

//LOGOUT
router.post('/logout', middlewareController.verifyToken, authController.userLogout);

module.exports = router;