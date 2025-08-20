// types/nuxt.d.ts
import type { Logger } from '~/plugins/log.client'
import type { $Fetch } from 'ofetch'

declare module '#app' {
  interface NuxtApp {
    $log: Logger
    $api: $Fetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $log: Logger
    $api: $Fetch
  }
}

export {}
