const { Router } = require("express")
const uploadRouter = new Router()

const { expressValidate } = require("../../validators/index.js")
const { uploadFile } = require('../../utils/file-upload.js')
const { UploadController } = require('../../controller/upload/upload.controller.js')

uploadRouter.post(
	"/",
	expressValidate,
	uploadFile.single("image"),
	UploadController.uploadFile
)


module.exports = { uploadRouter }