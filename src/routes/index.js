const { newsRouter } = require('./news/news.route')
const { uploadRouter } = require('./upload/upload.route')

const main_roter = [
	{path: "/news", router: newsRouter},
	{path: "/upload", router: uploadRouter}
]

module.exports  = { main_roter}