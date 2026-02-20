const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../services/email.service');


// 🔹 Función para generar contraseña aleatoria
function generarPassword() {
  return Math.random().toString(36).slice(-8);
}


// =============================
// REGISTRO CLIENTE
// =============================
exports.registro = async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, correo } = req.body;

    // Verificar si ya existe
    const [existe] = await db.query(
      'SELECT id FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (existe.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Generar contraseña automática
    const passwordGenerado = generarPassword();
    const passwordHash = await bcrypt.hash(passwordGenerado, 10);

    // Insertar usuario como CLIENTE (rol_id = 2)
    await db.query(
      `INSERT INTO usuarios 
      (nombre, apellido_paterno, apellido_materno, correo, password, rol_id) 
      VALUES (?, ?, ?, ?, ?, 2)`,
      [nombre, apellido_paterno, apellido_materno, correo, passwordHash]
    );

    // Enviar correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Tu cuenta fue creada',
      text: `Tu contraseña es: ${passwordGenerado}`
    });

    res.json({ message: 'Usuario registrado y contraseña enviada al correo' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el registro' });
  }
};



// =============================
// LOGIN
// =============================
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const [usuarios] = await db.query(
      'SELECT * FROM usuarios WHERE correo = ? AND activo = TRUE',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const usuario = usuarios[0];

    // Comparar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login correcto',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol_id
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el login' });
  }
};

// =============================
// RECUPERAR CONTRASEÑA
// =============================
exports.recuperarPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    // Buscar usuario
    const [usuarios] = await db.query(
      'SELECT * FROM usuarios WHERE correo = ? AND activo = TRUE',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    const usuario = usuarios[0];

    // Generar nueva contraseña
    const nuevaPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(nuevaPassword, 10);

    // Actualizar en BD
    await db.query(
      'UPDATE usuarios SET password = ? WHERE id = ?',
      [passwordHash, usuario.id]
    );

    // Enviar correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Recuperación de contraseña',
      text: `Tu nueva contraseña es: ${nuevaPassword}`
    });

    res.json({ message: 'Nueva contraseña enviada al correo' });

  } catch (error) {
    console.error("ERROR RECUPERAR:", error);
    res.status(500).json({ message: 'Error al recuperar contraseña' });
  }
};