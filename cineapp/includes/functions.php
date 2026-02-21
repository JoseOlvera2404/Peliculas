<?php
require_once __DIR__ . '/../config/database.php';

function getGeneros() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM generos ORDER BY nombre");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getPeliculas($activa = null) {
    global $pdo;
    $sql = "SELECT p.*, g.nombre as genero_nombre 
            FROM peliculas p 
            JOIN generos g ON p.genero_id = g.id";
    
    if ($activa !== null) {
        $sql .= " WHERE p.activa = " . ($activa ? 1 : 0);
    }
    
    $sql .= " ORDER BY p.fecha_creacion DESC";
    $stmt = $pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getClientes() {
    global $pdo;
    $stmt = $pdo->query("SELECT id, nombre, apellido_paterno, apellido_materno, correo, activo, fecha_creacion 
                         FROM usuarios WHERE rol_id = 2 ORDER BY fecha_creacion DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function subirImagen($archivo) {
    $target_dir = __DIR__ . "/../uploads/";
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    $extension = pathinfo($archivo["name"], PATHINFO_EXTENSION);
    $nombre_archivo = uniqid() . '.' . $extension;
    $target_file = $target_dir . $nombre_archivo;
    
    if (move_uploaded_file($archivo["tmp_name"], $target_file)) {
        return "uploads/" . $nombre_archivo;
    }
    return null;
}

function sendWelcomeEmail($nombre, $email, $password) {
    $service_id = 'service_7swa6e9';
    $template_id = 'template_yiqbe2h';
    $public_key = 'BeB-RroZOMBmSmXTG';
    
    $data = [
        'service_id' => $service_id,
        'template_id' => $template_id,
        'user_id' => $public_key,
        'template_params' => [
            'to_name' => $nombre,
            'to_email' => $email,
            'password' => $password,
            'from_name' => 'CineApp',
            'reply_to' => 'noreply@cineapp.com',
            'subject' => 'Bienvenido a CineApp - Tus credenciales de acceso'
        ]
    ];
    
    $ch = curl_init('https://api.emailjs.com/api/v1.0/email/send');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Origin: http://localhost'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        error_log("Error enviando email: " . $response);
        return false;
    }
    
    return true;
}
?>