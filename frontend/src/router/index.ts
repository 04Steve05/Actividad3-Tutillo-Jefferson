import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import HomeView from '@/views/HomeView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ProductFormView from '@/views/ProductFormView.vue'

// Lazy loading con defineAsyncComponent
const CartView = defineAsyncComponent(() => import('@/views/CartView.vue'))
const AboutView = defineAsyncComponent(() => import('@/views/AboutView.vue'))
const CategoryView = defineAsyncComponent(() => import('@/views/CategoryView.vue'))
const NotFoundView = defineAsyncComponent(() => import('@/views/NotFoundView.vue'))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/product/new',
      name: 'product-new',
      component: ProductFormView
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetailView
    },
    {
      path: '/product/:id/edit',
      name: 'product-edit',
      component: ProductFormView
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoryView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

export default router
