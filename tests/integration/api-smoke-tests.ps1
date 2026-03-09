# 7.1 Script de pruebas rápidas (smoke tests) para el backend

$ErrorActionPreference = 'Stop'

# URL base de la API (el backend debe estar corriendo en este host)

$baseUrl = 'http://localhost:3000'
$failed = 0

# Función auxiliar para ejecutar una prueba HTTP y validar el código de estado esperado
function Test-Api {
    param(
        [string]$Name,
        [scriptblock]$Action,
        [int[]]$ExpectedStatusCodes = @(200)
    )

    try {
        # Si la llamada no lanza excepción en PowerShell, se asume HTTP 200
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
        # Cuando hay error HTTP, obtener el status real de la respuesta
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

# Pruebas de disponibilidad y listados básicos
Test-Api -Name 'GET /' -ExpectedStatusCodes @(200) -Action {
    Invoke-RestMethod -Uri "$baseUrl/" -Method Get
}

Test-Api -Name 'GET /usuarios' -ExpectedStatusCodes @(200) -Action {
    Invoke-RestMethod -Uri "$baseUrl/usuarios" -Method Get
}

Test-Api -Name 'GET /perros' -ExpectedStatusCodes @(200) -Action {
    Invoke-RestMethod -Uri "$baseUrl/perros" -Method Get
}

Test-Api -Name 'GET /citas' -ExpectedStatusCodes @(200) -Action {
    Invoke-RestMethod -Uri "$baseUrl/citas" -Method Get
}

Test-Api -Name 'GET /usuarios/999999 (no existe)' -ExpectedStatusCodes @(404) -Action {
    Invoke-RestMethod -Uri "$baseUrl/usuarios/999999" -Method Get
}

Test-Api -Name 'PUT /usuarios/999999 (no existe)' -ExpectedStatusCodes @(404) -Action {
    Invoke-RestMethod -Uri "$baseUrl/usuarios/999999" -Method Put -ContentType 'application/json' -Body '{"nombre":"Nadie"}'
}

Test-Api -Name 'DELETE /perros/999999 (no existe)' -ExpectedStatusCodes @(404) -Action {
    Invoke-RestMethod -Uri "$baseUrl/perros/999999" -Method Delete
}

Test-Api -Name 'DELETE /citas/999999 (no existe)' -ExpectedStatusCodes @(404) -Action {
    Invoke-RestMethod -Uri "$baseUrl/citas/999999" -Method Delete
}

# Pruebas de reglas de negocio para citas
Test-Api -Name 'POST /citas (duplicada)' -ExpectedStatusCodes @(409) -Action {
    Invoke-RestMethod -Uri "$baseUrl/citas" -Method Post -ContentType 'application/json' -Body '{"fecha":"2026-03-10","hora":"09:00:00","id_perro":1}'
}

Test-Api -Name 'POST /citas (faltan campos)' -ExpectedStatusCodes @(400) -Action {
    Invoke-RestMethod -Uri "$baseUrl/citas" -Method Post -ContentType 'application/json' -Body '{"fecha":"2026-03-30"}'
}

# Resultado final del conjunto de pruebas
if ($failed -gt 0) {
    Write-Host "\nResultado: $failed prueba(s) fallaron." -ForegroundColor Red
    exit 1
}

Write-Host "\nResultado: todas las pruebas pasaron." -ForegroundColor Green
exit 0
