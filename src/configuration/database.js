// 1. Importar Knex y configurar la conexión a la base de datos

const knex = require('knex');
const { config } = require('./config');

require('dotenv').config(); // Cargar variables del .env

const dbConfig = {
    host: process.env.DB_HOST || config?.db?.host,
    port: Number(process.env.DB_PORT || config?.db?.port || 3306),
    user: process.env.DB_USER || config?.db?.user,
    password: process.env.DB_PASSWORD || config?.db?.password,
    database: process.env.DB_NAME || config?.db?.database
};

const db = knex({
    client: 'mysql2',
    connection: dbConfig,
    useNullAsDefault: true // Para evitar advertencias con SQLite, aunque no es necesario para MySQL
});

exports.db = db;