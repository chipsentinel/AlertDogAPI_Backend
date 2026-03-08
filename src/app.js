// Archivo principal de la aplicación

// Importar Express y Yargs para manejar argumentos de línea de comandos
const express = require('express');
const cors = require('cors');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Crear la aplicación Express
const app = express();

const argv = yargs(hideBin(process.argv)).argv;
const host = argv.host || process.env.HOST || '0.0.0.0';
const port = Number(argv.port || process.env.PORT || 3000);

const allowedOrigins = (
	process.env.CORS_ORIGINS ||
	'http://localhost:5173,http://127.0.0.1:5173'
)
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsOptions = {
	origin(origin, callback) {
		// Allow server-to-server and local tools requests with no Origin header.
		if (!origin) {
			callback(null, true);
			return;
		}

		if (allowedOrigins.includes(origin)) {
			callback(null, true);
			return;
		}

		callback(new Error(`Origen no permitido por CORS: ${origin}`));
	}
};

app.use(express.json());
app.use(cors(corsOptions));

// Importar routers por recurso
const usuarioRoutes = require('./routes/usuarioRoute');
const perroRoutes = require('./routes/perroRoute');
const citaRoutes = require('./routes/citaRoute');

// Ruta base para verificar rápidamente desde el navegador
app.get('/', (req, res) => {
	res.json({
		status: 'ok',
		message: 'AlertDogAPI en ejecución'
	});
});

app.use('/', usuarioRoutes);
app.use('/', perroRoutes);
app.use('/', citaRoutes);

if (require.main === module) {
	app.listen(port, host, () => {
		console.log(`Servidor escuchando en http://${host}:${port}`);
	});
}

module.exports = app;