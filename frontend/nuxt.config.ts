export default defineNuxtConfig({
  modules: ["@pinia/nuxt"],
  css: ["~/assets/styles.scss"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3001",
            // SOLO PARA PRUEBAS LOCALES:
      basicUser: process.env.NUXT_PUBLIC_BASIC_USER || 'appUser',
      basicPass: process.env.NUXT_PUBLIC_BASIC_PASS || 'appPass123',
      public: { logLevel: process.env.LOG_LEVEL ?? 'info' }
    },
  },
    plugins: [
    { src: '~/plugins/log.client', mode: 'client' },
    { src: '~/plugins/api.client', mode: 'client' }
  ],
});
