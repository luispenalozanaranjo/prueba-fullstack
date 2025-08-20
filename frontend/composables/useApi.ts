import axios from "axios";
export function useApi(){
  const config = useRuntimeConfig();
  const http = axios.create({ baseURL: config.public.apiBase + "/api" });
  const user = process.client ? localStorage.getItem("basic_user") : null;
  const pass = process.client ? localStorage.getItem("basic_pass") : null;
  if (user && pass) {
    // @ts-ignore
    http.defaults.headers.common["Authorization"] = "Basic " + btoa(`${user}:${pass}`);
  }
  return {
    search: (q: string) => http.get("/books/search", { params: { q } }).then(r=>r.data),
    lastSearch: () => http.get("/books/last-search").then(r=>r.data),
    save: (payload: any) => http.post("/books/my-library", payload).then(r=>r.data),
    list: (params: any={}) => http.get("/books/my-library", { params }).then(r=>r.data),
    getById: (id: string) => http.get(`/books/my-library/${id}`).then(r=>r.data),
    update: (id: string, payload: any) => http.put(`/books/my-library/${id}`, payload).then(r=>r.data),
    remove: (id: string) => http.delete(`/books/my-library/${id}`).then(r=>r.data),
    frontCover: (openLibraryId: string) =>
      http.get(`/books/my-library/front-cover/${encodeURIComponent(openLibraryId)}`).then(r=>r.data),
  };
}
