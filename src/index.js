// alias
// postman dasturi
//  mongo db
// aws s3
//  mongoose -kutubxona				

const express = require("express")
const { port } = require('./utils/secret.js')
const { main_roter } = require('./routes/index.js')
const { ConnectdB } = require('./utils/config.database.js')
const { errorMiddleware } = require('./middlewares/error.middleware.js')
const cors = require("cors")
const app = express()

void ConnectdB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({origin: ["http://localhost:5173", "http://localhost:5174"]}))
// barcha fayllarni static qilish
app.use(express.static("public"))


app.get('/', (req, res, next) => {
	const isAdmin = true
	if (isAdmin) {
		next()
	}
	else {
		res.status(401).json({ success: false, msg: 'You are not allowed!' })
	}
}, (req, res) => {
	res.status(200).json({ success: true, msg: "ok" })
})


main_roter.forEach(value => {
	app.use(value.path, value.router)
})

app.use(errorMiddleware)

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`)
})



