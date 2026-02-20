require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();

const db = require('./config/db');

db.getConnection()
  .then(() => console.log('Base de datos conectada'))
  .catch(err => console.error('Error BD:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/peliculas', require('./routes/peliculas.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));

const PORT = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});