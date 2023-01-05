const router = require('express').Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// router.get('/', (req, res) => res.send('user route'));

//REGISTER
router.post('/register', async(req, res) => {
    const {userName, phoneNumber, password} = req.body

    if(!userName || !phoneNumber || !password)
        return res.status(400).json({success: false, message: 'Missing this User'});
    try {
        const user = await User.findOne({userName});

        if(user) return res.status(400).json({success: false, message: 'User existed'});

        const hashedPW = await argon2.hash(password);
        const newUser = new User({userName, phoneNumber, password: hashedPW});
        await newUser.save()

        //return token
        const accessToken = jwt.sign({userId: newUser._id}, process.env.JWT_ACCESS_KEY);

        res.json({success: true, message: 'register successfully', accessToken});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Error'});
    }
})

//LOGIN
router.post('/login', async(req, res) => {
    const {phoneNumber, password} = req.body

    if(!phoneNumber || !password)
        return res.status(400).json({success: false, message: 'Missing this User'});
    try {
        const userPhone = await User.findOne({phoneNumber});

        if(!userPhone) return res.status(400).json({success: false, message: 'Incorrect phone number'});

        const passwordValid = await argon2.verify(userPhone.password, password);
        if(!passwordValid) return res.status(400).json({success: false, message: 'Incorrect pw'});

        //return token
        const accessToken = jwt.sign({userId: userPhone._id}, process.env.JWT_ACCESS_KEY);

        res.json({success: true, message: 'login successfully', accessToken});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Error'});
    }
})

module.exports = router;