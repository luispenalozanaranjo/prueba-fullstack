<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
  title: string
  author?: string
  cover?: string | null
  year?: number | null
}>()

const to = computed(() => {
  const path = '/libro/' + encodeURIComponent(props.id)
  const q: Record<string, string> = {}
  if (props.title)  q.title  = props.title
  if (props.author) q.author = props.author
  if (props.year != null) q.year = String(props.year)
  if (props.cover) q.cover  = props.cover
  const query = new URLSearchParams(q).toString()
  return `${path}${query ? `?${query}` : ''}`
})
</script>

<template>
  <NuxtLink :to="to" class="card" style="display:grid;gap:8px;">
    <img
      v-if="cover"
      :src="cover"
      alt="portada"
      style="width:100%;aspect-ratio:2/3;object-fit:cover;border-radius:10px;"
    />
    <div>
      <strong>{{ title }}</strong>
      <div><small class="muted">{{ author }} <span v-if="year">· {{ year }}</span></small></div>
    </div>
  </NuxtLink>
</template>
