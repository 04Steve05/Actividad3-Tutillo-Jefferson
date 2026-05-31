const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const { engine } = require('express-handlebars');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

// Motor de vistas Handlebars
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    rutaImagen: (imagen) => (imagen && imagen !== 'default.jpg') ? `/uploads/${imagen}` : '/img/default.svg'
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Seguridad: cabeceras HTTP
app.use(helmet());

// Rate limiting: máx 100 peticiones por 15 min por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta más tarde' }
});
app.use('/api', limiter);

// CORS dinámico con variables de entorno
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.NETLIFY_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Rutas HTML existentes (Handlebars) — sin modificar
const productosRouter = require('./routes/productos');
const authRouter = require('./routes/auth');

app.use('/productos', productosRouter);
app.use('/', authRouter);

// Rutas API REST — devuelven JSON para el frontend Vue
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    environment: process.env.NODE_ENV,
    version: process.env.API_VERSION || 'v1'
  });
});

app.get('/', (req, res) => {
  res.redirect('/productos');
});

// Socket.io
io.on('connection', socket => {
  console.log('Usuario conectado:', socket.id);
  socket.on('chatMensaje', msg => {
    io.emit('chatMensaje', msg);
  });
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = { app, io };
