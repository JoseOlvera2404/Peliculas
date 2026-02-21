<?php
require_once __DIR__ . '/../config/database.php';

function login($correo, $password) {
    global $pdo;
    
    $stmt = $pdo->prepare("SELECT u.*, r.nombre as rol_nombre FROM usuarios u 
                           JOIN roles r ON u.rol_id = r.id 
                           WHERE u.correo = ? AND u.activo = 1");
    $stmt->execute([$correo]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($usuario && $password === $usuario['password']) {
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nombre'] = $usuario['nombre'] . ' ' . $usuario['apellido_paterno'];
        $_SESSION['usuario_rol'] = $usuario['rol_nombre'];
        return true;
    }
    return false;
}

function isLoggedIn() {
    return isset($_SESSION['usuario_id']);
}

function isAdmin() {
    return isset($_SESSION['usuario_rol']) && $_SESSION['usuario_rol'] === 'ADMIN';
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: /cineapp/login.php');
        exit();
    }
}

function requireAdmin() {
    requireLogin();
    if (!isAdmin()) {
        header('Location: /cineapp/cliente/index.php');
        exit();
    }
}

function generateRandomPassword($length = 10) {
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    return substr(str_shuffle($chars), 0, $length);
}
?>