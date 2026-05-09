<template>
  <NavBar />
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <LoadingSpinner message="Cargando página..." />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
</script>
