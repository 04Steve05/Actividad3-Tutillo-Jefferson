const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

// GET /api/products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId', 'name').lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos', error: err.message });
  }
});

// GET /api/products/:id
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name').lean();
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener producto', error: err.message });
  }
});

// POST /api/products
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, imageUrl, categoryId, stock } = req.body;
    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: 'name, description y price son obligatorios' });
    }
    if (Number(price) <= 0) {
      return res.status(400).json({ message: 'El precio debe ser mayor a 0' });
    }
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({ message: 'El stock no puede ser negativo' });
    }
    const product = await Product.create({ name, description, price, imageUrl, categoryId, stock });
    const populated = await product.populate('categoryId', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear producto', error: err.message });
  }
});

// PUT /api/products/:id
router.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price, imageUrl, categoryId, stock } = req.body;
    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: 'name, description y price son obligatorios' });
    }
    if (Number(price) <= 0) {
      return res.status(400).json({ message: 'El precio debe ser mayor a 0' });
    }
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({ message: 'El stock no puede ser negativo' });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, imageUrl, categoryId, stock },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name');
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar producto', error: err.message });
  }
});

// PATCH /api/products/:id
router.patch('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name');
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar producto', error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto', error: err.message });
  }
});

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

// GET /api/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías', error: err.message });
  }
});

// POST /api/categories
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'El nombre es obligatorio' });
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'La categoría ya existe' });
    }
    res.status(500).json({ message: 'Error al crear categoría', error: err.message });
  }
});

// DELETE /api/categories/:id
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar categoría', error: err.message });
  }
});

module.exports = router;
