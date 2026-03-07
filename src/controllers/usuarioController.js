// 3.1 Crear el controlador para manejar las solicitudes relacionadas con los usuarios

const usuarioService = require('../service/usuarioService');

// Controlador para crear un nuevo usuario
async function getCrearUsuario(req, res) {
    try {
        const { email, password, nombre, apellido, telefono } = req.body;
        if (!email || !password || !nombre || !apellido || !telefono) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const nuevoUsuario = { email, password, nombre, apellido, telefono };
        const id = await usuarioService.crearUsuario(nuevoUsuario);
        res.status(201).json({ id }); // Retorna el ID del nuevo usuario
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
}

// Controlador para obtener un usuario por su ID
async function getUsuarioPorId(req, res) {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorId(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
}

const pos

module.exports = {
    getCrearUsuario,
    getUsuarioPorId
};