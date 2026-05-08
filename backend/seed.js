require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  { name: 'Electrónica' },
  { name: 'Ropa' },
  { name: 'Calzado' },
  { name: 'Hogar' },
  { name: 'Deportes' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB Atlas');

    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Colecciones limpiadas');

    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categorías insertadas`);

    const [electronica, ropa, calzado, hogar, deportes] = createdCategories;

    const products = [
      {
        name: 'Auriculares Bluetooth Pro',
        description: 'Auriculares inalámbricos con cancelación de ruido activa y 30h de batería.',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        categoryId: electronica._id,
        stock: 25
      },
      {
        name: 'Laptop UltraSlim 15"',
        description: 'Laptop ligera con procesador Intel Core i7, 16GB RAM y SSD 512GB.',
        price: 1299.00,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        categoryId: electronica._id,
        stock: 10
      },
      {
        name: 'Smartwatch Fitness',
        description: 'Reloj inteligente con monitor de frecuencia cardíaca, GPS y resistencia al agua.',
        price: 149.99,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        categoryId: electronica._id,
        stock: 40
      },
      {
        name: 'Camiseta Casual Premium',
        description: 'Camiseta de algodón 100% orgánico con corte moderno. Disponible en varios colores.',
        price: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        categoryId: ropa._id,
        stock: 100
      },
      {
        name: 'Chaqueta Denim Vintage',
        description: 'Chaqueta de mezclilla con acabado vintage y bolsillos frontales. Tallas S-XXL.',
        price: 59.99,
        imageUrl: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400',
        categoryId: ropa._id,
        stock: 35
      },
      {
        name: 'Zapatillas Running Air',
        description: 'Zapatillas con tecnología de amortiguación de aire para corredores de larga distancia.',
        price: 119.99,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        categoryId: calzado._id,
        stock: 60
      },
      {
        name: 'Botas de Cuero Clásicas',
        description: 'Botas de cuero genuino con suela de goma antideslizante. Estilo atemporal.',
        price: 189.99,
        imageUrl: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=400',
        categoryId: calzado._id,
        stock: 20
      },
      {
        name: 'Lámpara de Escritorio LED',
        description: 'Lámpara LED de 3 niveles de brillo con puerto USB de carga y brazo flexible.',
        price: 34.99,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        categoryId: hogar._id,
        stock: 50
      },
      {
        name: 'Set de Sartenes Antiadherentes',
        description: 'Set de 3 sartenes de aluminio con recubrimiento antiadherente libre de PFOA.',
        price: 69.99,
        imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
        categoryId: hogar._id,
        stock: 30
      },
      {
        name: 'Mochila Deportiva 40L',
        description: 'Mochila resistente al agua con compartimento para laptop y sistema de ventilación dorsal.',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        categoryId: deportes._id,
        stock: 45
      },
      {
        name: 'Pelota de Fútbol Pro',
        description: 'Pelota oficial de cuero sintético cosida a mano. Ideal para entrenamiento y partidos.',
        price: 44.99,
        imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400',
        categoryId: deportes._id,
        stock: 80
      },
      {
        name: 'Colchoneta Yoga Premium',
        description: 'Colchoneta antideslizante de 6mm de grosor con alineadores de postura impresos.',
        price: 29.99,
        imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_970447-MEC92285716440_092025-F.webp',
        categoryId: deportes._id,
        stock: 55
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} productos insertados`);
    console.log('\n✅ Seed completado exitosamente');
  } catch (err) {
    console.error('Error en seed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
