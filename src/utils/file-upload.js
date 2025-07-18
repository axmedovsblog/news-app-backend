const multer = require("multer")
const path = require("path")
const { HttpException } = require('./http-exception.js')

//  diskStorage - vazifasi bizga fileni saqlash uchun kerak bo'ladi
// destination - esa file ni yo'lini korsatadi

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === "image") {
			cb(null, "./public/uploads/images")
		}
		if (file.fieldname === "vedio") {
			cb(null, "./public/uploads/vedios")
		}
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
		cb(null, uniqueSuffix + path.extname(file.originalname))
	}
})

const checkFileType = (file, cb) => {
	// regex deyiladi bu narsa
	// Bu RegExp — qabul qilinadigan fayl turlarini bildiradi:

	const filetypes = /jpeg|jpg|png|gif|mp4|avi|mov/
	// filetypes rejex ni test metodidan foydalanayapmiz
	// path.extname(file.originalname) — fayl nomidan kengaytmani ajratadi (masalan: .jpg).
	//  filetypes.test(...) — regex yordamida shu kengaytma ruxsat etilganmi, yo‘qmi, tekshiradi.
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

	//Faylning mimetype qiymatini regex orqali tekshiradi.
	
	const mimetype = filetypes.test(file.mimetype)

	//  Agar hammasi to'g'ri bo'lsa Fayl qabul qilinadi.
	// Callback chaqiriladi: cb(null, true).

	if (extname && mimetype) {
		return cb(null, true)
	}
	// Aks holda:
	// Xatolik xabari: cb("Error: File type not supported").

	else {
		cb(
			new HttpException(400, "Error: File upload only supports  the following filetypes -" + filetypes)
		)
	}

}

const uploadFile = multer({
	storage,
	limits: { fieldSize: 50 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb)
	}
})

module.exports = { uploadFile }