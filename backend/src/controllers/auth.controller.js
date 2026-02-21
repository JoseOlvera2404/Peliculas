const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const enviarCorreo = require('../services/email.service');

function generarPassword() {
  return Math.random().toString(36).slice(-8);
}


// =============================
// REGISTRO CLIENTE
// =============================
exports.registro = async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, correo } = req.body;

    const [existe] = await db.query(
      'SELECT id FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (existe.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const passwordGenerado = generarPassword();
    const passwordHash = await bcrypt.hash(passwordGenerado, 10);

    await db.query(
      `INSERT INTO usuarios 
      (nombre, apellido_paterno, apellido_materno, correo, password, rol_id) 
      VALUES (?, ?, ?, ?, ?, 2)`,
      [nombre, apellido_paterno, apellido_materno, correo, passwordHash]
    );

    // 🔥 Enviar correo con Resend
    try {
      const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden;">
          
          <div style="background: #111827; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">🎬 Películas App</h1>
          </div>

          <div style="padding: 30px;">
            <h2 style="color: #111827;">¡Bienvenido ${nombre}!</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Tu cuenta ha sido creada exitosamente.
            </p>

            <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Tu contraseña temporal es:</p>
              <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #111827;">
                ${passwordGenerado}
              </p>
            </div>

            <p style="font-size: 14px; color: #6b7280;">
              Te recomendamos cambiarla después de iniciar sesión.
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://api.joseolvera.com"
                style="background: #111827; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
                Iniciar sesión
              </a>
            </div>
          </div>

          <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
            © 2026 Películas App — Todos los derechos reservados
          </div>

        </div>
      </div>
      `;

      await enviarCorreo(
        correo,
        '🎬 Bienvenido a Películas App',
        html
      );

    } catch (errorCorreo) {
      console.error("ERROR CORREO REGISTRO:", errorCorreo);
    }

    res.json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error("ERROR REGISTRO:", error);
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

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

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
    console.error("ERROR LOGIN:", error);
    res.status(500).json({ message: 'Error en el login' });
  }
};


// =============================
// RECUPERAR CONTRASEÑA
// =============================
exports.recuperarPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    const [usuarios] = await db.query(
      'SELECT * FROM usuarios WHERE correo = ? AND activo = TRUE',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    const usuario = usuarios[0];

    const nuevaPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(nuevaPassword, 10);

    await db.query(
      'UPDATE usuarios SET password = ? WHERE id = ?',
      [passwordHash, usuario.id]
    );

    try {
      await enviarCorreo(
        correo,
        'Recuperación de contraseña',
        `Tu nueva contraseña es: ${nuevaPassword}`
      );
    } catch (errorCorreo) {
      console.error("ERROR CORREO RECUPERAR:", errorCorreo);
    }

    res.json({ message: 'Nueva contraseña generada correctamente' });

  } catch (error) {
    console.error("ERROR RECUPERAR:", error);
    res.status(500).json({ message: 'Error al recuperar contraseña' });
  }
};