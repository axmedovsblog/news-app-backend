import mongoose from "mongoose"
import { CollectionNames } from '../../utils/constants.js'

const { Schema, model } = mongoose

const documentSchema = new Schema(
  {
    file_path: { type: String, required: true },
    is_use: { type: Boolean, required: true, default: false },
    where_used: {
      type: String,
      enum: ['news'],
    },
    user: {type: Object},
    created_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

export const SaveFileModel = model(
  CollectionNames.SAVE_FILE,
  documentSchema,
  CollectionNames.SAVE_FILE
)