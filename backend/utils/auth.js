import dotenv from "dotenv";
dotenv.config();

export function basicAuth(req, res, next) {
  const header = req.headers["authorization"] || "";
  const token = header.split(" ")[1];
  if (!token) return unauthorized(res);
  const decoded = Buffer.from(token, "base64").toString();
  const [user, pass] = decoded.split(":");
  if (user === process.env.BASIC_AUTH_USER && pass === process.env.BASIC_AUTH_PASS) return next();
  return unauthorized(res);
}

function unauthorized(res) {
  res.set("WWW-Authenticate", "Basic realm=\"Restricted\"");
  return res.status(401).json({ error: "Unauthorized" });
}
