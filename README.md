# AlertDogAPI Backend

Backend REST para la gestion de usuarios, perros y citas.

## Tecnologias
- Node.js
- Express
- Knex
- MariaDB / MySQL
- js-yaml
- yargs

## Estructura del proyecto
```text
src/
  app.js
  configuration/
    config.js
    database.js
  controllers/
    usuarioController.js
    perroController.js
    citaController.js
  routes/
    usuarioRoute.js
    perroRoute.js
    citaRoute.js
  service/
    usuarioService.js
    perroService.js
    citaService.js
db/
  init.sql
postman/
  usuarios.postman_collection.json
  perros.postman_collection.json
  citas.postman_collection.json
tests/
  api-smoke-tests.ps1
.github/
  workflows/
    backend-ci.yml
```

## Configuracion
El backend utiliza `config.local.yaml` para la conexion a base de datos.

Ejemplo valido:
```yaml
db:
  host: localhost
  port: 3306
  user: admin
  password: "1234"
  database: AlertDog

service:
  port: 8080
```

Nota importante: `password` debe ir como string (entre comillas) para evitar errores de autenticacion en `mysql2`.

## Scripts NPM
- `npm run start`: inicia el backend en `http://0.0.0.0:3000`
- `npm run dev`: inicia el backend con nodemon
- `npm run test:api`: ejecuta pruebas rapidas de API en `tests/api-smoke-tests.ps1`

## Endpoints implementados
### Usuarios
- `GET /usuarios`
- `GET /usuarios/:id`
- `POST /usuarios`
- `PUT /usuarios/:id`
- `DELETE /usuarios/:id`

### Perros
- `GET /perros`
- `GET /perros/:id`
- `POST /perros`
- `PUT /perros/:id`
- `DELETE /perros/:id`

### Citas
- `GET /citas`
- `GET /citas/:id`
- `POST /citas`
- `PUT /citas/:id`
- `DELETE /citas/:id`

## Reglas de negocio implementadas
- No se permiten citas duplicadas para el mismo perro en la misma fecha y hora.
- Validacion de campos obligatorios en creacion de citas (`fecha`, `hora`, `id_perro`).
- Integridad referencial con claves foraneas y `ON DELETE CASCADE`.

## Codigos HTTP relevantes
- `200`: consulta o actualizacion correcta
- `201`: creacion correcta
- `400`: datos invalidos en citas (`CITA_INVALIDA`)
- `404`: recurso no encontrado
- `409`: conflicto por cita duplicada (`CITA_DUPLICADA`)
- `500`: error interno no controlado

## Base de datos
El archivo `db/init.sql` contiene:
- Creacion de tablas `usuario`, `perro`, `cita`
- Relaciones entre tablas
- Datos iniciales de prueba

## Testing local
Se incluyo una carpeta dedicada para pruebas: `tests/`.

Archivo actual:
- `tests/api-smoke-tests.ps1`

Cobertura de estas pruebas:
- Salud de API (`GET /`)
- Listados principales (`/usuarios`, `/perros`, `/citas`)
- Caso `404` de usuario inexistente
- Caso `409` por cita duplicada
- Caso `400` por cita invalida

Ejecucion:
```bash
npm run test:api
```

## CI con GitHub Actions
Se implemento un pipeline en:
- `.github/workflows/backend-ci.yml`

El workflow hace lo siguiente:
1. Se ejecuta en `push` a `main`, `dev` y `feature/**`.
2. Se ejecuta en `pull_request` hacia `main` y `dev`.
3. Levanta un servicio `mariadb`.
4. Instala dependencias con `npm ci`.
5. Importa `db/init.sql`.
6. Arranca el backend.
7. Ejecuta `tests/api-smoke-tests.ps1`.
8. Si algo falla, muestra los logs del servidor.

## Docker
Se agrego dockerizacion completa para backend y base de datos.

Archivos:
- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml`

Servicios incluidos en `docker-compose.yml`:
1. `db` (MariaDB 11)
2. `api` (Node.js + Express)

Como ejecutar con Docker:
```bash
docker compose up --build
```

Para detener y eliminar contenedores:
```bash
docker compose down
```

Para detener y eliminar tambien el volumen de datos:
```bash
docker compose down -v
```

## Postman
Las colecciones de Postman estan en la carpeta `postman/`:
- `postman/usuarios.postman_collection.json`
- `postman/perros.postman_collection.json`
- `postman/citas.postman_collection.json`

## Arranque rapido
1. Crear base de datos `AlertDog` en MariaDB/MySQL.
2. Importar `db/init.sql`.
3. Revisar `config.local.yaml`.
4. Instalar dependencias:
```bash
npm install
```
5. Iniciar backend:
```bash
npm run start
```
6. Ejecutar pruebas rapidas:
```bash
npm run test:api
```