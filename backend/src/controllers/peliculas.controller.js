const db = require('../config/db');

// =============================
// CREAR PELICULA (ADMIN)
// =============================
exports.crearPelicula = async (req, res) => {
  try {

    const { nombre, genero_id, descripcion, trailer_link, imagen } = req.body;

    if (!nombre || !genero_id) {
      return res.status(400).json({ message: 'Nombre y género son obligatorios' });
    }

    const [result] = await db.query(
      `INSERT INTO peliculas 
      (nombre, genero_id, imagen, descripcion, trailer_link)
      VALUES (?, ?, ?, ?, ?)`,
      [nombre, genero_id, imagen || null, descripcion || null, trailer_link || null]
    );

    res.json({ 
      message: 'Película creada correctamente',
      insertId: result.insertId
    });

  } catch (error) {
    console.error("ERROR CREAR:", error);
    res.status(500).json({ message: 'Error al crear película' });
  }
};


// =============================
// EDITAR PELICULA (ADMIN)
// =============================
exports.editarPelicula = async (req, res) => {
  try {

    const { id } = req.params;
    const { nombre, genero_id, descripcion, trailer_link, imagen } = req.body;

    await db.query(
      `UPDATE peliculas 
       SET nombre = ?, 
           genero_id = ?, 
           descripcion = ?, 
           trailer_link = ?, 
           imagen = IFNULL(?, imagen)
       WHERE id = ?`,
      [
        nombre,
        genero_id,
        descripcion || null,
        trailer_link || null,
        imagen || null,
        id
      ]
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
  try {

    const [peliculas] = await db.query(
      `SELECT p.*, g.nombre AS genero 
       FROM peliculas p
       JOIN generos g ON p.genero_id = g.id`
    );

    res.json(peliculas);

  } catch (error) {
    console.error("ERROR LISTAR TODAS:", error);
    res.status(500).json({ message: 'Error al listar películas' });
  }
};


// =============================
// LISTAR ACTIVAS (PUBLICO)
// =============================
exports.listarActivas = async (req, res) => {
  try {

    const [peliculas] = await db.query(
      `SELECT p.id, p.nombre, p.imagen, p.descripcion, p.trailer_link, g.nombre AS genero
       FROM peliculas p
       JOIN generos g ON p.genero_id = g.id
       WHERE p.activa = TRUE`
    );

    res.json(peliculas);

  } catch (error) {
    console.error("ERROR LISTAR ACTIVAS:", error);
    res.status(500).json({ message: 'Error al listar películas activas' });
  }
};


// =============================
// ACTIVAR / DESACTIVAR
// =============================
exports.cambiarEstado = async (req, res) => {
  try {

    const { id } = req.params;
    const { activa } = req.body;

    await db.query(
      `UPDATE peliculas SET activa = ? WHERE id = ?`,
      [activa, id]
    );

    res.json({ message: 'Estado actualizado' });

  } catch (error) {
    console.error("ERROR CAMBIAR ESTADO:", error);
    res.status(500).json({ message: 'Error al cambiar estado' });
  }
};