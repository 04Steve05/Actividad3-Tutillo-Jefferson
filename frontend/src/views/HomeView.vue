<template>
  <main class="home">
    <section class="home-header">
      <h1>Catálogo de Productos</h1>
      <p class="subtitle">Encuentra lo que necesitas</p>
    </section>

    <!-- Buscador y filtros -->
    <section class="filters">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Buscar por nombre o descripción..."
        class="search-input"
      />
      <select v-model="selectedCategory" class="category-select">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat._id" :value="cat._id">
          {{ cat.name }}
        </option>
      </select>
    </section>

    <!-- Estado de carga -->
    <LoadingSpinner v-if="loading" message="Cargando productos..." />

    <!-- Error -->
    <div v-else-if="error" class="error-box">
      <p>Error: {{ error }}</p>
      <button @click="fetchProducts" class="btn-retry">Reintentar</button>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="filteredProducts.length === 0" class="empty-state">
      <template v-if="searchQuery || selectedCategory">
        <p>No se encontraron productos para tu búsqueda.</p>
        <button @click="clearFilters" class="btn-retry">Limpiar filtros</button>
      </template>
      <template v-else>
        <p>No hay productos en el catálogo todavía.</p>
      </template>
    </div>

    <!-- Grilla de productos -->
    <section v-else class="products-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product._id"
        :product="product"
        @added-to-cart="handleAddToCart"
      />
    </section>

    <!-- Toast de confirmación -->
    <transition name="toast">
      <div v-if="toastVisible" :class="['toast', toastIsError ? 'toast--error' : '']">
        {{ toastMsg }}
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/stores/cart'
import ProductCard from '@/components/ProductCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Product } from '@/composables/useProducts'

const { products, categories, loading, error, fetchProducts, fetchCategories } = useProducts()

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
const { addToCart } = useCart()

const searchQuery = ref('')
const selectedCategory = ref('')
const toastVisible = ref(false)
const toastMsg = ref('')
const toastIsError = ref(false)

const filteredProducts = computed(() => {
  let list = products.value
  if (selectedCategory.value) {
    list = list.filter(p => {
      const catId = typeof p.categoryId === 'object' && p.categoryId !== null
        ? p.categoryId._id
        : p.categoryId
      return catId === selectedCategory.value
    })
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }
  return list
})

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
}

function handleAddToCart(product: Product) {
  const added = addToCart(product)
  toastMsg.value = added ? 'Producto añadido al carrito' : `Stock máximo alcanzado (${product.stock})`
  toastIsError.value = !added
  toastVisible.value = true
  setTimeout(() => (toastVisible.value = false), 2000)
}
</script>

<style scoped>
.home { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }
.home-header { text-align: center; margin-bottom: 1.5rem; }
.home-header h1 { font-size: 2rem; color: #1e1b4b; margin: 0; }
.subtitle { color: #64748b; margin: 0.3rem 0 0; }

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.search-input {
  flex: 1;
  min-width: 200px;
  padding: 0.65rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #6366f1; }
.category-select {
  padding: 0.65rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  background: #fff;
  cursor: pointer;
  min-width: 180px;
  outline: none;
}
.category-select:focus { border-color: #6366f1; }

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.error-box, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}
.error-box p { color: #dc2626; margin-bottom: 1rem; }
.btn-retry {
  padding: 0.5rem 1.5rem;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}
.btn-retry:hover { background: #4f46e5; }

.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #1e1b4b;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  box-shadow: 0 4px 16px rgba(0,0,0,.2);
  z-index: 999;
}
.toast--error { background: #dc2626; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
