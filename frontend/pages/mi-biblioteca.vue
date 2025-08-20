<script setup lang="ts">
import { ref, watch } from 'vue';
import { onMounted as vueOnMounted } from 'vue';
// Ajusta la ruta si es necesario
// Ajusta la ruta si es necesario
import { useLibraryStore } from '../stores/library';
import { useRouter } from 'vue-router'
const router = useRouter()

function onMounted(fn: () => Promise<void>) {
  vueOnMounted(() => { fn(); });
}

const store = useLibraryStore();
const q = ref("");
const author = ref("");
const exclude = ref(false);
const sort = ref("rating_desc");

async function fetch(){
  await store.fetch({
    q: q.value || undefined,
    author: author.value || undefined,
    excludeNoReview: exclude.value,
    sort: sort.value
  });
}
onMounted(fetch);
watch([q, author, exclude, sort], fetch);

const showConfirm = ref(false);
let toDelete: string | null = null;
function askDelete(id:string){ toDelete = id; showConfirm.value = true; }
async function confirmDelete(){ if (toDelete) await store.remove(toDelete); }

// Asegura que el id siempre empiece con "/" y vaya URL-codificado (soporta "works/OL..." y "%2Fworks%2FOL...")
function encodeId(raw: string) {
  const s = raw?.startsWith('/') ? raw : `/${raw}`
  return encodeURIComponent(s)
}

function goEdit(b: any) {
  router.push({
    path: `/libro/${encodeId(b.openLibraryId)}`,
    query: {
      // 👇 MUY IMPORTANTE para que el detalle haga PUT:
      dbId: b.id,
      // Rellenos que ya usas en [id].vue:
      title: b.title ?? '',
      author: b.author ?? '',
      year: b.year ?? '',
      cover: b.coverBase64 ?? '',   // si ya tienes la portada en base64
      review: b.review ?? '',            // ← opcional
      rating: b.rating ?? ''             // ← opcional
    }
  })
}
</script>

<template>
  <div class="grid" style="gap:16px;">
    <div class="card" style="display:grid; gap:8px;">
      <strong>Buscar & Filtrar</strong>
      <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; gap:8px;">
        <input class="input" v-model="q" placeholder="Buscar por título" />
        <input class="input" v-model="author" placeholder="Buscar por autor" />
        <select class="select" v-model="sort">
          <option value="rating_desc">Rating ↓</option>
          <option value="rating_asc">Rating ↑</option>
        </select>
        <label style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" v-model="exclude" /> Excluir sin review
        </label>
      </div>
    </div>

    <div v-if="store.loading">Cargando...</div>
    <div v-else-if="!store.items.length" class="card">No hay libros en tu biblioteca</div>
    <div v-else class="grid books">
      <div class="card" v-for="b in store.items" :key="b.id" style="display:grid; gap:8px;">
        <img v-if="b.coverBase64" :src="b.coverBase64" alt="portada"
             style="width:100%; aspect-ratio:2/3; object-fit:cover; border-radius:10px;" />
        <div>
          <strong>{{ b.title }}</strong>
          <div><small class="muted">{{ b.author }} <span v-if="b.year">· {{ b.year }}</span></small></div>
          <div v-if="b.rating">⭐ {{ b.rating }}/5</div>
          <p v-if="b.review">{{ b.review }}</p>
        </div>
        <div style="display:flex; gap:8px;">
          <!-- 👇 AQUI usamos encodeId -->
 <button class="button secondary" @click="goEdit(b)">Editar</button>

          <button class="button danger" @click="askDelete(b.id)">Eliminar</button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-model="showConfirm"
      message="¿Eliminar este libro de forma permanente?"
      @confirm="confirmDelete"
    />
  </div>
</template>
