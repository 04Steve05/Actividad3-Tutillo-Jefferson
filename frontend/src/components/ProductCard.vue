<template>
  <article class="product-card">
    <router-link :to="`/product/${product._id}`" class="card-img-link">
      <img
        :src="product.imageUrl || '/placeholder.svg'"
        :alt="product.name"
        class="card-img"
        @error="onImgError"
      />
    </router-link>

    <div class="card-body">
      <p v-if="product.categoryId && typeof product.categoryId === 'object'" class="card-category">{{ (product.categoryId as { name: string }).name }}</p>
      <h3 class="card-title">
        <router-link :to="`/product/${product._id}`">{{ product.name }}</router-link>
      </h3>
      <p class="card-desc">{{ product.description }}</p>

      <div class="card-footer">
        <span class="card-price">${{ product.price.toFixed(2) }}</span>
        <span :class="['card-stock', product.stock === 0 ? 'out' : '']">
          {{ product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock' }}
        </span>
      </div>

      <button
        class="btn-add"
        :disabled="product.stock === 0"
        @click="emit('added-to-cart', product)"
      >
        {{ product.stock > 0 ? 'Añadir al carrito' : 'Sin stock' }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '@/composables/useProducts'

defineProps<{ product: Product }>()
const emit = defineEmits<{ (e: 'added-to-cart', product: Product): void }>()

function onImgError(e: Event) {
  (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Sin+imagen'
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  transition: transform 0.2s, box-shadow 0.2s;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
}
.card-img-link { display: block; overflow: hidden; height: 200px; }
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.card-img-link:hover .card-img { transform: scale(1.05); }
.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  flex: 1;
}
.card-category {
  font-size: 0.72rem;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: .8px;
  margin: 0;
}
.card-title { margin: 0; font-size: 1rem; font-weight: 700; }
.card-title a { text-decoration: none; color: #1e293b; }
.card-title a:hover { color: #6366f1; }
.card-desc {
  margin: 0;
  font-size: 0.84rem;
  color: #64748b;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
.card-price { font-size: 1.15rem; font-weight: 700; color: #1e293b; }
.card-stock { font-size: 0.78rem; color: #16a34a; }
.card-stock.out { color: #dc2626; }
.btn-add {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.55rem;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-add:hover:not(:disabled) { background: #4f46e5; }
.btn-add:disabled { background: #94a3b8; cursor: not-allowed; }
</style>
