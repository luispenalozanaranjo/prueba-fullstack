
# Prueba Fullstack — Book Reviews (Nuxt 3 + Express + MongoDB)

Entrega lista para revisión. Este README explica **cómo ejecutar**, **probar** y **evaluar** el proyecto, alineado con los requisitos.

---

## 🧱 Stack
- **Frontend:** Nuxt 3, Pinia (store), Sass (desde cero)
- **Backend:** Node 18, Express, MongoDB (Mongoose), integración con OpenLibrary
- **Auth:** Basic (usuario/clave)
- **Logging:** Middleware + salida a consola/archivo
- **Infraestructura:** Docker + Docker Compose

---

## 🗂️ Estructura
```
backend-express/
  src/...
  Dockerfile
frontend/
  app.vue ...
  Dockerfile
docker-compose.yml
.env.example
```

---

## 🚀 Puesta en marcha (local)

### 1) Configuración de variables
Crea un archivo `.env` en la raíz o dentro de cada servicio (`backend-express/` y `frontend/`) tomando como base `.env.example`.

Debes rellenar **tus credenciales** manualmente:

- **MongoDB**  
  Usa el usuario y contraseña que tengas configurado en tu instancia.  
  Ejemplo de conexión válido:
  ```ini
  MONGODB_URI=mongodb://appUser:appPass123@127.0.0.1:27017/prueba_fullstack?authSource=admin
  ```

- **Auth Basic (API + Frontend)**  
  Recomendado usar el mismo par de credenciales:
  ```ini
  BASIC_AUTH_USER=appUser
  BASIC_AUTH_PASS=appPass123
  NUXT_PUBLIC_BASIC_USER=appUser
  NUXT_PUBLIC_BASIC_PASS=appPass123
  ```

⚠️ **No subas nunca credenciales reales a GitHub.**  
El archivo `.env.example` contiene solo placeholders `<YOUR_USER>` y `<YOUR_PASS>`.

### 2) Backend (Express)
```bash
cd backend-express
npm ci
npm run start
```

### 3) Frontend (Nuxt 3)
```bash
cd frontend
npm ci
npm run dev
```

---

## 🐳 Arranque con Docker (recomendado)

El proyecto incluye **Dockerfile** para backend y frontend + un **docker-compose.yml** en la raíz.

### Requisitos
- Docker 24+
- Docker Compose v2

### Ejecución
```bash
docker compose up --build
```

Servicios expuestos:
- **Frontend:** http://localhost:3000  
- **Backend:** http://localhost:3001  
- **MongoDB:** mongodb://localhost:27017/prueba_fullstack  

### Variables de entorno
En `docker-compose.yml` ya está preparada la configuración, pero recuerda pasar tus credenciales reales.  
Ejemplo:
```bash
BASIC_AUTH_USER=appUser BASIC_AUTH_PASS=appPass123 docker compose up --build
```

### Notas Docker
- El backend usa `MONGODB_URI=mongodb://<YOUR_MONGO_USER>:<YOUR_MONGO_PASS>@mongo:27017/prueba_fullstack?authSource=admin`  
- El frontend usa `NUXT_PUBLIC_API_BASE=http://api:3001` (resuelve al servicio `api`).  
- Los datos se persisten en el volumen `mongo-data`.

---

## 🔌 Endpoints (Resumen)

- `GET /api/books/search?q=termino`  
- `GET /api/books/last-search`  
- `POST /api/books/my-library`  
- `GET /api/books/my-library/:id`  
- `PUT /api/books/my-library/:id`  
- `DELETE /api/books/my-library/:id`  
- `GET /api/books/my-library` con filtros (`q`, `sort`, `withReview`)  
- (Opcional) `GET /api/books/library/front-cover/:id_portada`

---

## 🔐 Autenticación
- **Basic Auth** en la API.  
- El Front consume con las mismas credenciales.

---

## 🧾 Logging
- Middleware centralizado de logs (método, ruta, status, tiempo).  
- Se recomienda rotación de archivos (`winston-daily-rotate-file`).

---

## ✅ Checklist de Cumplimiento
(... igual que antes ...)

---

## 🧪 Pruebas rápidas
```bash
bash ./test_endpoints.sh
```

---

## ☁️ Deploy
- **Backend:** Railway/Render (usa `MONGODB_URI`, `BASIC_AUTH_USER`, `BASIC_AUTH_PASS`).  
- **Frontend:** Vercel/Netlify (`NUXT_PUBLIC_API_BASE` apuntando al backend).

---

¡Gracias por la revisión!
