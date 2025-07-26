const { StatusCodes } = require('http-status-codes')
const { UserModel } = require('../models/user/user.modul')
const { HttpException } = require('../utils/http-exception')

const roleMiddleware = (roles) =>{
	return async (req,res,next) =>{
		const {user_id} = req.user;
		const user = await UserModel.findById(user_id);
		if (!roles.includes(user.role)) {
			throw new HttpException(
				StatusCodes.FORBIDDEN,
        "You do not have permission to perform this  action"
			);
		}
		next();
	}
}

module.exports  = {roleMiddleware}