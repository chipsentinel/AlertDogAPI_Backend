// Inicializa Knex para MariaDB/MySQL.
// Prioridad de configuracion: variables de entorno -> archivo YAML.

const knex = require('knex');
const { config } = require('./config');

// Habilita soporte de .env para ejecucion local.
require('dotenv').config();

// Parametros de conexion usados por mysql2.
const dbConfig = {
    host: process.env.DB_HOST || config?.db?.host,
    port: Number(process.env.DB_PORT || config?.db?.port || 3306),
    user: process.env.DB_USER || config?.db?.user,
    password: process.env.DB_PASSWORD || config?.db?.password,
    database: process.env.DB_NAME || config?.db?.database
};

// Instancia compartida para queries en capa service.
const db = knex({
    client: 'mysql2',
    connection: dbConfig,
    useNullAsDefault: true // Se mantiene para compatibilidad y evitar warnings en algunos entornos.
});

exports.db = db;