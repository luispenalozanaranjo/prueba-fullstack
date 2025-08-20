<script setup lang="ts">
const show = defineModel<boolean>({ default:false });
const props = defineProps<{ message?: string }>();
const emit = defineEmits(["confirm","cancel"]);
</script>
<template>
  <div v-if="show" style="position:fixed; inset:0; display:grid; place-items:center; background:rgba(0,0,0,.5);">
    <div class="card" style="max-width:420px;">
      <p>{{ props.message || '¿Confirmar?' }}</p>
      <div style="display:flex; gap:8px; justify-content:flex-end;">
        <button class="button secondary" @click="emit('cancel'); show=false">Cancelar</button>
        <button class="button danger" @click="emit('confirm'); show=false">Eliminar</button>
      </div>
    </div>
  </div>
</template>
