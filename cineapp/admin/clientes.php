<?php
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['accion'])) {
        switch($_POST['accion']) {
            case 'registrar':
                $nombre = $_POST['nombre'];
                $apellido_paterno = $_POST['apellido_paterno'];
                $apellido_materno = $_POST['apellido_materno'] ?? '';
                $correo = $_POST['correo'];
                
                // Generar contraseña automática
                $password = generateRandomPassword(10);
                
                try {
                    // Verificar si el correo ya existe
                    $check = $pdo->prepare("SELECT id FROM usuarios WHERE correo = ?");
                    $check->execute([$correo]);
                    
                    if ($check->rowCount() > 0) {
                        $error = "Este correo ya está registrado";
                    } else {
                        $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, correo, password, rol_id) 
                                               VALUES (?, ?, ?, ?, ?, 2)");
                        $stmt->execute([$nombre, $apellido_paterno, $apellido_materno, $correo, $password]);
                        
                        // Enviar correo con la contraseña
                        sendWelcomeEmail($nombre, $correo, $password);
                        
                        $success = "Cliente registrado exitosamente. Se ha enviado la contraseña a su correo.";
                    }
                } catch(PDOException $e) {
                    $error = "Error al registrar: " . $e->getMessage();
                }
                break;
        }
    }
}

$clientes = getClientes();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Clientes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="index.php">Panel Admin</a>
            <div class="navbar-nav">
                <a class="nav-link" href="peliculas.php">Películas</a>
                <a class="nav-link active" href="clientes.php">Clientes</a>
                <a class="nav-link" href="../logout.php">Cerrar Sesión</a>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <h2>Gestión de Clientes</h2>
        
        <?php if (isset($success)): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?php echo $success; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <?php echo $error; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>
        
        <!-- Botón para registrar cliente -->
        <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#registrarModal">
            + Registrar Nuevo Cliente
        </button>
        
        <!-- Tabla de clientes -->
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Correo Electrónico</th>
                        <th>Estado</th>
                        <th>Fecha Registro</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($clientes as $cliente): 
                        $nombreCompleto = trim($cliente['nombre'] . ' ' . $cliente['apellido_paterno'] . ' ' . ($cliente['apellido_materno'] ?? ''));
                    ?>
                    <tr>
                        <td><?php echo $cliente['id']; ?></td>
                        <td><?php echo htmlspecialchars($nombreCompleto); ?></td>
                        <td><?php echo htmlspecialchars($cliente['correo']); ?></td>
                        <td>
                            <span class="badge <?php echo $cliente['activo'] ? 'bg-success' : 'bg-danger'; ?>">
                                <?php echo $cliente['activo'] ? 'Activo' : 'Inactivo'; ?>
                            </span>
                        </td>
                        <td><?php echo isset($cliente['fecha_creacion']) ? date('d/m/Y H:i', strtotime($cliente['fecha_creacion'])) : 'N/A'; ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    
    <!-- Modal Registrar Cliente -->
    <div class="modal fade" id="registrarModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">Registrar Nuevo Cliente</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form method="POST">
                    <div class="modal-body">
                        <input type="hidden" name="accion" value="registrar">
                        
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre *</label>
                            <input type="text" class="form-control" id="nombre" name="nombre" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="apellido_paterno" class="form-label">Apellido Paterno *</label>
                            <input type="text" class="form-control" id="apellido_paterno" name="apellido_paterno" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="apellido_materno" class="form-label">Apellido Materno</label>
                            <input type="text" class="form-control" id="apellido_materno" name="apellido_materno">
                        </div>
                        
                        <div class="mb-3">
                            <label for="correo" class="form-label">Correo Electrónico *</label>
                            <input type="email" class="form-control" id="correo" name="correo" required>
                            <small class="text-muted">Se enviará la contraseña a este correo</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Registrar Cliente</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>