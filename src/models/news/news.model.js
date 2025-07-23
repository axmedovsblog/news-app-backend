const { Schema, model } = require("mongoose")
const { CollectionNames } = require('../../utils/constants.js')

const documentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String, required: true
    },
    image: {
      type: String, required: true
    }
  }, {
  timestamps: true, versionKey: false
})

const NewsModel = model(
  CollectionNames.NEWS,
  documentSchema,
  CollectionNames.NEWS
)

module.exports = { NewsModel }