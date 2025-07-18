const { NewsModel } = require('../../models/news/news.model')
const { SaveFileModel } = require('../../models/save-file/save-file.model.js')
const { HttpException } = require('../../utils/http-exception.js')
const { StatusCodes } = require("http-status-codes")
const fs = require("fs")
const path = require("path")
const { error } = require('console')

class NewsController {
	// getAll
	static getAll = async (req, res) => {
		const news = await NewsModel.find({})
		res.status(200).json({ success: true, data: news })
	}
	//  getById
	static getById = async (req, res) => {
		const { id } = req.params
		const news = await NewsModel.findById(id)
		if (!news) {
			throw new HttpException(StatusCodes.NOT_FOUND, "Not a found")
		}
		res.status(200).json({ success: true, data: news })
	}
	// add
	static add = async (req, res) => {
		const { title, desc, image } = req.body

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
		await NewsModel.create({
			title,
			desc,
			image,
		})
		res.status(StatusCodes.CREATED).json({ success: true, msg: "news created!" })

		await save_file.updateOne({ is_use: true, where_used: "news" })
	};
	//  update
	static update = async (req, res) => {
		const { id } = req.params
		const { title, desc } = req.body

		const news = await NewsModel.findById(id)
		if (!news) {
			throw new HttpException(StatusCodes.NOT_FOUND, "Not a found")
		}

		const updateNews = {}
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

		res.status(200).json({ success: true, msg: data })
	}

	//  delete 
	static delete = async (req, res) => {
		const { id } = req.params

		const news = await NewsModel.findById(id)
		if (!news) {
			throw new HttpException(StatusCodes.NOT_FOUND, "Not a found")
		}
		// o'chirishning birinchi usuli 
		// await NewsModel.findByIdAndDelete(id) // 1 - usuli 
		await news.deleteOne() // 2 - usuli 

   await SaveFileModel.updateOne(
		{file_path: news.image},
		{is_use: false, where_used: ""}
	)

		res.status(200).json({ success: true, msg: "News deleted" })
	}
}

module.exports = { NewsController }	