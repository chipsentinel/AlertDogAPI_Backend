// Controlador para manejar las solicitudes relacionadas con usuarios

// Importar las funciones del servicio de usuario
const {
    findAllUsuarios,
    addUsuario,
    getUsuarioPorId,
    modifyUsuario,
    removeUsuario
} = require('../service/usuarioService');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await findAllUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Obtener un usuario por su ID
const getUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await getUsuarioPorId(id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

// Crear un nuevo usuario
const postUsuario = async (req, res) => {
    const usuarioData = req.body;
    try {
        const id_usuario = await addUsuario(usuarioData);
        res.status(201).json({ id_usuario });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};


// Modificar un usuario por ID
const putUsuario = async (req, res) => {
    const { id } = req.params;
    const usuarioData = req.body;
    try {
        const updatedRows = await modifyUsuario(id, usuarioData);
        if (updatedRows === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Usuario modificado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al modificar usuario' });
    }
};

// Eliminar un usuario por ID
const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRows = await removeUsuario(id);
        if (deletedRows === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

module.exports = {
    getUsuarios,
    getUsuario,
    postUsuario,
    putUsuario,
    deleteUsuario
};