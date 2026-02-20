CREATE DATABASE peliculas_db;
USE peliculas_db;

CREATE TABLE roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (nombre) VALUES ('ADMIN'), ('CLIENTE');

CREATE TABLE usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INT UNSIGNED NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

INSERT INTO usuarios 
(nombre, apellido_paterno, apellido_materno, correo, password, rol_id)
VALUES 
('Admin', 'Sistema', '', 'admin@gmail.com', 'admin123', 1);

CREATE TABLE generos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO generos (nombre) VALUES 
('Acción'),
('Comedia'),
('Drama'),
('Terror'),
('Romance'),
('Ciencia Ficción');

CREATE TABLE peliculas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    genero_id INT UNSIGNED NOT NULL,
    imagen VARCHAR(255),
    descripcion TEXT,
    trailer_link VARCHAR(255),
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (genero_id) REFERENCES generos(id)
);

CREATE TABLE recuperacion_password (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);