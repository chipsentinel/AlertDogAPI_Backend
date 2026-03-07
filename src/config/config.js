// 1.1 Configuración de la base de datos

// Importar Knex y configurar la conexión a la base de datos
const yaml = require('js-yaml');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');


// Leer el archivo de configuración YAML
let configFile = 'config.local.yaml'; // Valor por defecto
const argv = yargs(hideBin(process.argv)).argv;
if (argv.config) {
    configFile = argv.config;
}

const config = yaml.load(fs.readFileSync(configFile, 'utf8'));

module.exports = {
    config
};