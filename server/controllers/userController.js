const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

const userController = {
    //REGISTER acc is add user
    addUser: async(req, res) => {
        try {
			const newUser = new User(req.body);
			const saveUser = await newUser.save();
			res.status(200).json(saveUser);
		} catch (error) {
			res.status(500).json(error);
		}

        // const {userName, phoneNumber, password} = req.body

        // if(!userName || !phoneNumber || !password)
        //     return res.status(400).json({success: false, message: 'Missing this User'});
        // try {
        //     const user = await User.findOne({userName});

        //     if(user) return res.status(400).json({success: false, message: 'User existed'});

        //     const hashedPW = await argon2.hash(password);
        //     const newUser = new User({userName, phoneNumber, password: hashedPW});
        //     await newUser.save()

        //     //return token
        //     // const accessToken = jwt.sign({userId: newUser._id}, process.env.JWT_ACCESS_KEY);

        //     res.json({success: true, message: 'register successfully'});
        // } catch (error) {
        //     console.log(error);
        //     res.status(500).json({success: false, message: 'Error'});
        // }
    },

    //GET ALL USERS
	getAllUsers: async (_req, res) => {
		try {
			const users = await User.find();
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json(error);
		}
	},
}

module.exports = userController;
