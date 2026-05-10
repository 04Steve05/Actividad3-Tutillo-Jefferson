<template>
  <li class="cart-item">
    <img
      :src="item.product.imageUrl || 'https://placehold.co/80x80?text=?'"
      :alt="item.product.name"
      class="item-img"
    />
    <div class="item-info">
      <p class="item-name">{{ item.product.name }}</p>
      <p class="item-unit">${{ item.product.price.toFixed(2) }} p.u.</p>
      <p :class="['item-stock', item.product.stock - item.quantity === 0 ? 'item-stock--agotado' : '']">
        {{ item.product.stock - item.quantity }} disponibles restantes
      </p>
    </div>
    <div class="item-controls">
      <button class="qty-btn" @click="emit('decrease', item.product._id)">−</button>
      <span class="qty-val">{{ item.quantity }}</span>
      <button
        class="qty-btn"
        :disabled="item.quantity >= item.product.stock"
        :title="item.quantity >= item.product.stock ? 'Stock máximo alcanzado' : ''"
        @click="emit('increase', item.product)"
      >+</button>
    </div>
    <p class="item-subtotal">${{ (item.product.price * item.quantity).toFixed(2) }}</p>
    <button class="remove-btn" @click="emit('remove', item.product._id)">✕</button>
  </li>
</template>

<script setup lang="ts">
import type { CartItem } from '@/stores/cart'
import type { Product } from '@/composables/useProducts'

defineProps<{ item: CartItem }>()
const emit = defineEmits<{
  (e: 'increase', product: Product): void
  (e: 'decrease', productId: string): void
  (e: 'remove', productId: string): void
}>()
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,.07);
}
.item-img { width: 72px; height: 72px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
.item-info { flex: 1; min-width: 0; }
.item-name { margin: 0; font-weight: 600; font-size: 0.95rem; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-unit { margin: 0.2rem 0 0; font-size: 0.8rem; color: #64748b; }
.item-stock { margin: 0.15rem 0 0; font-size: 0.78rem; color: #16a34a; }
.item-stock--agotado { color: #dc2626; }
.item-controls { display: flex; align-items: center; gap: 0.5rem; }
.qty-btn {
  width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e2e8f0;
  background: #f8fafc; cursor: pointer; font-size: 1rem; line-height: 1;
  display: flex; align-items: center; justify-content: center;
}
.qty-btn:hover { background: #e2e8f0; }
.qty-val { font-weight: 700; min-width: 20px; text-align: center; }
.item-subtotal { font-weight: 700; font-size: 0.95rem; min-width: 60px; text-align: right; }
.remove-btn {
  background: none; border: none; cursor: pointer; color: #94a3b8;
  font-size: 1rem; padding: 0.2rem 0.4rem; border-radius: 4px;
}
.remove-btn:hover { color: #f43f5e; background: #fff1f2; }

@media (max-width: 500px) {
  .cart-item { flex-wrap: wrap; }
  .item-img { width: 56px; height: 56px; }
}
</style>
