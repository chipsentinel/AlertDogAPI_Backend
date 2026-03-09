// 4.1 Rutas para el manejo de citas

// Importar Express y crear un router
const express = require('express');
const router = express.Router();

// Importar el controlador de cita
const { getCitas, getCita, postCita, putCita, deleteCita } = require('../controllers/citaController');

// Rutas para el manejo de citas
router.get('/citas', getCitas);
router.get('/citas/:id', getCita);
router.post('/citas', postCita);
router.put('/citas/:id', putCita);
router.delete('/citas/:id', deleteCita);

module.exports = router;