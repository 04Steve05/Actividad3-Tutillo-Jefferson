import { ref, computed, watch } from 'vue'
import type { Product } from '@/composables/useProducts'

export interface CartItem {
  product: Product
  quantity: number
}

const STORAGE_KEY = 'mercapp_cart'

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Estado global del carrito (singleton)
const items = ref<CartItem[]>(loadFromStorage())

// Persiste en localStorage cada vez que cambia
watch(items, (newItems) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
}, { deep: true })

export function useCart() {
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )

  // Retorna true si se agregó, false si ya se alcanzó el stock máximo
  function addToCart(product: Product): boolean {
    const existing = items.value.find(i => i.product._id === product._id)
    if (existing) {
      if (existing.quantity >= product.stock) return false
      existing.quantity++
    } else {
      if (product.stock === 0) return false
      items.value.push({ product, quantity: 1 })
    }
    return true
  }

  function removeFromCart(productId: string) {
    items.value = items.value.filter(i => i.product._id !== productId)
  }

  function decreaseQuantity(productId: string) {
    const item = items.value.find(i => i.product._id === productId)
    if (!item) return
    if (item.quantity <= 1) {
      removeFromCart(productId)
    } else {
      item.quantity--
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    clearCart
  }
}
