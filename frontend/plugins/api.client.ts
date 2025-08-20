// frontend/plugins/api.client.ts
import { ofetch } from 'ofetch'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const { public: { apiBase } } = useRuntimeConfig()

  // 👇 credenciales de escritura (puedes moverlas a env si quieres)
  const basic = 'Basic ' + btoa('appUser:appPass123')

  const $api = ofetch.create({
    // 👈 MUY IMPORTANTE: fuerza que todo vaya al backend
    baseURL: `${apiBase}/api`,
    onRequest({ options }) {
      const m = String(options.method || 'GET').toUpperCase()
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(m)) {
        options.headers = {
          ...(options.headers as any),
          Authorization: basic,
        }
      }
    },
  })

  // Para comprobar que el plugin cargó
  console.log('[API] baseURL =>', `${apiBase}/api`)

  return { provide: { api: $api } }
})
