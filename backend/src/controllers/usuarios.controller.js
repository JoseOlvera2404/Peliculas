const db = require('../config/db');

// =============================
// LISTAR CLIENTES (ADMIN)
// =============================
exports.listarClientes = async (req, res) => {
  try {
    const [clientes] = await db.query(
      `SELECT id, nombre, apellido_paterno, apellido_materno, correo, fecha_creacion
       FROM usuarios
       WHERE rol_id = 2`
    );

    res.json(clientes);

  } catch (error) {
    console.error("ERROR LISTAR CLIENTES:", error);
    res.status(500).json({ message: 'Error al listar clientes' });
  }
};