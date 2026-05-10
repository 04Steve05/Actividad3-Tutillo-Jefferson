<template>
  <main class="detail-page">
    <button class="back-btn" @click="router.back()">← Volver</button>

    <LoadingSpinner v-if="loading" message="Cargando producto..." />

    <div v-else-if="error" class="error-box">
      <p>Error: {{ error }}</p>
      <button class="btn-retry" @click="retry(productUrl)">Reintentar</button>
    </div>

    <article v-else-if="product" class="detail-card">
      <div class="detail-img-wrapper">
        <img
          :src="product.imageUrl || 'https://placehold.co/600x400?text=Sin+imagen'"
          :alt="product.name"
          class="detail-img"
          @error="onImgError"
        />
      </div>

      <div class="detail-info">
        <p v-if="categoryName" class="detail-category">{{ categoryName }}</p>
        <h1 class="detail-title">{{ product.name }}</h1>
        <p class="detail-desc">{{ product.description }}</p>

        <div class="detail-meta">
          <span class="detail-price">${{ product.price.toFixed(2) }}</span>
          <span :class="['detail-stock', product.stock === 0 ? 'out' : '']">
            {{ product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock' }}
          </span>
        </div>

        <div class="detail-actions">
          <button
            class="btn-add"
            :disabled="product.stock === 0"
            @click="handleAddToCart"
          >
            {{ product.stock > 0 ? 'Añadir al carrito' : 'Sin stock' }}
          </button>
          <router-link :to="`/product/${product._id}/edit`" class="btn-edit">
            Editar
          </router-link>
          <button class="btn-delete" :disabled="deleting" @click="handleDelete">
            {{ deleting ? '...' : 'Eliminar' }}
          </button>
        </div>

        <p v-if="added" class="added-msg">Añadido al carrito</p>
        <p v-if="stockWarning" class="stock-warning">Stock máximo en carrito ({{ product.stock }})</p>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from '@/composables/useFetch'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/stores/cart'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Product } from '@/composables/useProducts'

const API = import.meta.env.VITE_API_URL

const route = useRoute()
const router = useRouter()
const { deleteProduct } = useProducts()
const { addToCart } = useCart()

// useFetch genérico para cargar el producto
const { data: product, loading, error, retry } = useFetch<Product>()

const productUrl = computed(() => `${API}/api/products/${route.params.id}`)
const deleting = ref(false)
const added = ref(false)
const stockWarning = ref(false)

const categoryName = computed(() => {
  if (!product.value?.categoryId) return null
  const cat = product.value.categoryId
  return typeof cat === 'object' ? cat.name : null
})

onMounted(() => {
  retry(productUrl.value)
})

function handleAddToCart() {
  if (!product.value) return
  const ok = addToCart(product.value)
  if (ok) {
    added.value = true
    stockWarning.value = false
    setTimeout(() => (added.value = false), 2000)
  } else {
    stockWarning.value = true
  }
}

async function handleDelete() {
  if (!product.value) return
  if (!confirm(`¿Eliminar "${product.value.name}"? Esta acción no se puede deshacer.`)) return
  deleting.value = true
  const ok = await deleteProduct(product.value._id)
  deleting.value = false
  if (ok) router.push('/')
}

function onImgError(e: Event) {
  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Sin+imagen'
}
</script>

<style scoped>
.detail-page { padding: 1.5rem; max-width: 900px; margin: 0 auto; }
.back-btn {
  background: none; border: none; cursor: pointer; color: #6366f1;
  font-size: 0.95rem; font-weight: 600; padding: 0; margin-bottom: 1.5rem;
}
.back-btn:hover { text-decoration: underline; }

.detail-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,.1);
}
.detail-img-wrapper { max-height: 480px; overflow: hidden; }
.detail-img { width: 100%; height: 100%; object-fit: cover; }
.detail-info { padding: 2rem; display: flex; flex-direction: column; gap: 1rem; }
.detail-category {
  font-size: 0.75rem; font-weight: 600; color: #6366f1;
  text-transform: uppercase; letter-spacing: .8px; margin: 0;
}
.detail-title { margin: 0; font-size: 1.75rem; color: #1e293b; line-height: 1.2; }
.detail-desc { color: #475569; line-height: 1.7; margin: 0; flex: 1; }
.detail-meta { display: flex; gap: 1.5rem; align-items: baseline; }
.detail-price { font-size: 2rem; font-weight: 800; color: #1e293b; }
.detail-stock { font-size: 0.9rem; color: #16a34a; }
.detail-stock.out { color: #dc2626; }
.detail-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.btn-add {
  flex: 1; padding: 0.75rem 1.25rem; background: #6366f1; color: #fff;
  border: none; border-radius: 10px; font-size: 1rem; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.btn-add:hover:not(:disabled) { background: #4f46e5; }
.btn-add:disabled { background: #94a3b8; cursor: not-allowed; }
.btn-edit {
  padding: 0.75rem 1.25rem; background: #f1f5f9; color: #475569;
  border-radius: 10px; text-decoration: none; font-weight: 600;
  font-size: 1rem; transition: background 0.2s;
}
.btn-edit:hover { background: #e2e8f0; }
.btn-delete {
  padding: 0.75rem 1rem; background: #fff1f2; color: #f43f5e;
  border: 1.5px solid #fecdd3; border-radius: 10px; font-size: 1rem;
  font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.btn-delete:hover:not(:disabled) { background: #ffe4e6; }
.btn-delete:disabled { opacity: 0.6; cursor: not-allowed; }
.added-msg { color: #16a34a; font-weight: 600; font-size: 0.9rem; margin: 0; }
.stock-warning { color: #d97706; font-weight: 600; font-size: 0.88rem; margin: 0; }
.error-box { text-align: center; padding: 3rem; color: #dc2626; }
.btn-retry {
  margin-top: 1rem; padding: 0.5rem 1.5rem; background: #6366f1;
  color: #fff; border: none; border-radius: 8px; cursor: pointer;
}

@media (max-width: 700px) {
  .detail-card { grid-template-columns: 1fr; }
  .detail-img-wrapper { max-height: 280px; }
  .detail-info { padding: 1.25rem; }
  .detail-title { font-size: 1.4rem; }
  .detail-price { font-size: 1.5rem; }
}
</style>
