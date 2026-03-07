// 1. Importar Knex y configurar la conexión a la base de datos

const kenex = require('knex');

require('dotenv').config(); // Cargar variables del .env

const db = kenex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    useNullAsDefault: true // Para evitar advertencias con SQLite, aunque no es necesario para MySQL
});

exports.db = db;