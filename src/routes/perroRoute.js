// 4.1 Rutas para el manejo de perros

// Importar Express y crear un router
const express = require('express');
const router = express.Router();

// Importar el controlador de perro
const { getPerros, getPerro, postPerro, putPerro, deletePerro } = require('../controllers/perroController');

// Rutas para el manejo de perros
router.get('/perros', getPerros);
router.get('/perros/:id', getPerro);
router.post('/perros', postPerro);
router.put('/perros/:id', putPerro);
router.delete('/perros/:id', deletePerro);

module.exports = router;