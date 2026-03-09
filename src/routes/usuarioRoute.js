 // 4.1 Rutas para el manejo de usuarios

// Importar Express y crear un router
 const express = require('express');
const router = express.Router();

// Importar el controlador de usuario
const { getUsuarios, getUsuario, postUsuario, putUsuario, deleteUsuario } = require('../controllers/usuarioController');

// Rutas para el manejo de usuarios
router.get('/usuarios', getUsuarios);
router.get('/usuarios/:id', getUsuario);
router.post('/usuarios', postUsuario);
router.put('/usuarios/:id', putUsuario);
router.delete('/usuarios/:id', deleteUsuario);

module.exports = router;