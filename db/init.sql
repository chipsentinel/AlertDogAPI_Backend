USE AlertDog

CREATE TABLE usuario (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rol BOOLEAN DEFAULT FALSE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
)


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