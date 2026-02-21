<?php
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
requireLogin();

// Redirigir si es admin
if (isAdmin()) {
    header('Location: /cineapp/admin/index.php');
    exit();
}

$peliculas = getPeliculas(true); // Solo películas activas
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Películas - CineApp</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .card-img-top {
            height: 200px;
            object-fit: cover;
        }
        .movie-card {
            transition: transform 0.3s;
        }
        .movie-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#">🎬 CineApp</a>
            <div class="navbar-nav ms-auto">
                <span class="nav-link text-light">
                    Bienvenido, <?php echo htmlspecialchars($_SESSION['usuario_nombre']); ?>
                </span>
                <a class="nav-link" href="../logout.php">Cerrar Sesión</a>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <h2 class="mb-4">Películas Disponibles</h2>
        
        <div class="row">
            <?php foreach ($peliculas as $pelicula): ?>
                <div class="col-md-4 mb-4">
                    <div class="card h-100 movie-card">
                        <?php if ($pelicula['imagen']): ?>
                            <img src="../<?php echo $pelicula['imagen']; ?>" class="card-img-top" alt="<?php echo htmlspecialchars($pelicula['nombre']); ?>">
                        <?php else: ?>
                            <div class="card-img-top bg-secondary d-flex align-items-center justify-content-center text-white">
                                Sin imagen
                            </div>
                        <?php endif; ?>
                        <div class="card-body">
                            <h5 class="card-title"><?php echo htmlspecialchars($pelicula['nombre']); ?></h5>
                            <p class="card-text">
                                <small class="text-muted">🎭 <?php echo htmlspecialchars($pelicula['genero_nombre']); ?></small>
                            </p>
                            <p class="card-text"><?php echo htmlspecialchars(substr($pelicula['descripcion'], 0, 100)); ?>...</p>
                            <?php if ($pelicula['trailer_link']): ?>
                                <a href="<?php echo htmlspecialchars($pelicula['trailer_link']); ?>" class="btn btn-primary" target="_blank">Ver Trailer</a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
            
            <?php if (empty($peliculas)): ?>
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        No hay películas disponibles en este momento.
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>