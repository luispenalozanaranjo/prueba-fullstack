import { Book } from "../models/Book.js";
import { searchBooks, coverUrl } from "../lib/openlibrary.js";

const LAST = [];
const pushLast = q => { if(!q) return; LAST.unshift(q); const uniq=[...new Set(LAST)]; LAST.length=0; LAST.push(...uniq.slice(0,5)); };

export async function search(req, res, next) {
  try {
    const q = req.query.q || "";
    pushLast(q);

    const results = await searchBooks(q); // si falla, caerá al catch

    const map = new Map(
      (await Book.find(
        { openLibraryId: { $in: results.map(r => r.key) } },
        "openLibraryId coverBase64"
      )).map(b => [b.openLibraryId, b.coverBase64])
    );

    res.json(
      results.map(r => ({
        id: r.key,
        title: r.title,
        author: r.author,
        year: r.year,
        cover: map.has(r.key)
          ? `/api/books/library/front-cover/${encodeURIComponent(r.key)}`
          : coverUrl(r.coverId)
      }))
    );
  } catch (err) {
    next(err); // 👉 Express enviará el error al middleware de errores
  }
}
export async function last(req,res){ res.json(LAST); }
export async function save(req,res){
  const { openLibraryId, title, author, year, coverBase64, review, rating } = req.body;
  if(!title) return res.status(400).json({error:"title requerido"});
  if(review && review.length>500) return res.status(400).json({error:"review > 500"});
  if(rating && (rating<1 || rating>5)) return res.status(400).json({error:"rating 1..5"});
  const doc = await Book.create({ openLibraryId, title, author, year, coverBase64, review, rating });
  console.log("[SAVE]", doc._id.toString());
  res.json({ id: doc._id.toString() });
}
export async function getById(req,res){
  const b = await Book.findById(req.params.id); if(!b) return res.status(404).json({error:"No encontrado"});
  res.json(serialize(b));
}
export async function update(req,res){
  const { review, rating } = req.body;
  if(review && review.length>500) return res.status(400).json({error:"review > 500"});
  if(rating && (rating<1 || rating>5)) return res.status(400).json({error:"rating 1..5"});
  const b = await Book.findByIdAndUpdate(req.params.id, { review, rating }, { new: true });
  if(!b) return res.status(404).json({error:"No encontrado"});
  console.log("[UPDATE]", req.params.id);
  res.json(serialize(b));
}
export async function remove(req,res){
  const del = await Book.findByIdAndDelete(req.params.id);
  if(!del) return res.status(404).json({error:"No encontrado"});
  console.log("[DELETE]", req.params.id);
  res.json({ ok: true });
}
export async function coverById(req, res) {
  const id = decodeURIComponent(req.params.id);   // <<< importante
  const b = await Book.findOne({ openLibraryId: id });
  if (!b || !b.coverBase64) return res.status(404).json({ error: "Portada no encontrada" });
  res.json({ dataUrl: b.coverBase64 });
}

function serialize(d){
  return { id: d._id.toString(), openLibraryId: d.openLibraryId, title: d.title, author: d.author, year: d.year, coverBase64: d.coverBase64, review: d.review||"", rating: d.rating||null, createdAt: d.createdAt };
}
