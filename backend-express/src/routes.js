import { Router } from "express";
import { search, last, save, getById, update, remove, coverById } from "./controllers/books.controller.js";
import { basicAuth } from "./auth/basic.js";     // <--- AÑADIR

const r = Router();

// Públicos (no requieren Authorization)
r.get("/books/search", search);
r.get("/books/last-search", last);
r.get("/books/my-library", async (req,res)=>{
  const { q, author, excludeNoReview, sort } = req.query;
  const { Book } = await import("./models/Book.js");
  const filter = {};
  if(q) filter.title = { $regex:q, $options:"i" };
  if(author) filter.author = { $regex:author, $options:"i" };
  if(excludeNoReview === "true") filter.review = { $exists:true, $ne:"" };
  const sortObj = {};
  if(sort === "rating_asc") sortObj.rating = 1;
  if(sort === "rating_desc") sortObj.rating = -1;
  const list = await Book.find(filter).sort(sortObj);
  res.json(list.map(d=>({
    id:d._id.toString(), openLibraryId:d.openLibraryId, title:d.title, author:d.author,
    year:d.year, coverBase64:d.coverBase64, review:d.review||"", rating:d.rating||null, createdAt:d.createdAt
  })));
});
r.get("/books/my-library/:id", getById);
r.get("/books/library/front-cover/:id", coverById);

// Protegidos (requieren Authorization: Basic ...)
r.post("/books/my-library", basicAuth, save);          // <--- AÑADIR
r.put("/books/my-library/:id", basicAuth, update);     // <--- AÑADIR
r.delete("/books/my-library/:id", basicAuth, remove);  // <--- AÑADIR

export default r;
