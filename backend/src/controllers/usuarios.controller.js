const db = require('../config/db');

// =============================
// LISTAR CLIENTES (ADMIN)
// =============================
exports.listarClientes = async (req, res) => {
  try {
    const [clientes] = await db.query(`
      SELECT id, nombre, apellido_paterno, apellido_materno,
             correo, activo, fecha_creacion
      FROM usuarios
      WHERE rol_id = 2
      ORDER BY id DESC
    `);

    res.json(clientes);

  } catch (error) {
    console.error("ERROR LISTAR CLIENTES:", error);
    res.status(500).json({ message: 'Error al listar clientes' });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.query(`
      SELECT u.id, u.nombre, u.apellido_paterno, u.apellido_materno,
             u.correo, u.rol_id, u.activo, u.fecha_creacion,
             r.nombre AS rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id DESC
    `);

    res.json(usuarios);
  } catch (error) {
    console.error("ERROR LISTAR USUARIOS:", error);
    res.status(500).json({ message: "Error al listar usuarios" });
  }
};

exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`
      UPDATE usuarios
      SET activo = NOT activo
      WHERE id = ?
    `, [id]);

    res.json({ message: "Estado actualizado correctamente" });

  } catch (error) {
    console.error("ERROR CAMBIAR ESTADO:", error);
    res.status(500).json({ message: "Error al cambiar estado" });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM usuarios WHERE id = ?`, [id]);

    res.json({ message: "Usuario eliminado correctamente" });

  } catch (error) {
    console.error("ERROR ELIMINAR:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};