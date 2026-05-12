# MercApp — Catálogo de Productos SPA

**Universidad Politécnica Salesiana**  
**Estudiante:** Jefferson Steve Tutillo Acero

---

## Descripción

MercApp es una aplicación web de tipo SPA (Single Page Application) que permite navegar, buscar y gestionar un catálogo de productos. Está compuesta por un backend REST (Node.js + Express + MongoDB) y un frontend interactivo (Vue 3 + Vite + TypeScript).

---

## Funcionalidades

- **Catálogo:** lista de productos con búsqueda en tiempo real por nombre/descripción y filtro por categoría
- **Detalle de producto:** vista individual con imagen, descripción completa y stock
- **CRUD de productos:** formulario para crear y editar productos con validación
- **Carrito de compras:** agregar, quitar y modificar cantidades; total calculado con `computed()`; persistencia en `localStorage`
- **Lazy loading:** CartView y AboutView cargados con `defineAsyncComponent` + `<Suspense>`
- **API REST:** endpoints JSON en `/api/products` y `/api/categories` con manejo de errores HTTP
- **Diseño responsivo:** mobile-first con CSS Grid y Flexbox


## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue 3 (Composition API), TypeScript, Vite |
| Routing | Vue Router 4 |
| Backend | Node.js, Express |
| Base de datos | MongoDB Atlas (Mongoose) |
| Vistas HTML | Handlebars (existente, sin modificar) |
| Auth | express-session + bcrypt |
| Real-time | Socket.io |

---

## Instrucciones de Uso

### 1. Configurar variables de entorno del backend

Crear `backend/.env`:
```
MONGODB_URI=
SESSION_SECRET=
PORT=3000
```

### 2. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Iniciar el backend

```bash
cd backend
npm run dev 
```
Servidor en `http://localhost:3000`

### 5. Iniciar el frontend

```bash
cd frontend
npm run dev
```
App en `http://localhost:5173`

---

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista todos los productos |
| GET | `/api/products/:id` | Obtiene un producto |
| POST | `/api/products` | Crea un producto |
| PUT | `/api/products/:id` | Actualiza un producto (completo) |
| PATCH | `/api/products/:id` | Actualiza un producto (parcial) |
| DELETE | `/api/products/:id` | Elimina un producto |
| GET | `/api/categories` | Lista todas las categorías |
| POST | `/api/categories` | Crea una categoría |

---

## Rutas del Frontend

| Ruta | Vista |
|------|-------|
| `/` | Catálogo con búsqueda y filtros |
| `/product/:id` | Detalle de producto |
| `/product/new` | Formulario crear producto |
| `/product/:id/edit` | Formulario editar producto |
| `/cart` | Carrito de compras |
| `/about` | Acerca de la aplicación |
| `/*` | Página 404 |
