// stores/library.ts
import { defineStore } from 'pinia'
import { useNuxtApp } from '#imports'   // o: import { useNuxtApp } from 'nuxt/app'

type FetchParams = {
  q?: string
  author?: string
  excludeNoReview?: boolean
  sort?: string
}

export const useLibraryStore = defineStore('library', {
  state: () => ({
    items: [] as any[],
    loading: false
  }),
  actions: {
    // ←↓↓ AQUI VA LO ROJO (fetch)
    async fetch(params: FetchParams = {}) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const list = await $api('/books/my-library', {
          method: 'GET',
          query: {
            q: params.q,
            author: params.author,
            // en el back se chequea excludeNoReview === "true"
            excludeNoReview: params.excludeNoReview ? 'true' : undefined,
            sort: params.sort
          }
        })
        this.items = Array.isArray(list) ? list : []
      } catch (err) {
        console.error('[library.fetch] error', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // ←↓↓ Y AQUI VA LO ROJO (remove)
    async remove(id: string) {
      try {
        const { $api } = useNuxtApp()
        await $api(`/books/my-library/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        })
        // quitar localmente el elemento borrado
        this.items = this.items.filter((it: any) => it.id !== id)
      } catch (err) {
        console.error('[library.remove] error', err)
        throw err
      }
    }
  }
})
