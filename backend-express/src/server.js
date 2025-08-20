import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { connectDB } from "./lib/db.js";
import routes from "./routes.js";

// --- Cargar .env desde la RAÍZ del repo ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "..", "..", ".env");
dotenv.config({ path: envPath });
// -----------------------------------------

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

/* ========== BASIC AUTH SOLO PARA MUTACIONES ========== */
function unauthorized(res) {
  res.set("WWW-Authenticate", 'Basic realm="Restricted"');
  return res.status(401).json({ error: "Unauthorized" });
}
function requireBasicAuth(req, res, next) {
  if (!process.env.BASIC_AUTH_USER) return next(); // desactivado si no hay user

  const hdr = req.headers.authorization || "";
  if (!hdr.toLowerCase().startsWith("basic ")) return unauthorized(res);

  const [u, p] = Buffer.from(hdr.slice(6), "base64")
    .toString("utf8")
    .split(/:(.*)/s); // soporta ":" en el pass

  const EU = (process.env.BASIC_AUTH_USER || "").trim();
  const EP = (process.env.BASIC_AUTH_PASS || "").trim();
  if ((u || "").trim() === EU && (p || "").trim() === EP) return next();

  return unauthorized(res);
}

// ← este guard solo se ejecuta en métodos de escritura
app.use("/api", (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return requireBasicAuth(req, res, next);
  }
  return next(); // GET/HEAD/OPTIONS pasan sin auth
});
/* ===================================================== */

app.use("/api", routes);

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error("[ERROR]", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal Server Error", detail: err.message });
});

const PORT = process.env.PORT || 3001;

// Conectar a Mongo con la URI del .env
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ Falta MONGODB_URI en el .env cargado:", envPath);
  process.exit(1);
}
await connectDB(uri);

app.listen(PORT, () => console.log(`[EXPRESS] http://localhost:${PORT}/api`));
