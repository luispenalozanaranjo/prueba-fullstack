import { connectDB } from "../lib/db.js";
import { Book } from "../models/Book.js";
import { searchBooks, buildOpenLibraryCoverUrl } from "../lib/openlibrary.js";

const LAST_SEARCHES = [];
const pushLastSearch = (q) => {
  if (!q) return;
  LAST_SEARCHES.unshift(q);
  const uniq = Array.from(new Set(LAST_SEARCHES));
  LAST_SEARCHES.length = 0;
  LAST_SEARCHES.push(...uniq.slice(0, 5));
};

export default {
  name: "books",
  async started() {
    await connectDB();
  },
  actions: {
    async search(ctx) {
      const q = ctx.params.q || ctx.meta.query?.q || "";
      pushLastSearch(q);
      const results = await searchBooks(q);
      const booksInDB = await Book.find({ openLibraryId: { $in: results.map(r => r.key) } }, "openLibraryId coverBase64");
      const coverMap = new Map(booksInDB.map(b => [b.openLibraryId, b.coverBase64]));
      return results.map(r => ({
        id: r.key,
        title: r.title,
        author: r.author,
        year: r.year,
        cover: coverMap.has(r.key)
          ? `/api/books/library/front-cover/${encodeURIComponent(r.key)}`
          : buildOpenLibraryCoverUrl(r.coverId),
      }));
    },

    async lastSearch() {
      return LAST_SEARCHES;
    },

    async save(ctx) {
      const { openLibraryId, title, author, year, coverBase64, review, rating } = ctx.params;
      if (!title) throw new Error("title es requerido");
      if (review && review.length > 500) throw new Error("review excede 500 caracteres");
      if (rating && (rating < 1 || rating > 5)) throw new Error("rating debe ser 1..5");

      const doc = await Book.create({ openLibraryId, title, author, year, coverBase64, review, rating });
      this.logger.info("[SAVE] Libro guardado", doc._id.toString());
      return { id: doc._id.toString() };
    },

    async getById(ctx) {
      const { id } = ctx.params;
      const book = await Book.findById(id);
      if (!book) throw new Error("No encontrado");
      return serialize(book);
    },

    async update(ctx) {
      const { id } = ctx.params;
      const { review, rating } = ctx.params;
      if (review && review.length > 500) throw new Error("review excede 500 caracteres");
      if (rating && (rating < 1 || rating > 5)) throw new Error("rating debe ser 1..5");
      const book = await Book.findByIdAndUpdate(id, { review, rating }, { new: true });
      if (!book) throw new Error("No encontrado");
      this.logger.info("[UPDATE] Libro actualizado", id);
      return serialize(book);
    },

    async remove(ctx) {
      const { id } = ctx.params;
      const del = await Book.findByIdAndDelete(id);
      if (!del) throw new Error("No encontrado");
      this.logger.info("[DELETE] Libro eliminado", id);
      return { ok: true };
    },

    async list(ctx) {
      const { q, author, excludeNoReview, sort } = ctx.params;
      const filter = {};
      if (q) filter.title = { $regex: q, $options: "i" };
      if (author) filter.author = { $regex: author, $options: "i" };
      if (excludeNoReview === "true") filter.review = { $exists: true, $ne: "" };
      const sortObj = {};
      if (sort === "rating_asc") sortObj.rating = 1;
      if (sort === "rating_desc") sortObj.rating = -1;
      const list = await Book.find(filter).sort(sortObj);
      return list.map(serialize);
    },

    async coverById(ctx) {
      const { id } = ctx.params;
      const book = await Book.findOne({ openLibraryId: id });
      if (!book || !book.coverBase64) throw new Error("Portada no encontrada");
      return {
        mime: "application/json",
        data: { dataUrl: book.coverBase64 },
      };
    },
  },
};

function serialize(doc) {
  return {
    id: doc._id.toString(),
    openLibraryId: doc.openLibraryId,
    title: doc.title,
    author: doc.author,
    year: doc.year,
    coverBase64: doc.coverBase64,
    review: doc.review || "",
    rating: doc.rating || null,
    createdAt: doc.createdAt,
  };
}
