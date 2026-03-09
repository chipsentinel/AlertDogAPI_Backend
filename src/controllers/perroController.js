// Controlador para manejar las solicitudes relacionadas con perros

// Importar las funciones del servicio de perro
const {
    findAllPerros,
    findPerro,
    addPerro,
    modifyPerro,
    removePerro
} = require('../service/perroService');
const { sanitizePerroFilters } = require('../utils/domainRules');

// Obtener todos los perros
const getPerros = async (req, res) => {
    try {
        const filters = sanitizePerroFilters(req.query);
        const perros = await findAllPerros(filters);
        res.json(perros);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener perros' });
    }
};

// Obtener un perro por su ID
const getPerro = async (req, res) => {
    const { id } = req.params;
    try {
        const perro = await findPerro(id);
        if (perro) {
            res.json(perro);
        } else {
            res.status(404).json({ error: 'Perro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener perro' });
    }
};

// Crear un nuevo perro
const postPerro = async (req, res) => {
    const perroData = req.body;
    try {
        const id_perro = await addPerro(perroData);
        res.status(201).json({ id_perro });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear perro' });
    }
};


// Modificar un perro por ID
const putPerro = async (req, res) => {
    const { id } = req.params;
    const perroData = req.body;
    try {
        const updatedRows = await modifyPerro(id, perroData);
        if (updatedRows === 0) {
            res.status(404).json({ error: 'Perro no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Perro modificado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al modificar perro' });
    }
};

// Eliminar un perro por ID
const deletePerro = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRows = await removePerro(id);
        if (deletedRows === 0) {
            res.status(404).json({ error: 'Perro no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Perro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar perro' });
    }
};

module.exports = {
    getPerros,
    getPerro,
    postPerro,
    putPerro,
    deletePerro
};