const db = require('../config/db');

exports.listarGeneros = async (req, res) => {
  try {
    const [generos] = await db.query(
      'SELECT id, nombre FROM generos ORDER BY nombre'
    );

    res.json(generos);

  } catch (error) {
    console.error("ERROR LISTAR GENEROS:", error);
    res.status(500).json({ message: 'Error al listar géneros' });
  }
};