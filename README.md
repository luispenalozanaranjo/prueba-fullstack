## Prueba Fullstack — Book Reviews (Nuxt 3 + Express + MongoDB)

Entrega lista para revisión. Este README explica **cómo ejecutar**, **probar** y **evaluar** el proyecto, alineado con los requisitos.

---

## Levantar todo con Docker
```bash
docker compose up --build
# Front: http://localhost:3000
# Back : http://localhost:3001/api
---

## 🧱 Stack
- **Frontend:** Nuxt 3, Pinia (store), Sass (desde cero)
- **Backend:** Node 18, Express, MongoDB (Mongoose), integración con OpenLibrary
- **Auth:** Basic (usuario/clave)
- **Logging:** Middleware + salida a consola/archivo

---

## 🗂️ Estructura
```
backend-express/
  src/
    auth/
    controllers/
    lib/
    middlewares/
    models/
    validation/
    logger.js
    logging-middleware.js
    routes.js
    server.js
  package.json
  Dockerfile (opcional)
frontend/
  app.vue
  pages/...
  stores/...
  assets/scss/...
  nuxt.config.ts
  package.json
```

---

## 🚀 Puesta en marcha

### 1) Backend (Express)
**Requisitos:** Node 18, MongoDB en ejecución.

1. Crea `backend-express/.env` (ejemplo):
   ```ini
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/bookreviews
   BASIC_AUTH_USER=admin
   BASIC_AUTH_PASS=secret
   OPENLIBRARY_BASE=https://openlibrary.org
   ```

2. Instala y levanta:
   ```bash
   cd backend-express
   npm ci
   npm run start    # o npm run dev
   ```

> La API usa **Auth Basic**. Usa las credenciales del `.env` en tus llamadas.

### 2) Frontend (Nuxt 3)
**Requisitos:** Node 18

1. Crea `frontend/.env`:
   ```ini
   NUXT_PUBLIC_API_BASE=http://localhost:3001
   NUXT_PUBLIC_BASIC_USER=admin
   NUXT_PUBLIC_BASIC_PASS=secret
   ```

2. Instala y levanta:
   ```bash
   cd frontend
   npm ci
   npm run dev                    # desarrollo
   # o producción local:
   npm run build && npm run preview
   ```

---

## 🔌 Endpoints (Resumen)

- `GET /api/books/search?q=termino`  
  Busca en OpenLibrary (máx. 10). Si algún libro ya está en “mi biblioteca”, devuelve portada desde la API local/almacenada.

- `GET /api/books/last-search`  
  Últimas 5 búsquedas del usuario.

- `POST /api/books/my-library`  
  Guarda libro (título, autor, año, **portada en Base64**), `review` (≤ 500 chars) y `rating` (1–5).

- `GET /api/books/my-library/:id`  
  Devuelve el libro guardado por ID (autogenerado en DB).

- `PUT /api/books/my-library/:id`  
  Actualiza **review** y **calificación** del libro.

- `DELETE /api/books/my-library/:id`  
  Elimina el libro.

- `GET /api/books/my-library`  
  Lista con filtros:  
  - `q` → busca por título/autor  
  - `sort=rating:asc|desc` → orden por calificación  
  - `withReview=true|false` → excluir/mostrar sin review

*(Opcional recomendado)* `GET /api/books/library/front-cover/:id_portada` → sirve la portada guardada (Base64).

---

## 🔐 Autenticación
- **Basic Auth** en la API.  
- El Front consume con las mismas credenciales (`NUXT_PUBLIC_BASIC_USER` / `NUXT_PUBLIC_BASIC_PASS`).

---

## 🧾 Logging
- Middleware centralizado de logs (método, ruta, status, tiempo).  
- Se recomienda rotación de archivos si se persisten (por ejemplo, `winston-daily-rotate-file`).

---

## ✅ Checklist de Cumplimiento (Front)
- [ ] Buscador centrado con placeholder: **"Escribe el nombre de un Libro para continuar"**  
- [ ] Mostrar **hasta 5 búsquedas recientes**  
- [ ] Resultados máx **10** con **Título y Portada**, o **"no encontramos libros con el título ingresado"**  
- [ ] Vista de **detalle**: Título, Autor, Año, Portada  
- [ ] **Review ≤ 500** y **calificación 1–5**  
- [ ] **Guardar** ➜ **mensaje de éxito**  
- [ ] **Mi biblioteca** accesible siempre (botón arriba derecha)  
- [ ] **Mi biblioteca**: buscar por **título/autor**, ordenar por **calificación asc/desc**, **excluir sin review**  
- [ ] **Editar** y **Eliminar** (con confirmación)  

## ✅ Checklist de Cumplimiento (Back)
- [ ] Endpoints implementados como arriba  
- [ ] Integración con **OpenLibrary** en `/search`  
- [ ] **Portada Base64** almacenada y reutilizada cuando corresponda  
- [ ] **MongoDB** con IDs autogenerados  
- [ ] **Logging** de endpoints  
- [ ] **Auth Basic** configurada  

---

## 🧪 Pruebas rápidas
Incluimos un script de cURL para probar los endpoints end-to-end. Ajusta credenciales/URL si es necesario.

```bash
bash ./test_endpoints.sh
```

Si no lo tienes en el repo, puedes descargarlo desde la entrega o replicar estos comandos:
```bash
# search
curl -u admin:secret "http://localhost:3001/api/books/search?q=harry%20potter"

# last-search
curl -u admin:secret "http://localhost:3001/api/books/last-search"

# create
curl -u admin:secret -H "Content-Type: application/json"  -d '{"title":"Test Book","author":"Anon","year":2020,"coverBase64":"data:image/png;base64,iVBORw0KGgo=","review":"Muy buen libro","rating":5}'  "http://localhost:3001/api/books/my-library"
```

---

## ☁️ Deploy rápido
- **Backend:** Railway/Render (variables: `MONGO_URI`, `PORT`, `BASIC_AUTH_USER`, `BASIC_AUTH_PASS`)  
- **Frontend:** Vercel/Netlify (`NUXT_PUBLIC_API_BASE` apuntando al backend)

---

## 📌 Notas
- Se prioriza UX clara (estados vacíos, feedback de acciones, accesos visibles).  
- Código organizado por responsabilidad (controllers, servicios/lib, validaciones).  
- Donde aplica, se añaden validaciones del payload y manejo de errores homogéneo.

---

¡Gracias por la revisión!

