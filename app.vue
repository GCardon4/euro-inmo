<template>
  <ClientOnly>
    <NuxtPage />
    <template #fallback>
      <div class="loading-app">
        <p>Cargando...</p>
      </div>
    </template>
  </ClientOnly>
</template>

<style>
.loading-app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: sans-serif;
  color: #0b6182;
}
</style>
