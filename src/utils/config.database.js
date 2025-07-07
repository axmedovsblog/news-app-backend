const { connect } = require("mongoose")
const { MONGO_URI } = require('./secret')

const ConnectdB = async () => {
	await connect(MONGO_URI)
	console.log("Connect Db");
	
}

module.exports = {ConnectdB}