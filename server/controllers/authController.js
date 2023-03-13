const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

const authController = {
    //GENERATE ACCESS TOKEN
    generateAccessToken: (userPhone) => {
        return jwt.sign(
            {
                // id: user.id,
                // admin: user.admin,
                id: userPhone.id
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "1h" }
        );
    },

    //GENERATE REFRESH TOKEN
    generateRefreshToken: (userPhone) => {
        return jwt.sign(
            {
                id: userPhone.id
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" }
        );
    },

    //HASHED PW


    //LOGIN by email
    loginUserEmail: async(req, res) => {
        const {email, password} = req.body

        if(!email || !password)
            return res.status(400).json({success: false, message: 'Missing this User'});
        try {
            const userEmail = await User.findOne({email});

            if(!userEmail) return res.status(400).json({success: false, message: 'Incorrect phone number'});

            const passwordValid = await argon2.verify(userEmail.password, password);
            if(!passwordValid) return res.status(400).json({success: false, message: 'Incorrect pw'});

            //return token
            if(userEmail && passwordValid){
                // const accessToken = jwt.sign({userId: userPhone._id}, process.env.JWT_ACCESS_KEY);
                const accessToken = authController.generateAccessToken(userEmail);
                
                // create refresh token in database
                const refreshToken = authController.generateRefreshToken(userEmail);
                await User.updateOne({email: userEmail.email}, {token: refreshToken}, {upsert: false}); //filter, update, option

                res.cookie("refreshToken", refreshToken, {
                  // create cookie with refresh token expires in 7 days
                  httpOnly: true,
                  expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                  secure: true,
                  path: "/home",
                  sameSite: "none",
                });
                
                const { password, ...others } = userEmail._doc;
                res.status(200).json({ ...others, accessToken, refreshToken });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    
    //LOGIN by phone
    loginUserPhone: async(req, res) => {
        const {phoneNumber, password} = req.body

        if(!phoneNumber || !password)
            return res.status(400).json({success: false, message: 'Missing this User'});
        try {
            const userPhone = await User.findOne({phoneNumber});

            if(!userPhone) return res.status(400).json({success: false, message: 'Incorrect phone number'});

            const passwordValid = await argon2.verify(userPhone.password, password);
            if(!passwordValid) return res.status(400).json({success: false, message: 'Incorrect pw'});

            //return token
            if(userPhone && passwordValid){
                // const accessToken = jwt.sign({userId: userPhone._id}, process.env.JWT_ACCESS_KEY);
                const accessToken = authController.generateAccessToken(userPhone);
                
                // create refresh token in database
                const refreshToken = authController.generateRefreshToken(userPhone);
                await User.updateOne({phoneNumber: userPhone.phoneNumber}, {token: refreshToken}, {upsert: false}); //filter, update, option

                res.cookie("refreshToken", refreshToken, {
                  // create cookie with refresh token expires in 7 days
                  httpOnly: true,
                  expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                  secure: true,
                  path: "/home",
                  sameSite: "none",
                });
                
                const { password, ...others } = userPhone._doc;
                res.status(200).json({ ...others, accessToken, refreshToken });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },

    //REDIS
    requestRefreshToken: async (req, res) => {
        //Take refresh token from user
        const refreshTokenCookies = req.cookies.refreshToken;
        const refreshTokenUser = req.body.refreshToken;

        //Send error if token is not valid
        if (!refreshTokenCookies)
            return res.status(401).json("You're not authenticated");
        if (refreshTokenUser !== refreshTokenCookies) {
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshTokenCookies, process.env.JWT_REFRESH_KEY, (err, user) => {
            if(err) console.log(err);
            
            //create new access token, refresh token and send to user
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);

            res.clearCookie("refreshToken");
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                path: "/home",
                sameSite: "none",
            });
            res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        }
        );
    },

    //LOGOUT
    userLogout: async (req, res) => {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json("LOGOUT!!");
    },
}

module.exports = authController;