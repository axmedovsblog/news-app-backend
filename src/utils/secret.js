const { config } = require("dotenv")
config()
const port = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

module.exports = { port,MONGO_URI }

