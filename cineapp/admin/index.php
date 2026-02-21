<?php
require_once '../includes/auth.php';
requireAdmin();

$totalPeliculas = $pdo->query("SELECT COUNT(*) FROM peliculas")->fetchColumn();
$totalClientes = $pdo->query("SELECT COUNT(*) FROM usuarios WHERE rol_id = 2")->fetchColumn();
$peliculasActivas = $pdo->query("SELECT COUNT(*) FROM peliculas WHERE activa = 1")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
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
        <h2>Dashboard</h2>
        
        <div class="row mt-4">
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Total Películas</h5>
                        <h2><?php echo $totalPeliculas; ?></h2>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card text-white bg-success mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Películas Activas</h5>
                        <h2><?php echo $peliculasActivas; ?></h2>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card text-white bg-info mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Total Clientes</h5>
                        <h2><?php echo $totalClientes; ?></h2>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        Acciones Rápidas
                    </div>
                    <div class="card-body">
                        <a href="peliculas.php" class="btn btn-primary mb-2 w-100">Gestionar Películas</a>
                        <a href="clientes.php" class="btn btn-success mb-2 w-100">Gestionar Clientes</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>