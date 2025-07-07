// validatorlar 

const { validationResult } = require("express-validator")
const httpException = require('../utils/http-exception')
const { StatusCodes } = require('http-status-codes')

const expressValidate = (req, res, next) => {
	const errors = validationResult(req)
	if (errors.isEmpty()) {
		return next()
	}
	let messages = ''

	errors.array().map((err) => {
		messages += err.msg + " "
	})
	// 1- usul bu 

	// return res.status(422).json({succsess: false, msg: messages})

	// 2 - usul bu 
	throw new httpException(StatusCodes.UNPROCESSABLE_ENTITY, messages.trim())
}


module.exports = { expressValidate }