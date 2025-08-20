import mongoose from "mongoose";
const schema = new mongoose.Schema({
  openLibraryId: String,
  title: { type: String, required: true },
  author: String,
  year: Number,
  coverBase64: String,
  review: { type: String, maxlength: 500 },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});
export const Book = mongoose.model("Book", schema);
