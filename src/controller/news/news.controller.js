const { NewsModel } = require('../../models/news/news.model')
const { SaveFileModel } = require('../../models/save-file/save-file.model.js')
const { HttpException } = require('../../utils/http-exception.js')
const { StatusCodes } = require("http-status-codes")
const { UserModel } = require("../../models/user/user.modul.js")
const fs = require("fs")
const path = require("path")
const { error } = require('console')

class NewsController {
	// getAll
	static getAll = async (req, res) => {
		const { search, page = 1, limit = 10, user_id ="" } = req.query

		let query = {}
		if (search && search.length > 0) {
			query = {
				$or: [
					{ title: { $regex: search.trim(), $options: "i" } },
					{ desc: { $regex: search.trim(), $options: "i" } },
				],
			}
		}
		if (user_id) {
			query.user = user_id
		}

		const news = await NewsModel.find(query)
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("user", "name email")

		const total = await NewsModel.countDocuments(query)

		res.status(200).json({
			success: true,
			data: news,
			pagination: {
				currentPage: Number(page),
				totalItems: total,
				page: Number(page),
				limit: Number(limit),
				totalPages: Math.ceil(total / limit),
				hasNextPage: (page - 1) * limit + news.length < total,
				hasPrevPage: page > 1,
			},
		})
	};
	//  getById
	static getById = async (req, res) => {
		const { id } = req.params
		const news = await NewsModel.findById(id).populate([{ path: "user", select: "name email" }])
		if (!news) {
			throw new HttpException(StatusCodes.NOT_FOUND, "Not a found")
		}
		res.status(200).json({ success: true, data: news })
	}
	// add
	static add = async (req, res) => {
		const { title, desc, image } = req.body
		const { user_id } = req.user

		const existingNews = await NewsModel.findOne({ title })

		if (existingNews) {
			throw new HttpException(
				StatusCodes.CONFLICT,
				"News with this title already exists!")
		}
		const save_file = await SaveFileModel.findOne({ file_path: image })
		if (!save_file) {
			throw new HttpException(StatusCodes.BAD_REQUEST, "Image  file not found")

		}
		if (save_file.is_use) {
			throw new HttpException(
				StatusCodes.BAD_REQUEST,
				"Image file is in use " + save_file.where_used)
		}
		const news = await NewsModel.create({
			title,
			desc,
			image,
			user: user_id,
		})
		res.status(StatusCodes.CREATED).json({ success: true, msg: "news created!" })
		const user = await UserModel.findById(user_id)
		// bu birinchi usul userni id sini olishni
		user.news.push(news._id)
		await user.save()

		//  ikkinchi usuli 
		//	await UserModel.updateOne({_id: user_id}, {$push: { news: news._id}});

		await save_file.updateOne({ is_use: true, where_used: "news", user: user })
	};
	//  update
	static update = async (req, res) => {
		const { id } = req.params
		const { title, desc, image } = req.body
		const { user_id } = req.user

		const news = await NewsModel.findById(id)
		if (!news) {
			throw new HttpException(StatusCodes.NOT_FOUND, "Not a found")
		}

		if (news.user.toString() !== user_id) {
			throw new HttpException(
				StatusCodes.FORBIDDEN,
				"You are not allowed to delete this news!"
			)
		}

		const updateNews = {}

		if (image && image !== news.image) {
			const save_file = await SaveFileModel.findOne({ file_path: image })
			if (!save_file) {
				throw new HttpException(
					StatusCodes.BAD_REQUEST,
					"Image file not found!")
			}
			if (save_file.is_use) {
				throw new HttpException(
					StatusCodes.BAD_REQUEST,
					"Image file is in use " + save_file.where_used)

			}
			updateNews.image = image
		}


		if (title && title !== news.title) {
			const existingNews = await NewsModel.findOne({ title })
			if (existingNews) {
				throw new HttpException(StatusCodes.CONFLICT, "News with this title already exists!")

			}
			updateNews.title = title
		}
		if (desc && desc !== news.desc) {
			updateNews.desc = desc
		}

		const data = await NewsModel.findByIdAndUpdate(id, updateNews, { new: true })
		if (image && image !== news.image) {
			await SaveFileModel.updateOne(
				{ file_path: news.image },
				{ is_use: false, where_used: "" }
			)
			await SaveFileModel.updateOne(
				{ file_path: image },
				{ is_use: true, where_used: "news" }
			)
		}
		res.status(200).json({ success: true, msg: data })
	}

	//  delete 
	static delete = async (req, res) => {
		const { id } = req.params
		const { user_id } = req.user

		const news = await NewsModel.findById(id)

		if (!news) {
			throw new HttpException(StatusCodes.NOT_FOUND, "Not a found")
		}
		// bu birinchi usuli 
		if (news.user.toString() !== user_id) {
			throw new HttpException(
				StatusCodes.FORBIDDEN,
				"You are not allowed to delete this news!"
			)

		}
		// o'chirishning birinchi usuli 
		// await NewsModel.findByIdAndDelete(id) // 1 - usuli 
		await news.deleteOne() // 2 - usuli 

		await SaveFileModel.updateOne(
			{ file_path: news.image },
			{ is_use: false, where_used: "" }
		)
		await UserModel.findByIdAndUpdate(user_id, {
			$pull: { news: id },
		})
		res.status(200).json({ success: true, msg: "News deleted" })
	}
}

module.exports = { NewsController }	