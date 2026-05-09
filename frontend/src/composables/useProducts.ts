import { ref } from 'vue'

const API = import.meta.env.VITE_API_URL

export interface Category {
  _id: string
  name: string
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: Category | string | null
  stock: number
}

export interface ProductInput {
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: string
  stock: number
}

export function useProducts() {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API}/api/products`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      products.value = await res.json()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al cargar productos'
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch(`${API}/api/categories`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      categories.value = await res.json()
    } catch {
      // categorías no críticas, fallo silencioso
    }
  }

  async function fetchProduct(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API}/api/products/${id}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al cargar producto'
      return null
    }
  }

  async function createProduct(data: ProductInput): Promise<Product | null> {
    try {
      const res = await fetch(`${API}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.message || `HTTP ${res.status}`)
      }
      return await res.json()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al crear producto'
      return null
    }
  }

  async function updateProduct(id: string, data: Partial<ProductInput>): Promise<Product | null> {
    try {
      const res = await fetch(`${API}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.message || `HTTP ${res.status}`)
      }
      return await res.json()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar producto'
      return null
    }
  }

  async function deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API}/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar producto'
      return false
    }
  }

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
