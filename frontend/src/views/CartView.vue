<template>
  <main class="cart-page">
    <h1 class="cart-title">Carrito de Compras</h1>

    <div v-if="items.length === 0" class="empty-cart">
      <p>Tu carrito está vacío</p>
      <router-link to="/" class="btn-go-shop">Ver catálogo</router-link>
    </div>

    <div v-else class="cart-layout">
      <ul class="cart-list">
        <CartItem
          v-for="item in items"
          :key="item.product._id"
          :item="item"
          @increase="addToCart"
          @decrease="decreaseQuantity"
          @remove="removeFromCart"
        />
      </ul>

      <aside class="cart-summary">
        <h2>Resumen</h2>
        <div class="summary-row">
          <span>Productos ({{ totalItems }})</span>
          <span>${{ totalPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-row summary-total">
          <span>Total</span>
          <span>${{ totalPrice.toFixed(2) }}</span>
        </div>
        <button class="btn-checkout">Proceder al pago</button>
        <button class="btn-clear" @click="clearCart">Vaciar carrito</button>
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useCart } from '@/stores/cart'
import CartItem from '@/components/CartItem.vue'

const { items, totalItems, totalPrice, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCart()
</script>

<style scoped>
.cart-page { padding: 1.5rem; max-width: 900px; margin: 0 auto; }
.cart-title { font-size: 1.75rem; color: #1e1b4b; margin-bottom: 1.5rem; }
.empty-cart { text-align: center; padding: 4rem; color: #64748b; }
.empty-cart p { font-size: 1.1rem; margin-bottom: 1rem; }
.btn-go-shop {
  display: inline-block; padding: 0.65rem 1.5rem;
  background: #6366f1; color: #fff; border-radius: 10px; text-decoration: none; font-weight: 600;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  align-items: start;
}
.cart-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }

.cart-summary {
  background: #fff;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: sticky;
  top: 80px;
}
.cart-summary h2 { margin: 0; font-size: 1.1rem; color: #1e1b4b; }
.summary-row { display: flex; justify-content: space-between; font-size: 0.95rem; color: #475569; }
.summary-total { font-weight: 700; font-size: 1.05rem; color: #1e293b; padding-top: 0.75rem; border-top: 1px solid #e2e8f0; }
.btn-checkout {
  padding: 0.75rem; background: #6366f1; color: #fff;
  border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer;
}
.btn-checkout:hover { background: #4f46e5; }
.btn-clear {
  padding: 0.55rem; background: none; color: #94a3b8;
  border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; cursor: pointer;
}
.btn-clear:hover { color: #f43f5e; border-color: #fecdd3; }

@media (max-width: 680px) {
  .cart-layout { grid-template-columns: 1fr; }
  .cart-summary { position: static; }
}
</style>
