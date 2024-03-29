const jswt = require('jsonwebtoken');

const { User } = require("../models");

const middlewareController = {
	//verifyToken
	verifyAccessToken: (req, res, next) => {
		const findToken = req.headers['authorization'];
		if (findToken) {
			const splitToken = findToken.split(' ')[1];

            //verify accessToken
            jswt.verify(splitToken, process.env.JWT_ACCESS_KEY, async (err, user) => {
				if (err) {
					// res.status(403).json('AccessToken is not valid');
					const findUser = await User.findOne({findToken});
					await User.updateOne({phoneNumber: findUser.phoneNumber}, {token: ''}, {upsert: false}); //filter, update, option
					// return res.status(200).json(findUser);
					next();
				}
				req.user = user;
				next();
			});
		} else{
			return res.status(401).json("You're not authenticated");
		}
	},

    verifyRefreshToken: (req, res, next) => {
		const token = req.headers['authorization'];
		if (token) {
			const splitToken = token.split(' ')[1];
			jswt.verify(splitToken, process.env.JWT_REFRESH_KEY, (err, user) => {
				if (err) {
					return res.status(403).json('RefreshToken is not valid');
				}
				req.user = user;
				next();
			});
		} else{
			return res.status(401).json("You're not authenticated");
		}
	},

    // verifyTokenAndAdminAuth: (req, res, next) => {
    //     middlewareController.verifyToken(req, res, ()=> {
    //         if(req.user.id == req.params.id || req.user.admin){
    //             next();
    //         }
    //         else{
    //             return res.status(401).json("You're not authenticated");
    //         }
    //     });
    // },
	verifyTokenAndUserAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, ()=> {
            if(!req.user.admin){
                next();
            }
            else{
                return res.status(401).json("You're not authenticated");
            }
        });
    }
};

module.exports = middlewareController;
