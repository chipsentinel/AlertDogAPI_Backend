# AlertDogAPI Backend

[![Backend CI](https://github.com/Key-Claw/AlertDogAPI_Backend/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Key-Claw/AlertDogAPI_Backend/actions/workflows/backend-ci.yml)

API REST para gestionar `usuarios`, `perros` y `citas`.

## Autoria del backend
Este backend fue disenado, estructurado y evolucionado en capas para ser facil de mantener y defender tecnicamente.

Decisiones de autoria clave:
- Separacion por capas: `routes` -> `controllers` -> `service`.
- Reglas de dominio extraidas a `src/utils/domainRules.js` para pruebas unitarias limpias.
- Diferenciacion explicita entre pruebas unitarias y pruebas de integracion.
- Pipeline CI para validar automaticamente en cada `push` o `pull_request`.

Documentos relacionados:
- `DEPLOYMENT_CHECKLIST.md`: checklist de salida a produccion.

## Estado actual (Marzo 2026)
- Backend operativo en Node + Express con persistencia en MariaDB via Knex.
- Validacion automatica con pruebas unitarias e integracion.
- Reglas de negocio implementadas para errores `400`, `404` y conflictos `409`.
- CORS habilitado para desarrollo local en `5173`, `4173` y `4174`.

## Tecnologias usadas (que son y para que sirven)
| Tecnologia | Que es | Para que se usa en este proyecto |
|---|---|---|
| Node.js | Motor para ejecutar JavaScript fuera del navegador | Corre el servidor backend |
| Express | Framework web para Node.js | Define endpoints y maneja requests/responses |
| Knex | Query builder SQL | Hablar con MariaDB sin repetir SQL en cada archivo |
| MariaDB | Base de datos relacional | Guardar usuarios, perros y citas |
| Docker Compose | Orquestador de contenedores | Levantar DB local rapido y consistente |
| Jest | Framework de testing | Ejecutar pruebas unitarias |
| PowerShell | Shell de automatizacion en Windows | Ejecutar pruebas de integracion API |
| GitHub Actions | CI/CD en GitHub | Validar tests en cada push/PR |
| js-yaml | Parser YAML | Cargar `config.local.yaml` |
| yargs | Parser de CLI args | Leer parametros de arranque |
| nodemon | Reinicio automatico | Refrescar servidor al editar codigo |

## Estructura principal
```text
src/
  app.js                         # entrada del servidor
  configuration/
    config.js                    # lee YAML y variables de entorno
    database.js                  # inicializa Knex
  controllers/                   # capa HTTP
  routes/                        # define endpoints
  service/                       # logica de negocio + acceso DB
  utils/
    domainRules.js               # reglas puras reutilizables
db/
  init.sql                       # esquema + seed
tests/
  unit/
    domainRules.test.js          # pruebas unitarias
  integration/
    api-smoke-tests.ps1          # smoke test
    api-usuarios-crud-tests.ps1  # CRUD usuarios
    api-flujo-perros-citas-tests.ps1 # flujo integrado
.github/workflows/
  backend-ci.yml                 # pipeline CI
```

## Tutorial paso a paso (para quien no sabe programar)
### Paso 1. Instala herramientas
Necesitas:
- Node.js LTS
- Docker Desktop
- Git

Verifica instalacion:
```bash
node -v
npm -v
docker -v
git --version
```

### Paso 2. Clona el repositorio
```bash
git clone https://github.com/Key-Claw/AlertDogAPI_Backend.git
cd AlertDogAPI_Backend
```

### Paso 3. Instala dependencias
```bash
npm install
```

### Paso 4. Levanta la base de datos
```bash
docker compose up -d db
```

### Paso 5. Crea tablas y datos iniciales
En Windows PowerShell:
```powershell
Get-Content -Raw .\db\init.sql | docker exec -i alertdog_db mariadb -uadmin -p1234 AlertDog
```

### Paso 6. Arranca la API
```bash
npm run dev
```

Si todo va bien, la API queda disponible en `http://localhost:3000`.

Tip rapido:
- Si prefieres ejecucion estable sin recarga, usa `npm start`.

### Paso 7. Prueba la API sin programar
Abre navegador y visita:
- `http://localhost:3000/usuarios`
- `http://localhost:3000/perros`
- `http://localhost:3000/citas`

### Paso 8. Ejecuta pruebas automaticas
Unitarias:
```bash
npm run test:unit
```

Integracion:
```bash
npm run test:integration
```

Suite completa recomendada antes de push:
```bash
npm run test:unit
npm run test:api:all
```

### Paso 9. Entiende como se construye esta API
Orden recomendado de lectura:
1. `src/app.js` (arranque del servidor).
2. `src/routes/*.js` (URLs disponibles).
3. `src/controllers/*.js` (entrada/salida HTTP).
4. `src/service/*.js` (reglas y consultas DB).
5. `src/utils/domainRules.js` (reglas reutilizables).

## Configuracion
Archivo por defecto: `config.local.yaml`.

Ejemplo:
```yaml
db:
  host: localhost
  port: 3306
  user: admin
  password: "1234"
  database: AlertDog

service:
  port: 3000
```

Variables de entorno soportadas:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `HOST`
- `PORT`
- `CORS_ORIGINS`

## Scripts npm
- `npm run start`: iniciar backend en `0.0.0.0:3000`.
- `npm run dev`: iniciar backend con recarga automatica.
- `npm run test:unit`: pruebas unitarias (Jest).
- `npm run test:api`: smoke test API.
- `npm run test:api:usuarios`: CRUD de usuarios.
- `npm run test:api:flujo`: flujo usuario -> perro -> cita.
- `npm run test:api:all`: todas las integraciones.
- `npm run test:integration`: alias de `test:api:all`.

## Endpoints
Usuarios:
- `GET /usuarios`
- `GET /usuarios/:id`
- `POST /usuarios`
- `PUT /usuarios/:id`
- `DELETE /usuarios/:id`

Perros:
- `GET /perros`
- `GET /perros/:id`
- `POST /perros`
- `PUT /perros/:id`
- `DELETE /perros/:id`

Citas:
- `GET /citas`
- `GET /citas/:id`
- `POST /citas`
- `PUT /citas/:id`
- `DELETE /citas/:id`

## CI (GitHub Actions)
Workflow: `.github/workflows/backend-ci.yml`

Valida automaticamente:
1. Levantar MariaDB de prueba.
2. Cargar `db/init.sql`.
3. Iniciar backend.
4. Ejecutar pruebas de integracion.
5. Publicar logs cuando algo falla.

## Troubleshooting rapido
- `ECONNREFUSED 127.0.0.1:3306`: DB apagada o credenciales malas.
- `ENOENT package.json`: estas parado en carpeta incorrecta.
- Fallo CORS con frontend:
  - Usa frontend en `http://127.0.0.1:5173`, `http://127.0.0.1:4173` o `http://127.0.0.1:4174`.
  - Si usas otro puerto, define `CORS_ORIGINS` al arrancar.

Ejemplo (PowerShell):
```powershell
$env:CORS_ORIGINS = "http://127.0.0.1:5173,http://127.0.0.1:4173,http://127.0.0.1:4174,http://127.0.0.1:4175"
npm start
```
