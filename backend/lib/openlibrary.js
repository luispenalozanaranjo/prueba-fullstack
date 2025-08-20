import axios from "axios";

const client = axios.create({ baseURL: "https://openlibrary.org" });

export async function searchBooks(q) {
  const { data } = await client.get("/search.json", {
    params: { q, limit: 10 },
  });
  return (data.docs || []).slice(0, 10).map((d) => ({
    key: d.key,
    title: d.title,
    author: (d.author_name && d.author_name[0]) || "Desconocido",
    year: d.first_publish_year || null,
    coverId: d.cover_i || null,
  }));
}

export function buildOpenLibraryCoverUrl(coverId, size = "M") {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null;
}
