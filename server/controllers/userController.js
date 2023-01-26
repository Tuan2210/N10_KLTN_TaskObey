const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

const userController = {
    //REGISTER acc is add user
    addUser: async(req, res) => {
        // try {
		// 	const newUser = new User(req.body);
		// 	const saveUser = await newUser.save();
		// 	res.status(200).json(saveUser);
		// } catch (error) {
		// 	res.status(500).json(error);
		// }

        const {userName, phoneNumber, password, refreshToken} = req.body

        if(!userName || !phoneNumber || !password)
            return res.status(400).json({success: false, message: 'Missing this User'});
        try {
            // const user = await User.findOne({userName});

            // if(user) return res.status(400).json({success: false, message: 'User existed'});

            const hashedPW = await argon2.hash(password);
            const newUser = new User({
              userName,
              phoneNumber,
              password: hashedPW,
              refreshToken,
            });
            await newUser.save()

            //return token
            // const accessToken = jwt.sign({userId: newUser._id}, process.env.JWT_ACCESS_KEY);

            res.json(newUser);
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false, message: 'Error'});
        }
    },

    //GET ALL USERS
	getAllUsers: async (req, res) => {
		try {
			const users = await User.find();
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json(error);
		}
	},

    //GET USER NAME & PHONE
    getUserName: async (req, res) => {
        try {
            await User.find({
              userName: req.params.name,
            }).then((findUserName) => res.status(200).json(findUserName));
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getUserPhone: async (req, res) => {
        try {
            await User.find({
              phoneNumber: req.params.phone,
            }).then((findUserPhone) => res.status(200).json(findUserPhone));
        } catch (error) {
            res.status(500).json(error);
        }
    },
    
    // getAllNumber: async (_req, res) => {
	// 	try {
	// 		// const users = await User.aggregate([{ '$match': { _id: { $exists: true } } }, { $project: { phoneNumber: 1, _id: 0 } }])
	// 		const users = await User.find({}, {_id: false, phoneNumber: true})
    //         const result = users?.reduce((acc, user) => {
	// 			return [...acc, `${user.phoneNumber}`];
	// 		}, []
	// 		)
	// 		res.status(200).json(result);
	// 	} catch (error) {
	// 		res.status(500).json(error);
	// 	}
	// },
}

module.exports = userController;
