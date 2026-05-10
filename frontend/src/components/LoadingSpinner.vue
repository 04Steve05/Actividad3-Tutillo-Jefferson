<template>
  <div class="spinner-wrapper">
    <div class="spinner"></div>
    <p v-if="message" class="spinner-msg">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<style scoped>
.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.spinner-msg { color: #64748b; font-size: 0.9rem; }
</style>
