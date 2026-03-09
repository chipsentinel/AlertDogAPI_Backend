# TEST REPORT (Backend)

Fecha: 2026-03-09
Repositorio: `AlertDogAPI_Backend`

## Resultado
- Estado: `PASS`
- Conclusión: backend operativo en pruebas unitarias e integración.

## Pruebas Ejecutadas

### Unit
Comando:
```powershell
Set-Location "i:\chipsentinel\AlertDogAPI\AlertDogAPI_Backend"
npm run test:unit
```
Resultado:
- `PASS tests/unit/domainRules.test.js`
- 3/3 tests OK.

### Integración/API
Comando:
```powershell
Set-Location "i:\chipsentinel\AlertDogAPI\AlertDogAPI_Backend"
npm run test:api:all
```
Resultado:
- `api-smoke-tests.ps1`: PASS
- `api-usuarios-crud-tests.ps1`: PASS
- `api-flujo-perros-citas-tests.ps1`: PASS

## Validación de Cascade Delete
Reglas en esquema (`db/init.sql`):
- `FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE`
- `FOREIGN KEY (id_perro) REFERENCES perro(id) ON DELETE CASCADE`

Prueba real:
- Crear usuario temporal + perro + cita.
- Borrar usuario por API (`DELETE /usuarios/:id`).
- Verificar eliminación en cascada de perro y cita.

Resultado:
- `CASCADE_RESULT=PASS`
- `CASCADE_DOG_EXISTS_AFTER_DELETE=False`
- `CASCADE_CITA_EXISTS_AFTER_DELETE=False`

## Incidencia y Resolución
- Al recrear volumen DB (`docker compose down -v`), la BD quedó sin tablas.
- Se resolvió reimportando `db/init.sql` en MariaDB.
- Después, toda la batería volvió a pasar.
