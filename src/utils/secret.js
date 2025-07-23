const { config } = require("dotenv")
config()
const port = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const AWS_ACCSESS_KEY_ID = process.env.AWS_ACCSESS_KEY_ID;
const AWS_SECRET_ACCSESS_KEY = process.env.AWS_SECRET_ACCSESS_KEY
const AWS_URL = process.env.AWS_URL
const AWS_REGION = process.env.AWS_REGION
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const REG_KEY = process.env.REG_KEY
const JWT_SECRET = process.env.JWT_SECRET
module.exports = { 
	port,
	MONGO_URI ,
	AWS_ACCSESS_KEY_ID,
	AWS_BUCKET_NAME,
	AWS_REGION,
	AWS_SECRET_ACCSESS_KEY,
	AWS_URL,
	REG_KEY,
	JWT_SECRET
}

