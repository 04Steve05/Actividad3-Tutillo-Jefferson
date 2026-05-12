<template>
  <main class="not-found">
    <div class="nf-content">
      <span class="nf-code">404</span>
      <h1>Página no encontrada</h1>
      <p>La ruta <code>{{ route.path }}</code> no existe.</p>
      <router-link to="/" class="btn-home">Ir al catálogo</router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  padding: 2rem;
}
.nf-content { text-align: center; }
.nf-code {
  display: block;
  font-size: 8rem;
  font-weight: 900;
  color: #e2e8f0;
  line-height: 1;
  margin-bottom: 0.5rem;
}
h1 { margin: 0 0 0.75rem; color: #1e293b; }
p { color: #64748b; margin-bottom: 1.5rem; }
code { background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; color: #6366f1; }
.btn-home {
  display: inline-block;
  padding: 0.7rem 1.75rem;
  background: #6366f1;
  color: #fff;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-home:hover { background: #4f46e5; }
</style>
