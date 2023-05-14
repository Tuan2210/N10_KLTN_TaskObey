const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

const userController = {
  //GENERATE ACCESS TOKEN
  generateAccessToken: (userPhone) => {
    return jwt.sign(
      {
        id: userPhone.id
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1h" }
    );
  },

  //REGISTER acc is add user
  addUser: async (req, res) => {

    const { userName, phoneNumber, password } = req.body;

    if (!userName || !phoneNumber || !password)
      return res.status(400).json({ success: false, message: "Missing this User" });
    try {
      const hashedPW = await argon2.hash(password);
      const newUser = new User({
        userName,
        phoneNumber,
        password: hashedPW,
        token: '',
      });
      await newUser.save();

      const registeredUser = await User.findOne({phoneNumber});
      const accessToken = userController.generateAccessToken(registeredUser);
      await User.updateOne({_id: registeredUser._id}, {token: accessToken}, {upsert: false}); //filter, update, option
      
      res.cookie("accessToken", accessToken, {
        // create cookie with refresh token expires in 7 days
        httpOnly: true,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        secure: true,
        path: "/home",
        sameSite: "none",
      });

      res.json(await User.findOne({ phoneNumber }));

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error" });
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

  //GET USER NAME, PHONE
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

  //GET USER BY ID
  getUserById: async (req, res) => {
    try {
      await User.find({
        _id: req.params.userId,
      }).then((u) => res.status(200).json(u));
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //GET USER PW BY PHONE
  getUserPwByPhone: async (req, res) => {
    try {
      const userPhone = await User.findOne({ phoneNumber: req.params.phone });
      await argon2
        .verify(userPhone.password, req.params.password)
        .then((status) => res.status(200).json(status));
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // getUserPwByEmail: async (req, res) => {
  //   try {
  //     const userEmail = await User.findOne({ email: req.params.email });
  //     await argon2
  //       .verify(userEmail.password, req.params.password)
  //       .then((status) => res.status(200).json(status));
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // },

  changePasswordWithPhoneNumber: async (req, res) => {
    const {phoneNumber, password} = req.body

    try {
      const user = await User.findOne({phoneNumber});
      if(!user) return res.status(400).json({success: false, message: "This phone number isn't registered"});
      
      const hashedNewPW = await argon2.hash(password);
      await User.updateOne({phoneNumber: user.phoneNumber}, {password: hashedNewPW}, {upsert: false}); //filter, update, option
      
      res.status(200).json(await User.findOne({phoneNumber}));
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
};

module.exports = userController;
