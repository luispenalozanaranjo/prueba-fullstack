// src/auth/basic.js
export function basicAuth(req, res, next) {
  if (!process.env.BASIC_AUTH_USER) return next(); // desactivado si no hay user

  const hdr = req.headers.authorization || "";
  if (!hdr.toLowerCase().startsWith("basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Restricted"');
    return res.status(401).json({ error: "Unauthorized" });
  }
  const [u, p] = Buffer.from(hdr.slice(6), "base64")
    .toString("utf8")
    .split(/:(.*)/s); // soporta ":" en el pass

  const EU = (process.env.BASIC_AUTH_USER || "").trim();
  const EP = (process.env.BASIC_AUTH_PASS || "").trim();
  if ((u || "").trim() === EU && (p || "").trim() === EP) return next();

  res.set("WWW-Authenticate", 'Basic realm="Restricted"');
  return res.status(401).json({ error: "Unauthorized" });
}