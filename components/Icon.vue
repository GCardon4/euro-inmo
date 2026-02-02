<template>
  <i class="material-icons" :class="customClass" :style="{ fontSize: size, color: color }">
    <slot>{{ name }}</slot>
  </i>
</template>

<script setup>
// Componente reutilizable para Material Icons
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: '24px'
  },
  color: {
    type: String,
    default: ''
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.material-icons {
  vertical-align: middle;
  user-select: none;
}
</style>
