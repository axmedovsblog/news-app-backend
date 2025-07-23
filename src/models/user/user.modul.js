const { Schema, model, SchemaType } = require("mongoose")
const { CollectionNames, RoleCollection } = require('../../utils/constants.js')

const documentSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String, required: true ,unique: true
		},
		password: {
			type: String, required: true
		},
		role:{
			type: String , enum: [RoleCollection.USER,RoleCollection.ADMIN], default: RoleCollection.USER,
		},
		news: [{
			type: Schema.Types.ObjectId, ref: CollectionNames.NEWS
		}], // bu birinchi usul user news larni olishni 
		
	}, {
	timestamps: true, versionKey: false
})

const UserModel = model(
	CollectionNames.USER,
	documentSchema,
	CollectionNames.USER)

module.exports = { UserModel }
