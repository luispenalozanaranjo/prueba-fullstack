<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAsyncData, useNuxtApp } from 'nuxt/app'
import type { $Fetch } from 'ofetch'

const $api = useNuxtApp().$api as $Fetch
const route = useRoute()

// -------- formulario
const review = ref('')
const rating = ref<number | null>(null)
const coverBase64 = ref<string | null>(null)
const success = ref(false)
const lastError = ref<string | null>(null)   // ← veremos aquí el mensaje del back

// id BD desde query (hoisted -> sin TDZ)
function getDbId(): string | null {
  const q = route.query.dbId
  if (Array.isArray(q)) return q[0] ?? null
  return q != null ? String(q) : null
}
const editingId = computed(getDbId)

// id OpenLibrary normalizado
const openLibraryId = computed(() => {
  const p = route.params.id as string | string[]
  const s = Array.isArray(p) ? '/' + p.join('/') : String(p ?? '')
  try { return decodeURIComponent(s) } catch { return s }
})

interface BookDetail {
  openLibraryId: string
  title: string
  author: string
  year: number | null
  cover: string | null
}

// PRE-FETCH: carga datos de la card + valores previos si es edición
const { data: book, pending, error } = useAsyncData<BookDetail>('bookDetail', async () => {
  const q = route.query
  const base: BookDetail = {
    openLibraryId: openLibraryId.value,
    title:  String(q.title  ?? ''),
    author: String(q.author ?? ''),
    year:   q.year != null ? Number(q.year) : null,
    cover:  q.cover ? String(q.cover) : null,  // si viene desde Mi Biblioteca
  }

  const dbId = getDbId()
  if (dbId) {
    try {
      // GET sobre tu back usando $api (NO /api/… con $fetch)
      const existing = await $api<{ review?: string; rating?: number|null; coverBase64?: string|null }>(
        `/books/my-library/${dbId}`,
        { method: 'GET' }
      )
      review.value = String(existing?.review ?? '')
      rating.value = existing?.rating ?? null
      if (!base.cover && existing?.coverBase64) base.cover = existing.coverBase64
    } catch (e) {
      console.warn('No se pudo precargar desde la BD:', e)
    }
  }

  // ❌ Importante: NO hagas ninguna llamada a front-cover si ese endpoint no existe en tu back.
  return base
})

// portada a mostrar (primero la subida, luego la precargada)
const displayCover = computed(() => coverBase64.value || book.value?.cover || null)

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}
async function onUpload(e: Event) {
  const i = e.target as HTMLInputElement
  if (i.files && i.files[0]) coverBase64.value = await fileToBase64(i.files[0])
}

async function save () {
  lastError.value = null
  success.value = false
  if (!book.value) return

  const body = {
    openLibraryId: book.value.openLibraryId,
    title:        book.value.title,
    author:       book.value.author,
    year:         book.value.year,
    ...(coverBase64.value ? { coverBase64: coverBase64.value } : {}),
    review:       review.value,
    rating:       rating.value,
  }

  const isEdit = !!editingId.value
  const path   = isEdit ? `/books/my-library/${editingId.value}` : `/books/my-library`
  const method = isEdit ? 'PUT' : 'POST'

  console.log('[DEBUG] baseURL debe verse arriba en consola al arrancar el app')
  console.log('[DEBUG] SAVE →', method, path, body)

  try {
    // 👉 Esto va a http://localhost:3001/api + path (porque $api tiene baseURL '/api')
    await $api(path, { method, body })
    success.value = true
  } catch (err: any) {
    console.error('[SAVE ERROR]', err)
    // ofetch suele poner info útil en err.data
    lastError.value = err?.data?.message || err?.message || 'Error desconocido'
  }
}
</script>

<template>
  <div class="grid" style="gap:16px;">
    <div v-if="pending" class="card">Cargando…</div>
    <div v-else-if="error" class="card">Error de precarga: {{ error.message }}</div>

    <div v-else-if="book" class="card">
      <div style="display:flex; gap:16px;">
        <img
          v-if="displayCover"
          :src="displayCover"
          alt="portada"
          style="width:200px;aspect-ratio:2/3;object-fit:cover;border-radius:10px;"
        />
        <div style="flex:1;">
          <h2 style="margin:0 0 6px;">{{ book.title }}</h2>
          <small class="muted">
            {{ book.author }}
            <span v-if="book.year">· {{ book.year }}</span>
          </small>
          <div style="margin-top:12px;">
            <input type="file" @change="onUpload" />
            <small class="muted"> Sube una portada (se guarda en base64)</small>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <label>Review</label>
      <textarea class="textarea" v-model="review" maxlength="500" rows="6"
                placeholder="Escribe una reseña (máx 500)" />
      <label>Calificación</label>
      <RatingStars v-model="rating" />

      <div style="display:flex;justify-content:flex-end;margin-top:12px;">
        <button class="button" @click="save">Guardar en Mi Biblioteca</button>
      </div>

      <div v-if="success" style="margin-top:8px;color:#86efac;">Guardado correctamente, si quiere ver su registro, presione mi biblioteca ✔</div>
      <div v-else-if="lastError" class="card" style="margin-top:8px;color:#fca5a5;">
        Error del servidor: {{ lastError }}
      </div>
    </div>
  </div>
</template>
