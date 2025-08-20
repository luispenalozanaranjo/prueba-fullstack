<script setup lang="ts">
const model = defineModel<string>({ default: "" });
const emit = defineEmits(["search"]);
function onSubmit(e: Event){ e.preventDefault(); emit("search", model.value); }
</script>
<template>
  <form @submit="onSubmit" class="card" style="display:grid; gap:12px;">
    <input class="input" v-model="model" placeholder="Escribe el nombre de un Libro para continuar" />
    <button class="button" type="submit">Buscar</button>
  </form>
</template>
