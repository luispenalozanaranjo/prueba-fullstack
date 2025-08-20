<script setup lang="ts">
const q = ref("");
const searchStore = useSearchStore();
onMounted(() => searchStore.fetchLast());
async function doSearch(query:string){ await searchStore.search(query); }
</script>
<template>
  <div class="grid" style="gap:24px;">
    <SearchBar v-model="q" @search="doSearch" />

    <div class="card" v-if="searchStore.last.length">
      <strong>Últimas búsquedas</strong>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
        <button class="button secondary" v-for="s in searchStore.last" :key="s" @click="doSearch(s)">{{ s }}</button>
      </div>
    </div>

    <div v-if="searchStore.loading">Buscando...</div>
    <div v-else-if="!searchStore.results.length" class="card">No hay resultados todavía</div>
    <div v-else class="grid books">
      <BookCard v-for="b in searchStore.results" :key="b.id" :id="b.id" :title="b.title" :author="b.author" :year="b.year" :cover="b.cover" />
    </div>
  </div>
</template>
