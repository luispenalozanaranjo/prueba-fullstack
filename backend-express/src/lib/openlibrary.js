import axios from "axios";
const client = axios.create({ baseURL: "https://openlibrary.org" });
export async function searchBooks(q) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { timeout: 10000 }); // si usas node-fetch, añade timeout
  if (!res.ok) throw new Error(`OpenLibrary ${res.status}`);
  const data = await res.json();
  // mapea solo lo que necesitas
  return (data.docs || []).slice(0, 20).map(d => ({
    key: d.key || d.cover_edition_key || d.edition_key?.[0],
    title: d.title,
    author: d.author_name?.[0] || "",
    year: d.first_publish_year || null
  }));
}
export const coverUrl = (id, size="M") => id ? `https://covers.openlibrary.org/b/id/${id}-${size}.jpg` : null;
