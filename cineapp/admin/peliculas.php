<?php
require_once '../includes/auth.php';
require_once '../includes/functions.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['accion'])) {
        switch($_POST['accion']) {
            case 'agregar':
                $nombre = $_POST['nombre'];
                $genero_id = $_POST['genero_id'];
                $descripcion = $_POST['descripcion'];
                $trailer_link = $_POST['trailer_link'];
                
                $imagen = null;
                if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
                    $imagen = subirImagen($_FILES['imagen']);
                }
                
                $stmt = $pdo->prepare("INSERT INTO peliculas (nombre, genero_id, imagen, descripcion, trailer_link) 
                                       VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$nombre, $genero_id, $imagen, $descripcion, $trailer_link]);
                break;
                
            case 'toggle':
                $id = $_POST['id'];
                $activo = $_POST['activo'];
                $stmt = $pdo->prepare("UPDATE peliculas SET activa = ? WHERE id = ?");
                $stmt->execute([$activo, $id]);
                break;
        }
        header('Location: peliculas.php');
        exit();
    }
}

$peliculas = getPeliculas();
$generos = getGeneros();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Películas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="index.php">Panel Admin</a>
            <div class="navbar-nav">
                <a class="nav-link" href="peliculas.php">Películas</a>
                <a class="nav-link" href="clientes.php">Clientes</a>
                <a class="nav-link" href="../logout.php">Cerrar Sesión</a>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <h2>Gestión de Películas</h2>
        
        <!-- Botón para agregar película -->
        <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#agregarModal">
            Agregar Película
        </button>
        
        <!-- Tabla de películas -->
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Género</th>
                        <th>Imagen</th>
                        <th>Descripción</th>
                        <th>Trailer</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($peliculas as $pelicula): ?>
                    <tr>
                        <td><?php echo $pelicula['id']; ?></td>
                        <td><?php echo htmlspecialchars($pelicula['nombre']); ?></td>
                        <td><?php echo htmlspecialchars($pelicula['genero_nombre']); ?></td>
                        <td>
                            <?php if ($pelicula['imagen']): ?>
                                <img src="../<?php echo $pelicula['imagen']; ?>" width="50" height="50" style="object-fit: cover;">
                            <?php else: ?>
                                <span class="text-muted">Sin imagen</span>
                            <?php endif; ?>
                        </td>
                        <td><?php echo substr(htmlspecialchars($pelicula['descripcion']), 0, 50); ?>...</td>
                        <td>
                            <?php if ($pelicula['trailer_link']): ?>
                                <a href="<?php echo htmlspecialchars($pelicula['trailer_link']); ?>" target="_blank" class="btn btn-sm btn-info">Ver</a>
                            <?php endif; ?>
                        </td>
                        <td>
                            <span class="badge <?php echo $pelicula['activa'] ? 'bg-success' : 'bg-danger'; ?>">
                                <?php echo $pelicula['activa'] ? 'Activa' : 'Inactiva'; ?>
                            </span>
                        </td>
                        <td>
                            <form method="POST" style="display: inline;">
                                <input type="hidden" name="accion" value="toggle">
                                <input type="hidden" name="id" value="<?php echo $pelicula['id']; ?>">
                                <input type="hidden" name="activo" value="<?php echo $pelicula['activa'] ? 0 : 1; ?>">
                                <button type="submit" class="btn btn-sm <?php echo $pelicula['activa'] ? 'btn-warning' : 'btn-success'; ?>">
                                    <?php echo $pelicula['activa'] ? 'Deshabilitar' : 'Habilitar'; ?>
                                </button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    
    <!-- Modal Agregar Película -->
    <div class="modal fade" id="agregarModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Agregar Película</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form method="POST" enctype="multipart/form-data">
                    <div class="modal-body">
                        <input type="hidden" name="accion" value="agregar">
                        
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombre" name="nombre" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="genero_id" class="form-label">Género</label>
                            <select class="form-control" id="genero_id" name="genero_id" required>
                                <option value="">Seleccione...</option>
                                <?php foreach ($generos as $genero): ?>
                                    <option value="<?php echo $genero['id']; ?>">
                                        <?php echo htmlspecialchars($genero['nombre']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="imagen" class="form-label">Imagen</label>
                            <input type="file" class="form-control" id="imagen" name="imagen" accept="image/*">
                        </div>
                        
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <textarea class="form-control" id="descripcion" name="descripcion" rows="3" required></textarea>
                        </div>
                        
                        <div class="mb-3">
                            <label for="trailer_link" class="form-label">Link del Trailer</label>
                            <input type="url" class="form-control" id="trailer_link" name="trailer_link" placeholder="https://www.youtube.com/watch?v=...">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>