# 🐕 AlertDogAPI

**Proyecto DAW 1:** API REST y frontend para la gestión de **perros de alerta**, razas, usuarios y citas. Permite crear, consultar y gestionar datos de perros, citas y usuarios mediante un frontend con Tailwind CSS.

---

## ⚡ Tecnologías

- **Backend:** Node.js + Express  
- **Base de datos:** MariaDB  
- **Frontend:** HTML + Tailwind CSS + JavaScript  
- **Contenedores:** Docker (backend, frontend y MariaDB)  
- **Imágenes:** Carpeta `frontend/images/` para fotos de los perros  

---

## 🐾 Características principales

- Gestión de perros, razas y usuarios  
- Creación, edición y consulta de citas  
- Visualización de lista de perros con sus imágenes  
- Formulario para solicitar citas  
- Integración frontend ↔ API REST  
- Contenedores Docker para despliegue fácil  

---

## 🚀 Ejecución rápida con Docker

```bash
docker-compose up --build
````

* **Frontend:** [http://localhost:8080](http://localhost:8080)
* **API:** [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura de carpetas

```
alertdog-api/
├── backend/        # API Node.js + Express
│   ├── Dockerfile
│   ├── package.json
│   ├── app.js
│   └── routes/     # rutas para dogs, appointments, users
├── frontend/       # HTML, Tailwind CSS, JS
│   ├── index.html
│   ├── citas.html
│   ├── main.js
│   └── img/     # fotos de perros
├── db/             # init.sql para MariaDB
├── docker-compose.yml
└── README.md
```

---

## 🐕 Base de datos

**Tablas principales:**

* `breeds` → razas de los perros
* `dogs` → información de cada perro (nombre, edad, tipo de alerta, estado, imagen)
* `users` → clientes, entrenadores y administradores
* `appointments` → gestión de citas entre usuarios y perros

Ejemplo de inserción rápida:

```sql
INSERT INTO breeds (name, description) VALUES ('Labrador Retriever', 'Ideal alert dog breed');
INSERT INTO dogs (name, age, alert_type, status, entry_date, breed_id, image) VALUES ('Max', 2, 'Diabetes', 'In training', '2024-10-12', 1, 'images/max.jpg');
INSERT INTO users (name, email, role) VALUES ('Ana', 'ana@email.com', 'client');
INSERT INTO appointments (date, time, type, status, user_id, dog_id) VALUES ('2025-03-20', '10:30', 'evaluation', 'pending', 1, 1);
```

---

## 🌐 Frontend

* Lista de perros con imagen, raza y tipo de alerta
* Formulario para pedir citas, conectado con la API
* Estilos rápidos con Tailwind CSS

Ejemplo:

```html
<img src="images/max.jpg" alt="Dog Max" class="w-32 h-32 rounded">
<button class="bg-blue-600 text-white px-4 py-2 rounded">Request Appointment</button>
```

---

## 🐳 Docker

Ejemplo `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mariadb:
    image: mariadb:11
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: alertdog
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - mariadb

  frontend:
    image: nginx:alpine
    volumes:
      - ./frontend:/usr/share/nginx/html
    ports:
      - "8080:80"
```

---

## 📚 Contacto

Proyecto realizado como entrega del segundo trimestre de **DAW 1**. Ideal para practicar **API REST, frontend moderno con Tailwind, Docker y bases de datos relacionales**.

````

---

### 2️⃣ init.sql para MariaDB

```sql
-- Base de datos AlertDogAPI
CREATE DATABASE IF NOT EXISTS alertdog;
USE alertdog;

-- Tabla de razas
CREATE TABLE breeds (
  id_breed INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
) ENGINE=InnoDB;

-- Tabla de perros
CREATE TABLE dogs (
  id_dog INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  age INT,
  alert_type VARCHAR(50),
  status VARCHAR(30),
  entry_date DATE,
  breed_id INT,
  image VARCHAR(255),
  CONSTRAINT fk_dog_breed FOREIGN KEY (breed_id) REFERENCES breeds(id_breed) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabla de usuarios
CREATE TABLE users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('client','trainer','admin') NOT NULL
) ENGINE=InnoDB;

-- Tabla de citas
CREATE TABLE appointments (
  id_appointment INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type ENUM('evaluation','training','followup','delivery') NOT NULL,
  status ENUM('pending','confirmed','canceled') NOT NULL,
  user_id INT,
  dog_id INT,
  CONSTRAINT fk_appointment_user FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
  CONSTRAINT fk_appointment_dog FOREIGN KEY (dog_id) REFERENCES dogs(id_dog) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Datos de ejemplo
INSERT INTO breeds (name, description) VALUES ('Labrador Retriever', 'Ideal alert dog breed');
INSERT INTO dogs (name, age, alert_type, status, entry_date, breed_id, image) VALUES ('Max', 2, 'Diabetes', 'In training', '2024-10-12', 1, 'images/max.jpg');
INSERT INTO users (name, email, role) VALUES ('Ana', 'ana@email.com', 'client');
INSERT INTO appointments (date, time, type, status, user_id, dog_id) VALUES ('2025-03-20', '10:30', 'evaluation', 'pending', 1, 1);
````

---

### 3️⃣ app.js base + rutas

**backend/app.js**

```javascript
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MariaDB
const db = mysql.createPool({
  host: process.env.DB_HOST || 'mariadb',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'alertdog'
});

// Rutas
const dogsRoutes = require('./routes/dogs')(db);
const appointmentsRoutes = require('./routes/appointments')(db);

app.use('/api/dogs', dogsRoutes);
app.use('/api/appointments', appointmentsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API AlertDogAPI corriendo en puerto ${PORT}`);
});
```

**backend/routes/dogs.js**

```javascript
const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET /api/dogs
  router.get('/', (req, res) => {
    db.query('SELECT * FROM dogs', (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });

  // POST /api/dogs
  router.post('/', (req, res) => {
    const { name, age, alert_type, status, entry_date, breed_id, image } = req.body;
    const sql = 'INSERT INTO dogs (name, age, alert_type, status, entry_date, breed_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, age, alert_type, status, entry_date, breed_id, image], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Dog added', id: result.insertId });
    });
  });

  return router;
};
```

**backend/routes/appointments.js**

```javascript
const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET /api/appointments
  router.get('/', (req, res) => {
    db.query('SELECT * FROM appointments', (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });

  // POST /api/appointments
  router.post('/', (req, res) => {
    const { date, time, type, status, user_id, dog_id } = req.body;
    const sql = 'INSERT INTO appointments (date, time, type, status, user_id, dog_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [date, time, type, status, user_id, dog_id], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Appointment added', id: result.insertId });
    });
  });

  return router;
};
```
