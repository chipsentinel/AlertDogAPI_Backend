// Punto de entrada HTTP para la API de AlertDog.
// Se inicializan middlewares globales, CORS y rutas por recurso.

// Dependencias base para levantar Express y leer flags CLI.
const express = require('express');
const cors = require('cors');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Instancia principal de la app.
const app = express();

// Prioridad de configuracion: argumentos CLI -> variables de entorno -> defaults.
const argv = yargs(hideBin(process.argv)).argv;
const host = argv.host || process.env.HOST || '0.0.0.0';
const port = Number(argv.port || process.env.PORT || 3000);

// Origenes permitidos para peticiones del navegador (frontend local por defecto).
const allowedOrigins = (
	process.env.CORS_ORIGINS ||
	'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173,http://localhost:4174,http://127.0.0.1:4174'
)
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsOptions = {
	origin(origin, callback) {
		// Permite llamadas sin cabecera Origin (Postman, curl, jobs internos).
		if (!origin) {
			callback(null, true);
			return;
		}

		// Permite navegador solo cuando el origen esta explicitamente en allowlist.
		if (allowedOrigins.includes(origin)) {
			callback(null, true);
			return;
		}

		// Bloquea origenes no autorizados para evitar consumo web no esperado.
		callback(new Error(`Origen no permitido por CORS: ${origin}`));
	}
};

// Middlewares globales de parseo JSON y CORS.
app.use(express.json());
app.use(cors(corsOptions));

// Routers desacoplados por dominio de negocio. 
const usuarioRoutes = require('./routes/usuarioRoute');
const perroRoutes = require('./routes/perroRoute');
const citaRoutes = require('./routes/citaRoute');

// Endpoint de salud para validacion rapida.
app.get('/', (req, res) => {
	res.json({
		status: 'ok',
		message: 'AlertDogAPI en ejecución'
	});
});

// Registro de endpoints REST. 
app.use('/', usuarioRoutes);
app.use('/', perroRoutes);
app.use('/', citaRoutes);

// Solo inicia el servidor si el archivo se ejecuta directamente.
if (require.main === module) {
	app.listen(port, host, () => {
		console.log(`Servidor escuchando en http://${host}:${port}`);
	});
}

// Se exporta para tests/integraciones.
module.exports = app;