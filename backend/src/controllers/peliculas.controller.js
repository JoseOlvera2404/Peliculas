const db = require('../config/db');


// =============================
// CREAR PELICULA (ADMIN)
// =============================
exports.crearPelicula = async (req, res) => {
  try {

    const { nombre, genero_id, descripcion, trailer_link } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const [result] = await db.query(
      `INSERT INTO peliculas 
      (nombre, genero_id, imagen, descripcion, trailer_link)
      VALUES (?, ?, ?, ?, ?)`,
      [nombre, genero_id, imagen, descripcion, trailer_link]
    );

    res.json({ 
      message: 'Película creada correctamente',
      insertId: result.insertId
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: 'Error al crear película' });
  }
};

// =============================
// EDITAR PELICULA (ADMIN)
// =============================
exports.editarPelicula = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, genero_id, descripcion, trailer_link } = req.body;

    const imagen = req.file ? req.file.filename : null;

    await db.query(
      `UPDATE peliculas 
       SET nombre = ?, genero_id = ?, descripcion = ?, trailer_link = ?, 
       imagen = IFNULL(?, imagen)
       WHERE id = ?`,
      [nombre, genero_id, descripcion, trailer_link, imagen, id]
    );

    res.json({ message: 'Película actualizada correctamente' });

  } catch (error) {
    console.error("ERROR EDITAR:", error);
    res.status(500).json({ message: 'Error al editar película' });
  }
};

// =============================
// ELIMINAR PELICULA (ADMIN)
// =============================
exports.eliminarPelicula = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'DELETE FROM peliculas WHERE id = ?',
      [id]
    );

    res.json({ message: 'Película eliminada correctamente' });

  } catch (error) {
    console.error("ERROR ELIMINAR:", error);
    res.status(500).json({ message: 'Error al eliminar película' });
  }
};

// =============================
// LISTAR TODAS (ADMIN)
// =============================
exports.listarTodas = async (req, res) => {
  const [peliculas] = await db.query(
    `SELECT p.*, g.nombre AS genero 
     FROM peliculas p
     JOIN generos g ON p.genero_id = g.id`
  );

  res.json(peliculas);
};


// =============================
// LISTAR ACTIVAS (PUBLICO)
// =============================
exports.listarActivas = async (req, res) => {
  const [peliculas] = await db.query(
    `SELECT p.id, p.nombre, p.imagen, p.descripcion, p.trailer_link, g.nombre AS genero
     FROM peliculas p
     JOIN generos g ON p.genero_id = g.id
     WHERE p.activa = TRUE`
  );

  res.json(peliculas);
};


// =============================
// ACTIVAR / DESACTIVAR
// =============================
exports.cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { activa } = req.body;

  await db.query(
    `UPDATE peliculas SET activa = ? WHERE id = ?`,
    [activa, id]
  );

  res.json({ message: 'Estado actualizado' });
};