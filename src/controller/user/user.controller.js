const { REG_KEY } = require("../../utils/secret.js")
const { HttpException } = require("../../utils/http-exception.js")
const { StatusCodes } = require('http-status-codes')
const { UserModel } = require("../../models/user/user.modul.js")
const { RoleCollection } = require('../../utils/constants')
const { genSalt, hash } = require("bcryptjs")


class UserController {
	static signUpAdmin = async (req, res) => {
		const {
			reg_key,
			name,
			email,
			password
		} = req.body


		if (reg_key !== REG_KEY) {
			throw new HttpException(
				StatusCodes.FORBIDDEN,
				"Invalid registration key"
			)
		}
		const existingUser = await UserModel.findOne({ email })

		if (existingUser) {
			throw new HttpException(
				StatusCodes.CONFLICT,
				"User email already exists"
			)
		}
		const salt = await genSalt(10)
		const hashedPassword = await hash(password, salt)

		await UserModel.create({
			name,
			email,
			password: hashedPassword,
			role: RoleCollection.ADMIN
		})
		return res
			.status(StatusCodes.CREATED)
			.json({ succsess: true, msg: "Admin use created succsessfuly" })
	}
}

module.exports = { UserController }