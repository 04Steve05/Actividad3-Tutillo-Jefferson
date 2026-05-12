# MercApp — Frontend

**Estudiante:** Jefferson Steve Tutillo Acero  
**Materia:** Aplicaciones Web  
**Universidad:** Universidad Politécnica Salesiana

## Descripción

Frontend de MercApp desarrollado con Vue 3, TypeScript y Vite. SPA que consume la API REST del backend para mostrar y gestionar un catálogo de productos.

## Tecnologías

- Vue 3 (Composition API con `<script setup>`)
- TypeScript
- Vite
- Vue Router 4

## Instalación

```bash
npm install
npm run dev
```

App disponible en `http://localhost:5173`

## Variables de entorno

Crear archivo `.env` en esta carpeta:

```
VITE_API_URL=http://localhost:3000
```

## Rutas

| Ruta | Vista |
|------|-------|
| `/` | Catálogo con búsqueda y filtros |
| `/product/:id` | Detalle de producto |
| `/product/new` | Crear producto |
| `/product/:id/edit` | Editar producto |
| `/cart` | Carrito de compras |
| `/categories` | Gestión de categorías |
| `/about` | Acerca de |
| `/*` | Página 404 |
