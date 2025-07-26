const { Router } = require("express")
const uploadRouter = new Router()

const { expressValidate } = require("../../validators/index.js")
const { uploadFile } = require('../../utils/file-upload.js')
const { UploadController } = require('../../controller/upload/upload.controller.js')
const { authMiddleware } = require('../../middlewares/auth.middleware.js')

uploadRouter.post(
	"/",
	authMiddleware,
	expressValidate,
	uploadFile.single("file"),
	UploadController.uploadFile
)


module.exports = { uploadRouter }