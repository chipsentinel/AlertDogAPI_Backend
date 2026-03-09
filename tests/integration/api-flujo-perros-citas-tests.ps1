$ErrorActionPreference = 'Stop'

# 1) Configuración base de pruebas
$baseUrl = 'http://localhost:3000'

# Contador de fallos global del script.
$failed = 0

# IDs temporales creados durante el flujo para validación y limpieza.
$createdUserId = $null
$createdPerroId = $null
$createdCitaId = $null

# 2) Helper de ejecución y validación de estado HTTP.
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

# 3) Datos únicos por ejecución para evitar colisiones de registros.
$stamp = Get-Date -Format 'yyyyMMddHHmmss'
$email = "qa.flow.$stamp@correo.com"
$telefono = "094" + $stamp.Substring($stamp.Length - 7)
$fechaCita = '2026-04-15'
$horaCita = '10:00:00'
$horaActualizada = '11:00:00'

# 4) Crear usuario base del flujo.
$userBody = @{
    rol = 0
    nombre = 'QAFlow'
    apellido = 'Tests'
    email = $email
    telefono = $telefono
    password = 'flow1234'
} | ConvertTo-Json -Compress

Test-Api -Name 'POST /usuarios (flujo)' -ExpectedStatusCodes @(200,201) -Action {
    $resp = Invoke-RestMethod -Uri "$baseUrl/usuarios" -Method Post -ContentType 'application/json' -Body $userBody
    $script:createdUserId = [int]$resp.id_usuario
}

if (-not $createdUserId) {
    Write-Host "No se pudo crear usuario de flujo. Abortando." -ForegroundColor Red
    exit 1
}

# 5) Crear perro asociado al usuario.
$perroBody = @{
    nombre = 'RayoFlow'
    raza = 'Pastor'
    genero = 1
    fecha_de_nacimiento = '2021-06-10'
    id_usuario = $createdUserId
} | ConvertTo-Json -Compress

Test-Api -Name 'POST /perros (crear)' -ExpectedStatusCodes @(200,201) -Action {
    $resp = Invoke-RestMethod -Uri "$baseUrl/perros" -Method Post -ContentType 'application/json' -Body $perroBody
    $script:createdPerroId = [int]$resp.id_perro
}

if (-not $createdPerroId) {
    Write-Host "No se pudo crear perro de flujo. Abortando." -ForegroundColor Red
    exit 1
}

Test-Api -Name 'GET /perros/:id (recien creado)' -ExpectedStatusCodes @(200) -Action {
    $p = Invoke-RestMethod -Uri "$baseUrl/perros/$createdPerroId" -Method Get
    if ([int]$p.id_usuario -ne $createdUserId) { throw 'Perro no pertenece al usuario esperado' }
}

# 6) Crear cita para ese perro y validar reglas.
$citaBody = @{
    fecha = $fechaCita
    hora = $horaCita
    id_perro = $createdPerroId
} | ConvertTo-Json -Compress

Test-Api -Name 'POST /citas (crear)' -ExpectedStatusCodes @(200,201) -Action {
    $resp = Invoke-RestMethod -Uri "$baseUrl/citas" -Method Post -ContentType 'application/json' -Body $citaBody
    $script:createdCitaId = [int]$resp.id_cita
}

if (-not $createdCitaId) {
    Write-Host "No se pudo crear cita de flujo. Abortando." -ForegroundColor Red
    exit 1
}

# La duplicación del mismo perro+fecha+hora debe dar conflicto (409).
Test-Api -Name 'POST /citas (duplicada mismo perro/fecha/hora)' -ExpectedStatusCodes @(409) -Action {
    Invoke-RestMethod -Uri "$baseUrl/citas" -Method Post -ContentType 'application/json' -Body $citaBody
}

$citaUpdateBody = @{
    fecha = $fechaCita
    hora = $horaActualizada
    id_perro = $createdPerroId
} | ConvertTo-Json -Compress

Test-Api -Name 'PUT /citas/:id (actualizar hora)' -ExpectedStatusCodes @(200) -Action {
    Invoke-RestMethod -Uri "$baseUrl/citas/$createdCitaId" -Method Put -ContentType 'application/json' -Body $citaUpdateBody
}

Test-Api -Name 'GET /citas/:id (hora actualizada)' -ExpectedStatusCodes @(200) -Action {
    $c = Invoke-RestMethod -Uri "$baseUrl/citas/$createdCitaId" -Method Get
    if ($c.hora -ne $horaActualizada) { throw 'Hora de cita no actualizada' }
}

# 7) Limpieza en orden por dependencias para no dejar basura en BD.
Test-Api -Name 'DELETE /citas/:id (limpieza)' -ExpectedStatusCodes @(200) -Action {
    Invoke-RestMethod -Uri "$baseUrl/citas/$createdCitaId" -Method Delete
}

Test-Api -Name 'DELETE /perros/:id (limpieza)' -ExpectedStatusCodes @(200) -Action {
    Invoke-RestMethod -Uri "$baseUrl/perros/$createdPerroId" -Method Delete
}

Test-Api -Name 'DELETE /usuarios/:id (limpieza)' -ExpectedStatusCodes @(200) -Action {
    Invoke-RestMethod -Uri "$baseUrl/usuarios/$createdUserId" -Method Delete
}

# 8) Resultado final.
if ($failed -gt 0) {
    Write-Host "`nResultado: $failed prueba(s) fallaron." -ForegroundColor Red
    exit 1
}

Write-Host "`nResultado: todas las pruebas pasaron." -ForegroundColor Green
exit 0
