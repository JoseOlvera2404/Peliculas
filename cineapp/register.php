<?php
require_once 'includes/auth.php';
require_once 'includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $apellido_paterno = $_POST['apellido_paterno'];
    $apellido_materno = $_POST['apellido_materno'] ?? '';
    $correo = $_POST['correo'];
    
    // Generar contraseña automática
    $password = generateRandomPassword(10); // 10 caracteres para mayor seguridad
    
    try {
        // Verificar si el correo ya existe
        $check = $pdo->prepare("SELECT id FROM usuarios WHERE correo = ?");
        $check->execute([$correo]);
        
        if ($check->rowCount() > 0) {
            $error = "Este correo electrónico ya está registrado";
        } else {
            $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, correo, password, rol_id) 
                                   VALUES (?, ?, ?, ?, ?, 2)");
            $stmt->execute([$nombre, $apellido_paterno, $apellido_materno, $correo, $password]);
            
            // Enviar correo con la contraseña
            $emailSent = sendWelcomeEmail($nombre, $correo, $password);
            
            if ($emailSent) {
                $success = "✅ ¡Registro exitoso! Se ha enviado un correo a <strong>$correo</strong> con tu contraseña.";
            } else {
                $success = "✅ Registro exitoso. Tu contraseña es: <strong>$password</strong><br>
                           <small class='text-warning'>⚠️ No se pudo enviar el correo, pero guarda esta contraseña.</small>";
            }
        }
    } catch(PDOException $e) {
        $error = "Error al registrar: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - CineApp</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .password-display {
            background-color: #f8f9fa;
            border: 2px dashed #28a745;
            padding: 15px;
            text-align: center;
            font-size: 1.2rem;
            border-radius: 10px;
        }
    </style>
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header bg-success text-white">
                        <h4 class="mb-0">📝 Registro de Cliente</h4>
                    </div>
                    <div class="card-body">
                        <?php if (isset($success)): ?>
                            <div class="alert alert-success">
                                <?php echo $success; ?>
                            </div>
                            <div class="text-center mt-3">
                                <a href="login.php" class="btn btn-primary">Ir al Login</a>
                            </div>
                        <?php else: ?>
                        
                        <?php if (isset($error)): ?>
                            <div class="alert alert-danger"><?php echo $error; ?></div>
                        <?php endif; ?>
                        
                        <form method="POST" id="registerForm">
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
                                <small class="text-muted">Recibirás tu contraseña en este correo</small>
                            </div>
                            
                            <button type="submit" class="btn btn-success w-100">Registrarse</button>
                        </form>
                        
                        <hr>
                        <p class="text-center mb-0">
                            <a href="login.php">¿Ya tienes cuenta? Inicia sesión</a>
                        </p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>