<template>
  <main class="form-page">
    <div class="form-card">
      <h1 class="form-title">{{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}</h1>

      <LoadingSpinner v-if="loadingProduct" message="Cargando producto..." />

      <form v-else @submit.prevent="handleSubmit" novalidate>

        <div class="field">
          <label for="name">Nombre <span class="req">*</span></label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Nombre del producto"
            :class="{ invalid: errors.name }"
            @blur="validateField('name')"
          />
          <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
        </div>

        <div class="field">
          <label for="description">Descripción <span class="req">*</span></label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            placeholder="Descripción del producto"
            :class="{ invalid: errors.description }"
            @blur="validateField('description')"
          ></textarea>
          <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="price">Precio <span class="req">*</span></label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              :class="{ invalid: errors.price }"
              @blur="validateField('price')"
            />
            <p v-if="errors.price" class="field-error">{{ errors.price }}</p>
          </div>

          <div class="field">
            <label for="stock">Stock <span class="req">*</span></label>
            <input
              id="stock"
              v-model.number="form.stock"
              type="number"
              min="0"
              placeholder="0"
              :class="{ invalid: errors.stock }"
              @blur="validateField('stock')"
            />
            <p v-if="errors.stock" class="field-error">{{ errors.stock }}</p>
          </div>
        </div>

        <div class="field">
          <label for="categoryId">Categoría <span class="req">*</span></label>
          <select
            id="categoryId"
            v-model="form.categoryId"
            :class="{ invalid: errors.categoryId }"
            @blur="validateField('categoryId')"
          >
            <option value="">Seleccionar categoría</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
              {{ cat.name }}
            </option>
          </select>
          <p v-if="errors.categoryId" class="field-error">{{ errors.categoryId }}</p>
        </div>

        <div class="field">
          <label for="imageUrl">URL de imagen</label>
          <input
            id="imageUrl"
            v-model="form.imageUrl"
            type="url"
            placeholder="https://..."
            :class="{ invalid: errors.imageUrl }"
            @blur="validateField('imageUrl')"
          />
          <p v-if="errors.imageUrl" class="field-error">{{ errors.imageUrl }}</p>
          <img
            v-if="form.imageUrl && !errors.imageUrl"
            :src="form.imageUrl"
            alt="Preview"
            class="img-preview"
            @error="form.imageUrl = ''"
          />
        </div>

        <p v-if="submitError" class="submit-error">{{ submitError }}</p>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="submitting">
            {{ submitting ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Producto') }}
          </button>
          <button type="button" class="btn-cancel" @click="router.back()">Cancelar</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import type { ProductInput } from '@/composables/useProducts'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const { fetchProduct, fetchCategories, createProduct, updateProduct, categories } = useProducts()

const isEdit = computed(() => !!route.params.id && route.name === 'product-edit')
const loadingProduct = ref(false)
const submitting = ref(false)
const submitError = ref<string | null>(null)

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: '',
  imageUrl: ''
})

const errors = reactive({
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  imageUrl: ''
})

function validateField(field: keyof typeof errors) {
  errors[field] = ''
  if (field === 'name' && !form.name.trim()) errors.name = 'El nombre es obligatorio'
  if (field === 'description' && !form.description.trim()) errors.description = 'La descripción es obligatoria'
  if (field === 'price') {
    if (form.price === null || form.price === undefined || String(form.price) === '') errors.price = 'El precio es obligatorio'
    else if (form.price <= 0) errors.price = 'El precio debe ser mayor a 0'
  }
  if (field === 'stock') {
    if (form.stock === null || form.stock === undefined || String(form.stock) === '') errors.stock = 'El stock es obligatorio'
    else if (form.stock < 0) errors.stock = 'El stock debe ser mayor o igual a 0'
  }
  if (field === 'categoryId' && !form.categoryId) errors.categoryId = 'La categoría es obligatoria'
  if (field === 'imageUrl' && form.imageUrl) {
    try { new URL(form.imageUrl) } catch { errors.imageUrl = 'URL inválida' }
  }
}

function validateAll(): boolean {
  const fields = ['name', 'description', 'price', 'stock', 'categoryId', 'imageUrl'] as const
  fields.forEach(f => validateField(f))
  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  if (!validateAll()) return
  submitting.value = true
  submitError.value = null
  try {
    const payload: ProductInput = { ...form }
    let result
    if (isEdit.value) {
      result = await updateProduct(route.params.id as string, payload)
    } else {
      result = await createProduct(payload)
    }
    if (!result) throw new Error('No se pudo guardar el producto')
    router.push(`/product/${result._id}`)
  } catch (err: unknown) {
    submitError.value = err instanceof Error ? err.message : 'Error al guardar'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  if (isEdit.value) {
    loadingProduct.value = true
    const p = await fetchProduct(route.params.id as string)
    if (p) {
      form.name = p.name
      form.description = p.description
      form.price = p.price
      form.stock = p.stock
      form.imageUrl = p.imageUrl
      const cat = p.categoryId
      form.categoryId = cat && typeof cat === 'object' ? cat._id : (cat as string) ?? ''
    }
    loadingProduct.value = false
  }
})
</script>

<style scoped>
.form-page { padding: 1.5rem; max-width: 620px; margin: 0 auto; }
.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,.08);
}
.form-title { margin: 0 0 1.75rem; font-size: 1.5rem; color: #1e1b4b; }

.field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.1rem; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
label { font-size: 0.88rem; font-weight: 600; color: #374151; }
.req { color: #f43f5e; }
input, textarea, select {
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}
input:focus, textarea:focus, select:focus { border-color: #6366f1; }
input.invalid, textarea.invalid, select.invalid { border-color: #f43f5e; }
.field-error { color: #f43f5e; font-size: 0.78rem; margin: 0; }

.img-preview { margin-top: 0.5rem; max-height: 160px; border-radius: 8px; object-fit: cover; }

.submit-error { color: #dc2626; font-size: 0.88rem; margin-bottom: 0.75rem; }
.form-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
.btn-submit {
  flex: 1; padding: 0.7rem; background: #6366f1; color: #fff;
  border: none; border-radius: 10px; font-size: 1rem; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.btn-submit:hover:not(:disabled) { background: #4f46e5; }
.btn-submit:disabled { background: #94a3b8; cursor: not-allowed; }
.btn-cancel {
  padding: 0.7rem 1.25rem; background: #f1f5f9; color: #475569;
  border: none; border-radius: 10px; font-size: 1rem; cursor: pointer;
}
.btn-cancel:hover { background: #e2e8f0; }
</style>
