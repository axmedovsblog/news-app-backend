const { REG_KEY, JWT_SECRET } = require("../../utils/secret.js")
const { HttpException } = require("../../utils/http-exception.js")
const { StatusCodes } = require('http-status-codes')
const { UserModel } = require("../../models/user/user.modul.js")
const { RoleCollection } = require('../../utils/constants')
const { genSalt, hash, compare } = require("bcryptjs")
const { sign } = require('jsonwebtoken')


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
	static signUp = async (req, res) => {
		const {
			name,
			email,
			password
		} = req.body

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
		})
		return res
			.status(StatusCodes.CREATED)
			.json({ succsess: true, msg: "User created succsessfuly" })
	}
	static login = async (req, res) => {
		const { email, password } = req.body
		const user = await UserModel.findOne({ email })
		if (!user) {
			throw new HttpException(
				StatusCodes.UNAUTHORIZED,
				"Invalid email or password"
			)
		}
		const isMatch = await compare(password, user.password)
		if (!isMatch) {
			throw new HttpException(
				StatusCodes.UNAUTHORIZED,
				"Invalid email or password"
			)
		}
		const token = sign({
			user_id: user._id
		},
			JWT_SECRET, {
			expiresIn: "24h",
		}
		)
		return res.status(StatusCodes.OK).json({ succsess: true, token })
	}
	static me = async (req, res) => {
		const user = await UserModel.findById(req.user.user_id).select("-password")

		if (!user) {
			throw new HttpException(
				StatusCodes.NOT_FOUND,
				"User not found"
			)
		}
		return res.status(StatusCodes.OK).json({ succsess: true, data: user })
	};
	static getAllUsers = async (req, res) => {
		const { search, page = 1, limit = 10 } = req.query

		const query = {}

		if (search && search.length > 0) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			]
		}

		const users = await UserModel.find(query)
			.select("-password")
			.skip((page - 1) * limit)
			.limit(limit)

		const totalUsers = await UserModel.countDocuments(query)

		return res.status(StatusCodes.OK).json({
			succsess: true,
			data: users,
			pagination: {
				currentPage: Number(page),
				totalItems: totalUsers,
				page: Number(page),
				limit: Number(limit),
				totalPages: Math.ceil(totalUsers / limit),
				hasNextPage: (page - 1) * limit + users.length < totalUsers,
				hasPrevPage: page > 1,
			}
		})
	}
}
module.exports = { UserController }