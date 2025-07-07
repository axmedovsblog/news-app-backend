const { newsRouter } = require('./news/news.route')

const main_roter = [
	{path: "/news", router: newsRouter},
	// {path: "/auth", router: newsRouter}
]

module.exports  = { main_roter}