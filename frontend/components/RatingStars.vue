<script setup lang="ts">
const model = defineModel<number | null>({ default: null });
function set(v:number){ model.value = v; }
</script>
<template>
  <div style="display:flex; gap:8px; font-size:24px; cursor:pointer;">
    <span v-for="n in 5" :key="n" @click="set(n)">{{ (model ?? 0) >= n ? '★' : '☆' }}</span>
  </div>
</template>
