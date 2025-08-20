// src/logger.js
import { createStream as rfsCreateStream } from 'rotating-file-stream'
import pino from 'pino'
import fs from 'node:fs'
import path from 'node:path'

// Carpeta de logs (ajústala si quieres otra ruta)
const LOG_DIR = path.resolve(process.cwd(), 'src', 'logs')
fs.mkdirSync(LOG_DIR, { recursive: true })

// Rotación diaria, 10 MB, gzip
const accessStream = rfsCreateStream('access.log', {
  interval: '1d',
  size: '10M',
  compress: 'gzip',
  path: LOG_DIR,
})
const errorStream = rfsCreateStream('error.log', {
  interval: '1d',
  size: '10M',
  compress: 'gzip',
  path: LOG_DIR,
})

// Logger de aplicación (stdout; bonito en dev)
const base = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'production'
      ? undefined
      : { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } },
})

// Interfaz simple que usa tu middleware: info/warn/error + http(linea)
const logger = {
  info: (...args) => base.info(...args),
  warn: (...args) => base.warn(...args),
  error: (...args) => {
    base.error(...args)
    const line = `[${new Date().toISOString()}] ${args
      .map(a => (typeof a === 'string' ? a : JSON.stringify(a)))
      .join(' ')}\n`
    errorStream.write(line)
  },
  // Para el access log (línea ya construida por el middleware)
  http: (line) => accessStream.write(line + '\n'),
}

export default logger
