# MercApp — Backend

**Estudiante:** Jefferson Steve Tutillo Acero  
**Materia:** Aplicaciones Web  
**Universidad:** Universidad Politécnica Salesiana

## Descripción

API REST del proyecto MercApp desarrollada con Node.js, Express y MongoDB Atlas. Incluye las rutas HTML originales con Handlebars y las nuevas rutas `/api/` que devuelven JSON para el frontend Vue.

## Tecnologías

- Node.js + Express
- MongoDB Atlas + Mongoose
- CORS
- Handlebars (vistas HTML)
- express-session + bcrypt
- Socket.io
- Multer

## Instalación

```bash
npm install
npm run dev
```

Servidor en `http://localhost:3000`

## Variables de entorno

Crear archivo `.env` en esta carpeta:

```
MONGODB_URI=<tu_uri_de_mongodb_atlas>
SESSION_SECRET=<secreto>
PORT=3000
```

## Poblar la base de datos

```bash
npm run seed
```

Inserta 5 categorías y 12 productos de ejemplo.

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista todos los productos |
| GET | `/api/products/:id` | Obtiene un producto |
| POST | `/api/products` | Crea un producto |
| PUT | `/api/products/:id` | Actualiza un producto |
| PATCH | `/api/products/:id` | Actualiza parcialmente |
| DELETE | `/api/products/:id` | Elimina un producto |
| GET | `/api/categories` | Lista todas las categorías |
| POST | `/api/categories` | Crea una categoría |
| DELETE | `/api/categories/:id` | Elimina una categoría |
