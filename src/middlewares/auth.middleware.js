const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../utils/secret.js")
const { HttpException } = require("../utils/http-exception")
const { asyncHandler } = require("../utils/async-handler.js")
const { StatusCodes } = require('http-status-codes')
const authMiddleware = asyncHandler(async (req, res, next) => {

	const token = req.headers.authorization?.split(" ")[1]

	if (!token) {
		throw new HttpException(StatusCodes.UNAUTHORIZED, "No token password")
	}

	const decoded = jwt.verify(token, JWT_SECRET)
	req.user = { user_id: decoded.user_id }

	next()
})

module.exports = { authMiddleware }
