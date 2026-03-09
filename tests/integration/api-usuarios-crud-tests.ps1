$ErrorActionPreference = 'Stop'

# 1) Configuración base de pruebas
# URL de la API objetivo (debe estar levantada antes de ejecutar el script).
$baseUrl = 'http://localhost:3000'

# Contador de pruebas fallidas (si termina > 0, el script retorna exit 1).
$failed = 0

# ID del usuario creado durante el test (para usarlo en update/delete).
$createdUserId = $null

# 2) Helper genérico para ejecutar pasos HTTP con validación de estado.
# Nota: Invoke-RestMethod en PowerShell no siempre expone 201 sin excepción,
# por eso en creaciones aceptamos 200/201 en ExpectedStatusCodes.
function Test-Api {
    param(
        [string]$Name,
        [scriptblock]$Action,
        [int[]]$ExpectedStatusCodes = @(200)
    )

    try {
        & $Action | Out-Null
        $status = 200

        if ($ExpectedStatusCodes -notcontains $status) {
            $script:failed++
            Write-Host "FAIL | $Name | expected: $($ExpectedStatusCodes -join ',') | got: $status" -ForegroundColor Red
            return
        }

        Write-Host "PASS | $Name | HTTP $status" -ForegroundColor Green
    }
    catch {
        $status = 0
        try { $status = [int]$_.Exception.Response.StatusCode.value__ } catch {}

        if ($ExpectedStatusCodes -contains $status) {
            Write-Host "PASS | $Name | HTTP $status" -ForegroundColor Green
            return
        }

        $script:failed++
        Write-Host "FAIL | $Name | expected: $($ExpectedStatusCodes -join ',') | got: $status" -ForegroundColor Red
    }
}

# 3) Datos únicos para no colisionar con registros existentes.
$stamp = Get-Date -Format 'yyyyMMddHHmmss'
$email = "qa.user.$stamp@correo.com"
$telefono = "095" + $stamp.Substring($stamp.Length - 7)

# 4) Payload de creación del usuario de prueba.
$createBody = @{
    rol = 0
    nombre = 'QA'
    apellido = 'Crud'
    email = $email
    telefono = $telefono
    password = 'qa123456'
} | ConvertTo-Json -Compress

# 5) Flujo CRUD de usuarios.
Test-Api -Name 'POST /usuarios (crear)' -ExpectedStatusCodes @(200,201) -Action {
    $resp = Invoke-RestMethod -Uri "$baseUrl/usuarios" -Method Post -ContentType 'application/json' -Body $createBody
    $script:createdUserId = [int]$resp.id_usuario
}

# Si no se crea el usuario, el resto del flujo no tiene sentido.
if (-not $createdUserId) {
    Write-Host "No se pudo crear usuario de prueba. Abortando pruebas restantes." -ForegroundColor Red
    exit 1
}

Test-Api -Name 'GET /usuarios/:id (recien creado)' -ExpectedStatusCodes @(200) -Action {
    $u = Invoke-RestMethod -Uri "$baseUrl/usuarios/$createdUserId" -Method Get
    if ($u.email -ne $email) { throw 'Email no coincide' }
}

$updateBody = @{
    apellido = 'CrudActualizado'
    telefono = $telefono
} | ConvertTo-Json -Compress

Test-Api -Name 'PUT /usuarios/:id (actualizar)' -ExpectedStatusCodes @(200) -Action {
    Invoke-RestMethod -Uri "$baseUrl/usuarios/$createdUserId" -Method Put -ContentType 'application/json' -Body $updateBody
}

Test-Api -Name 'GET /usuarios/:id (apellido actualizado)' -ExpectedStatusCodes @(200) -Action {
    $u = Invoke-RestMethod -Uri "$baseUrl/usuarios/$createdUserId" -Method Get
    if ($u.apellido -ne 'CrudActualizado') { throw 'Apellido no actualizado' }
}

Test-Api -Name 'DELETE /usuarios/:id (eliminar)' -ExpectedStatusCodes @(200) -Action {
    Invoke-RestMethod -Uri "$baseUrl/usuarios/$createdUserId" -Method Delete
}

Test-Api -Name 'GET /usuarios/:id (eliminado)' -ExpectedStatusCodes @(404) -Action {
    Invoke-RestMethod -Uri "$baseUrl/usuarios/$createdUserId" -Method Get
}

# 6) Resultado final.
if ($failed -gt 0) {
    Write-Host "`nResultado: $failed prueba(s) fallaron." -ForegroundColor Red
    exit 1
}

Write-Host "`nResultado: todas las pruebas pasaron." -ForegroundColor Green
exit 0
