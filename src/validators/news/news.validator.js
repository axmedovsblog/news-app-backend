const { body, param } = require('express-validator')

class NewsValidator {
	static add = () => [
		body('title', 'Title is required.').notEmpty(),
		body('title', 'Title must be string.').isString(),
		body('desc', 'Desc is required.').notEmpty(),
		body('desc', 'Desc must be string.').isString(),
		body('image', 'Image is required.').notEmpty(),
		body('image', 'Image must be string.').isURL(),
	];
	static getById = () => [
		param('id', 'ID must be a valid MongoDB ObjectId. ').isMongoId()
	]

	static update = () => [
		param('id', 'ID must be a valid MongoDB ObjectId. ').isMongoId(),
		body('title', 'Title must be string.').optional().isString(),
		body('desc', 'Desc must be string.').optional().isString(),
		body('image', 'Image must be valid URl.').isURL(),
	]
}


module.exports = { NewsValidator }