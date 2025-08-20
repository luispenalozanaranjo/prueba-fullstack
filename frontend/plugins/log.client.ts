// plugins/log.client.ts
export interface Logger {
  http: (...args: any[]) => void
  info: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
}

export default defineNuxtPlugin(() => {
  const logger: Logger = {
    http: (...a) => console.log('[HTTP]', ...a),
    info: (...a) => console.log('[INFO]', ...a),
    warn: (...a) => console.warn('[WARN]', ...a),
    error: (...a) => console.error('[ERROR]', ...a),
  }

  return {
    provide: { log: logger }
  }
})
