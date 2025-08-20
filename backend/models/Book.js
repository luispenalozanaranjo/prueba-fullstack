import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    openLibraryId: { type: String, index: true },
    title: { type: String, required: true },
    author: { type: String },
    year: { type: Number },
    coverBase64: { type: String },
    review: { type: String, maxlength: 500 },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "books" }
);

export const Book = mongoose.model("Book", BookSchema);
