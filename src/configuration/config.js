// Carga de configuracion general desde YAML.
// Permite usar un archivo alternativo via `--config`.

// Dependencias para lectura de archivo y parsing de argumentos.
const yaml = require('js-yaml');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Config por defecto pensada para ejecucion local.
let configFile = 'config.local.yaml';
const argv = yargs(hideBin(process.argv)).argv;

// Si se envia `--config`, se respeta ese path para entornos alternos.
if (argv.config) {
    configFile = argv.config;
}

// Parsea y expone el objeto completo de configuracion.
const config = yaml.load(fs.readFileSync(configFile, 'utf8'));

module.exports = {
    config
};