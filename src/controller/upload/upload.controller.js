const { StatusCodes } = require("http-status-codes")
const { HttpException } = require('../../utils/http-exception')
const { SaveFileModel } = require('../../models/save-file/save-file.model')
const { uploadFileS3, deleteFileS3 } = require('../../utils/s3.js')
const path = require("path")
const { v4 } = require('uuid')

class UploadController {
	static uploadFile = async (req, res) => {
		const uploadedFile = req.file

		if (!uploadedFile) {
			throw new HttpException(StatusCodes.NOT_FOUND, 'File  not provided '
			)
		}
   let file_name = v4() + path.extname(uploadedFile.originalname);

	 if (uploadedFile.mimetype.startsWith("image/")) {
		file_name = "images/" + v4() + path.extname(uploadedFile.originalname);
	 }
	 if (uploadedFile.mimetype.startsWith("vedio/")) {
		file_name = "vedios/" + v4() + path.extname(uploadedFile.originalname);
	 }
		const file_path = await uploadFileS3(
			file_name,
			uploadedFile.buffer
		)

		await SaveFileModel.create(
			{
				file_path,
			})

		res.status(StatusCodes.CREATED).json({
			success: true,
			file_path
		})
	};
	static deleteFileWithCron = async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const files = (
        await SaveFileModel.find(
          { is_use: false, created_at: { $lt: oneDayAgo } },
          null,
          { lean: true }
        )
      ).map((file) => file.file_path);

      for (const file of files) {
        await deleteFileS3(file);
        await SaveFileModel.deleteOne({ file_path: file });
      }

      return files.length.toString();
    } catch (error) {
      console.error(error);
      return "Not";
    }
  };
}


module.exports = { UploadController }