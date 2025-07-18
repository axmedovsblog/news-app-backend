const { StatusCodes } = require("http-status-codes")
const { HttpException } = require('../../utils/http-exception')
const { SaveFileModel } = require('../../models/save-file/save-file.model')

class UploadController {
	static uploadFile = async (req, res) => {
		const uploadedFile = req.file
		if (!uploadedFile) {
			throw new HttpException(StatusCodes.NOT_FOUND, 'File  not provided '
			)
		}

		await SaveFileModel.create({file_path: "uploads/images/" + uploadedFile.filename});

		res.status(StatusCodes.CREATED).json({ success: true, 
			file_path: "uploads/images/" + uploadedFile.filename,
		 })
	}
}


module.exports = { UploadController }