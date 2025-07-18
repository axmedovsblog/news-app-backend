import mongoose from "mongoose"

const { Schema, model } = mongoose

const documentSchema = new Schema(
  {
    file_path: { type: String, required: true },
    is_use: { type: Boolean, required: true, default: false },
    where_used: {
      type: String,
      enum: ['news'],
    },
    created_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

export const SaveFileModel = model("save-file", documentSchema, "save_file")