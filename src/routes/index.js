const { newsRouter } = require('./news/news.route')
const { uploadRouter } = require('./upload/upload.route')
const { userRouter } = require('./user/user.route')

const main_roter = [
	{path: "/news", router: newsRouter},
	{path: "/upload", router: uploadRouter},
	{path: "/user", router: userRouter}
]

module.exports  = { main_roter}