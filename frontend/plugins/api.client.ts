// plugins/api.client.ts
import { ofetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const nuxt = useNuxtApp()

  // fallback seguro
  const log = (nuxt.$log as any) ?? {
    http: (...a: any[]) => console.log('[HTTP]', ...a),
    info: (...a: any[]) => console.log('[INFO]', ...a),
    error: (...a: any[]) => console.error('[ERR]', ...a),
  }

  const basic = 'Basic ' + btoa('appUser:appPass123') // o toma de runtimeConfig.public si ya lo tienes

  const $api = ofetch.create({
    baseURL: `${config.public.apiBase}/api`,
    onRequest({ request, options }) {
      const method = String((options as any).method || 'GET').toUpperCase()

      // auth sólo para mutaciones
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        options.headers = {
          ...(options.headers as any),
          Authorization: basic,
        }
      }

      // log defensivo
      const msg = `${method} ${String(request)}`
      try { (log.http ?? console.log).call(log, '->', msg) }
      catch { console.log('[HTTP]', '->', msg) }
    },
    onResponse({ request, response, options }) {
      const method = String((options as any).method || 'GET').toUpperCase()
      const msg = `${method} ${String(request)} <- ${response.status}`
      try { (log.http ?? console.log).call(log, msg) }
      catch { console.log('[HTTP]', msg) }
    },
    onResponseError({ request, response, error, options }) {
      const method = String((options as any).method || 'GET').toUpperCase()
      const msg = `${method} ${String(request)} !! ${response?.status ?? 'ERR'}`
      try { (log.error ?? console.error).call(log, msg, error) }
      catch { console.error('[HTTP]', msg, error) }
    }
  })

  return { provide: { api: $api } }
})
