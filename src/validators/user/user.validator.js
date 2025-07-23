const { body } = require('express-validator')

class UserValidator {
	static signUpAdmin = () => [
		body('name', 'Name is required.').notEmpty(),
		body('name', 'Name must be string.').isString(),
		body('email', 'Email is required.').notEmpty(),
		body('email', 'Email must be string.').isEmail(),
		body('password', 'Password is required.').notEmpty(),
		body('password', 'Password must be at least 8 characters long, contain at least one lowercase letter , one uppercase letter , one number , and symbols').isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		}),
		body('reg_key', 'Registration key is required.').notEmpty(),
		body('reg_key', 'Registration key must be string.').isString(),
	];	
	static login = () => [
		body('email', 'Email is required.').notEmpty(),
		body('email', 'Email must a valid email address').isEmail(),
		body('password','Password is required').notEmpty(),
		body('password','Password must be at least 8 characters long.').isLength({min: 8}),
	]
}


module.exports = { UserValidator }