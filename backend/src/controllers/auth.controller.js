const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const enviarCorreo = require('../services/email.service');

function generarPassword() {
  return Math.random().toString(36).slice(-8);
}


// =============================
// REGISTRO USUARIO (SOLO ADMIN)
// =============================
exports.registro = async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, correo, rol_id } = req.body;

    // Validar rol permitido (1 = ADMIN, 2 = CLIENTE)
    if (![1, 2].includes(Number(rol_id))) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

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
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, correo, passwordHash, rol_id]
    );

    // 🔥 Enviar correo profesional
    try {

      const rolTexto = rol_id == 1 ? "Administrador" : "Cliente";

      const html = `
      <div style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 20px;">
              
              <table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background:#111827;padding:25px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:24px;">
                      🎬 Películas App
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:35px;">
                    <h2 style="color:#111827;margin-top:0;">
                      Hola ${nombre},
                    </h2>

                    <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                      Tu cuenta fue creada exitosamente con el rol de:
                      <strong style="color:#111827;">${rolTexto}</strong>
                    </p>

                    <div style="margin:25px 0;padding:20px;background:#f3f4f6;border-radius:8px;text-align:center;">
                      <p style="margin:0;font-size:14px;color:#6b7280;">
                        Tu contraseña temporal es:
                      </p>
                      <p style="margin:10px 0 0;font-size:20px;font-weight:bold;color:#111827;">
                        ${passwordGenerado}
                      </p>
                    </div>

                    <p style="font-size:14px;color:#6b7280;">
                      Por seguridad, cambia tu contraseña después de iniciar sesión.
                    </p>

                    <div style="text-align:center;margin-top:30px;">
                      <a href="https://api.joseolvera.com"
                         style="display:inline-block;background:#111827;color:#ffffff;
                                padding:12px 25px;border-radius:6px;
                                text-decoration:none;font-size:15px;">
                        Iniciar sesión
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f9fafb;padding:20px;text-align:center;
                             font-size:12px;color:#9ca3af;">
                    © 2026 Películas App — Sistema Administrativo<br/>
                    Este es un mensaje automático, no respondas a este correo.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </div>
      `;

      await enviarCorreo(
        correo,
        '🎬 Tu cuenta fue creada - Películas App',
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
// LOGIN SOLO ADMIN (WEB)
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

    // 🚨 BLOQUEAR SI NO ES ADMIN
    if (usuario.rol_id !== 1) {
      return res.status(403).json({
        message: 'Acceso permitido solo para administradores'
      });
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

      const html = `
      <div style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 20px;">
              
              <table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,0.08);">
                
                <tr>
                  <td style="background:#111827;padding:25px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:24px;">
                      🎬 Películas App
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:35px;">
                    <h2 style="color:#111827;margin-top:0;">
                      Recuperación de contraseña
                    </h2>

                    <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                      Hola <strong>${usuario.nombre}</strong>,
                      hemos generado una nueva contraseña temporal para tu cuenta.
                    </p>

                    <div style="margin:25px 0;padding:20px;background:#f3f4f6;border-radius:8px;text-align:center;">
                      <p style="margin:0;font-size:14px;color:#6b7280;">
                        Tu nueva contraseña es:
                      </p>
                      <p style="margin:10px 0 0;font-size:20px;font-weight:bold;color:#111827;">
                        ${nuevaPassword}
                      </p>
                    </div>

                    <p style="font-size:14px;color:#6b7280;">
                      Por seguridad, cambia tu contraseña después de iniciar sesión.
                    </p>

                    <div style="text-align:center;margin-top:30px;">
                      <a href="https://api.joseolvera.com"
                         style="display:inline-block;background:#111827;color:#ffffff;
                                padding:12px 25px;border-radius:6px;
                                text-decoration:none;font-size:15px;">
                        Iniciar sesión
                      </a>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="background:#f9fafb;padding:20px;text-align:center;
                             font-size:12px;color:#9ca3af;">
                    © 2026 Películas App — Sistema Administrativo<br/>
                    Este es un mensaje automático, no respondas a este correo.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </div>
      `;

      await enviarCorreo(
        correo,
        '🔐 Recuperación de contraseña - Películas App',
        html
      );

    } catch (errorCorreo) {
      console.error("ERROR CORREO RECUPERAR:", errorCorreo);
    }

    res.json({ message: 'Nueva contraseña enviada correctamente' });

  } catch (error) {
    console.error("ERROR RECUPERAR:", error);
    res.status(500).json({ message: 'Error al recuperar contraseña' });
  }
};