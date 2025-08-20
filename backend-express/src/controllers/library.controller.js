// src/controllers/library.controller.js
export async function update(req, res, next) {
  try {
    const { id } = req.params;    // ya validado como ObjectId
    const payload = req.body;     // ya validado/saneado según bookUpdateSchema
    const updated = await BookModel.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ error: 'NotFound' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}