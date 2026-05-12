<template>
  <main class="about-page">
    <section class="about-hero">
      <h1>Acerca de MercApp</h1>
      <p>Catálogo de productos construido con Vue 3 + Node.js</p>
    </section>

    <div class="about-grid">
      <article class="about-card">
        <h2>Proyecto Académico</h2>
        <p>Desarrollado como Tarea #1 — Unidad 3 de la materia <strong>Aplicaciones Web</strong> en la Universidad Politécnica Salesiana.</p>
      </article>

      <article class="about-card">
        <h2>Estudiante</h2>
        <p><strong>Jefferson Steve Tutillo Acero</strong><br>Ingeniería en Software</p>
      </article>

      <article class="about-card">
        <h2>Tecnologías</h2>
        <ul class="tech-list">
          <li>Vue 3 — Composition API</li>
          <li>Vue Router 4 — SPA Navigation</li>
          <li>Vite — Build Tool</li>
          <li>TypeScript</li>
          <li>Node.js + Express</li>
          <li>MongoDB Atlas</li>
        </ul>
      </article>

      <article class="about-card">
        <h2>Funcionalidades</h2>
        <ul class="tech-list">
          <li>Catálogo con búsqueda y filtros</li>
          <li>Detalle de producto</li>
          <li>CRUD completo de productos</li>
          <li>Carrito con localStorage</li>
          <li>Lazy loading y Suspense</li>
          <li>Diseño responsivo</li>
        </ul>
      </article>
    </div>
  </main>
</template>

<script setup lang="ts">
// Sin lógica necesaria en esta vista estática
</script>

<style scoped>
.about-page { padding: 1.5rem; max-width: 900px; margin: 0 auto; }
.about-hero {
  text-align: center;
  padding: 2.5rem 1rem;
  background: linear-gradient(135deg, #1e1b4b, #6366f1);
  border-radius: 16px;
  color: #fff;
  margin-bottom: 2rem;
}
.about-hero h1 { font-size: 2.2rem; margin: 0 0 0.5rem; }
.about-hero p { margin: 0; opacity: 0.85; font-size: 1.05rem; }
.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}
.about-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,.07);
}
.about-card h2 { margin: 0.5rem 0; font-size: 1.1rem; color: #1e1b4b; }
.about-card p { margin: 0; color: #475569; line-height: 1.6; }
.tech-list { margin: 0; padding-left: 1.2rem; color: #475569; line-height: 2; }
</style>
