USE AlertDog;

CREATE TABLE usuario (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rol BOOLEAN DEFAULT FALSE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(11) NOT NULL
);


CREATE TABLE perro (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    raza VARCHAR(50) NOT NULL,
    genero BOOLEAN DEFAULT FALSE,
    fecha_de_nacimiento DATE,
    id_usuario INT UNSIGNED,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE -- Si se borra un usuario, se borran sus perros
);

CREATE TABLE cita (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    id_perro INT UNSIGNED,
    FOREIGN KEY (id_perro) REFERENCES perro(id) ON DELETE CASCADE,
     UNIQUE (fecha, hora, id_perro) -- evita dos citas al mismo tiempo para el mismo perro
);

-- Inserts de ejemplo para usuarios
INSERT INTO usuario (id, rol, nombre, apellido, password, email, telefono) VALUES
(1, 1, 'Admin', 'Principal', 'admin123', 'admin@alertdog.com', '0991234567'),
(2, 0, 'Luis', 'Martinez', 'luis123', 'luis@correo.com', '0981112233'),
(3, 0, 'Ana', 'Gomez', 'ana123', 'ana@correo.com', '0982223344'),
(4, 0, 'Carla', 'Ruiz', 'carla123', 'carla@correo.com', '0983334455');

-- Inserts de ejemplo para perros
INSERT INTO perro (id, nombre, raza, genero, fecha_de_nacimiento, id_usuario) VALUES
(1, 'Max', 'Labrador', 1, '2021-04-10', 2),
(2, 'Luna', 'Golden Retriever', 0, '2022-01-05', 2),
(3, 'Rocky', 'Bulldog', 1, '2020-07-14', 3),
(4, 'Nala', 'Beagle', 0, '2023-03-20', 3),
(5, 'Toby', 'Pastor Aleman', 1, '2019-11-30', 4);

-- Inserts de ejemplo para citas
INSERT INTO cita (id, fecha, hora, id_perro) VALUES
(1, '2026-03-10', '09:00:00', 1),
(2, '2026-03-10', '10:00:00', 2),
(3, '2026-03-11', '11:30:00', 3),
(4, '2026-03-12', '15:00:00', 4),
(5, '2026-03-13', '08:30:00', 5),
(6, '2026-03-14', '16:00:00', 1);