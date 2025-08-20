// src/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import logger from './logger.js'
import logging from './logging-middleware.js'
import { connectDB } from './lib/db.js'
import routes from './routes.js'

/* ---------- Carga del .env (desde la raíz del repo si lo tenés allí) ---------- */
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
// ajustá niveles según dónde está tu .env
const envPath = path.resolve(__dirname, '..', '..', '.env')
dotenv.config({ path: envPath })

/* ---------- Dump básico de boot ---------- */
console.log('[BOOT] Node:', process.version)
console.log('[BOOT] Cargando .env desde:', envPath)
console.log('[BOOT] MONGODB_URI presente:', !!process.env.MONGODB_URI)
console.log('[BOOT] NODE_ENV:', process.env.NODE_ENV || '(no definido)')

/* ---------- Express ---------- */
const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

// Log de access (rotativo) antes que nada
app.use(logging(logger))

/* ---------- Basic Auth sólo para mutaciones bajo /api ---------- */
function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm="Restricted"')
  return res.status(401).json({ error: 'Unauthorized' })
}
function requireBasicAuth(req, res, next) {
  if (!process.env.BASIC_AUTH_USER) return next() // desactivado si no hay user
  const hdr = req.headers.authorization || ''
  if (!hdr.toLowerCase().startsWith('basic ')) return unauthorized(res)
  const [u, p] = Buffer.from(hdr.slice(6), 'base64').toString('utf8').split(/:(.*)/s)
  const EU = (process.env.BASIC_AUTH_USER || '').trim()
  const EP = (process.env.BASIC_AUTH_PASS || '').trim()
  if ((u || '').trim() === EU && (p || '').trim() === EP) return next()
  return unauthorized(res)
}
app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return requireBasicAuth(req, res, next)
  }
  return next()
})

/* ---------- Rutas ---------- */
app.use('/api', routes)

/* ---------- Error handler global (siempre al final) ---------- */
app.use((err, req, res, next) => {
  logger.error({ err, url: req.originalUrl }, '[ERROR] Handler global')
  if (res.headersSent) return next(err)
  res.status(500).json({ error: 'Internal Server Error', detail: err?.message })
})

/* ---------- Arranque con try/catch para ver cualquier fallo ---------- */
const PORT = process.env.PORT || 3001
const uri  = process.env.MONGODB_URI

async function main() {
  console.log('[BOOT] Iniciando servidor...')
  if (!uri) {
    console.error('❌ Falta MONGODB_URI en el .env')
    process.exit(1)
  }

  try {
    await connectDB(uri)
    console.log('[DB] Conectado OK')
  } catch (e) {
    console.error('❌ Error conectando a MongoDB:', e)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`[EXPRESS] http://localhost:${PORT}/api`)
  })
}

// capturar cualquier cosa que se escape:
process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION]', err)
})
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err)
})

main().catch((e) => {
  console.error('[FATAL] main() falló:', e)
  process.exit(1)
})
