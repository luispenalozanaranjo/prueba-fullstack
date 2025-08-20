// src/logging-middleware.js
export default function loggingMiddleware (logger) {
  return (req, res, next) => {
    const start = process.hrtime.bigint()

    res.on('finish', () => {
      const durMs = Number(process.hrtime.bigint() - start) / 1e6
      const log = logger.http ?? logger.info.bind(logger) // fallback si no existe .http

      log({
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        ms: +durMs.toFixed(1),
        ip: req.ip,
        ua: req.headers['user-agent'],
      }, 'HTTP')
    })

    next()
  }
}
// si usas pino, importa así: import loggingMiddleware from './logging-middleware.js'; app.use(loggingMiddleware(logger));