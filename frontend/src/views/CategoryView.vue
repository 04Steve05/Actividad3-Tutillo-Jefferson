<template>
  <main class="category-page">
    <h1 class="page-title">Gestión de Categorías</h1>

    <!-- Formulario nueva categoría -->
    <section class="cat-form-card">
      <h2>Nueva Categoría</h2>
      <form class="cat-form" @submit.prevent="handleCreate">
        <input
          v-model="newName"
          type="text"
          placeholder="Nombre de la categoría"
          :class="{ invalid: formError }"
          @input="formError = ''"
        />
        <button type="submit" class="btn-create" :disabled="creating">
          {{ creating ? 'Guardando...' : '+ Agregar' }}
        </button>
      </form>
      <p v-if="formError" class="field-error">{{ formError }}</p>
      <p v-if="createSuccess" class="success-msg">Categoría creada correctamente</p>
    </section>

    <!-- Lista de categorías -->
    <section class="cat-list-section">
      <LoadingSpinner v-if="loading" message="Cargando categorías..." />

      <div v-else-if="error" class="error-box">
        <p>Error: {{ error }}</p>
        <button class="btn-retry" @click="loadCategories">Reintentar</button>
      </div>

      <div v-else-if="categories.length === 0" class="empty-state">
        <p>No hay categorías todavía. ¡Crea la primera!</p>
      </div>

      <ul v-else class="cat-list">
        <li v-for="cat in categories" :key="cat._id" class="cat-item">
          <span class="cat-name">{{ cat.name }}</span>
          <button
            class="btn-delete"
            :disabled="deleting === cat._id"
            @click="handleDelete(cat)"
          >
            {{ deleting === cat._id ? '...' : 'Eliminar' }}
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Category } from '@/composables/useProducts'

const API = import.meta.env.VITE_API_URL

const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const newName = ref('')
const creating = ref(false)
const formError = ref('')
const createSuccess = ref(false)

const deleting = ref<string | null>(null)

async function loadCategories() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${API}/api/categories`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    categories.value = await res.json()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error al cargar'
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  const name = newName.value.trim()
  if (!name) { formError.value = 'El nombre es obligatorio'; return }
  creating.value = true
  createSuccess.value = false
  try {
    const res = await fetch(`${API}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body.message || `HTTP ${res.status}`)
    categories.value.push(body)
    newName.value = ''
    createSuccess.value = true
    setTimeout(() => (createSuccess.value = false), 2500)
  } catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Error al crear'
  } finally {
    creating.value = false
  }
}

async function handleDelete(cat: Category) {
  if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return
  deleting.value = cat._id
  try {
    const res = await fetch(`${API}/api/categories/${cat._id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.message || `HTTP ${res.status}`)
    }
    categories.value = categories.value.filter(c => c._id !== cat._id)
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : 'Error al eliminar')
  } finally {
    deleting.value = null
  }
}

onMounted(loadCategories)
</script>

<style scoped>
.category-page { padding: 1.5rem; max-width: 640px; margin: 0 auto; }
.page-title { font-size: 1.75rem; color: #1e1b4b; margin-bottom: 1.5rem; }

.cat-form-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,.07);
  margin-bottom: 2rem;
}
.cat-form-card h2 { margin: 0 0 1rem; font-size: 1.1rem; color: #1e293b; }

.cat-form { display: flex; gap: 0.75rem; }
.cat-form input {
  flex: 1;
  padding: 0.65rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}
.cat-form input:focus { border-color: #6366f1; }
.cat-form input.invalid { border-color: #f43f5e; }

.btn-create {
  padding: 0.65rem 1.25rem;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.btn-create:hover:not(:disabled) { background: #4f46e5; }
.btn-create:disabled { background: #94a3b8; cursor: not-allowed; }
.field-error { color: #f43f5e; font-size: 0.82rem; margin: 0.4rem 0 0; }
.success-msg { color: #16a34a; font-size: 0.88rem; margin: 0.4rem 0 0; }

.cat-list-section { }
.cat-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; }

.cat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.1rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}
.cat-name { font-weight: 600; color: #1e293b; }
.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  color: #94a3b8;
  transition: color 0.2s, background 0.2s;
}
.btn-delete:hover:not(:disabled) { color: #f43f5e; background: #fff1f2; }
.btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }

.error-box { text-align: center; padding: 2rem; color: #dc2626; }
.btn-retry {
  margin-top: 0.75rem; padding: 0.5rem 1.25rem;
  background: #6366f1; color: #fff; border: none; border-radius: 8px; cursor: pointer;
}
.empty-state { text-align: center; padding: 2rem; color: #64748b; }
</style>
