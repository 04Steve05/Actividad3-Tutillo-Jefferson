<template>
  <header class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="brand-link">MercApp</router-link>
    </div>

    <nav class="navbar-nav">
      <router-link to="/" class="nav-link" active-class="nav-link--active" exact>Catálogo</router-link>
      <router-link to="/categories" class="nav-link" active-class="nav-link--active">Categorías</router-link>
      <router-link to="/about" class="nav-link" active-class="nav-link--active">Acerca de</router-link>
      <router-link to="/product/new" class="nav-link nav-link--new">+ Nuevo</router-link>
    </nav>

    <router-link to="/cart" class="cart-btn">
      <span class="cart-icon">🛒</span>
      <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
    </router-link>
  </header>
</template>

<script setup lang="ts">
import { useCart } from '@/stores/cart'

const { totalItems } = useCart()
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1.5rem;
  height: 60px;
  background: #1e1b4b;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
}
.brand-link {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  letter-spacing: .5px;
}
.navbar-nav {
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
}
.nav-link {
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  color: #c7d2fe;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s;
}
.nav-link:hover,
.nav-link--active { background: rgba(255,255,255,.1); color: #fff; }
.nav-link--new { background: #6366f1; color: #fff; }
.nav-link--new:hover { background: #4f46e5; }
.cart-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  text-decoration: none;
  padding: 0.25rem;
  margin-left: 0.5rem;
}
.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: #f43f5e;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 600px) {
  .navbar { padding: 0 1rem; gap: 0.75rem; }
  .nav-link { padding: 0.3rem 0.6rem; font-size: 0.8rem; }
  .brand-link { font-size: 1.1rem; }
}
</style>
