// 3.3 Crear el controlador para manejar las solicitudes relacionadas con las citas

// Importar las funciones del servicio de cita
const { findAllCitas,
    findCita,
    addCita,
    getCitasPorUsuario,
    modifyCita,
    removeCita } = require('../service/citaService');

// Controlador para obtener todos las citas (opcional, no implementada en el router)
const getCitas = async (req, res) => {
    try {
        const citas = await findAllCitas();
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener citas' });
    }
};

// Controlador para obtener una cita por su ID
const getCita = async (req, res) => {
    const { id } = req.params;
    try {
        const cita = await findCita(id);
        if (cita) {
            res.json(cita);
        } else {
            res.status(404).json({ error: 'Cita no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener cita' });
    }
};

// Controlador para crear un nueva cita
const postCita = async (req, res) => {
    const citaData = req.body;
    try {
        const id_cita = await addCita(citaData);
        res.status(201).json({ id_cita });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear cita' });
    }
};


// Controlador para modificar una cita
const putCita = async (req, res) => {
    const { id } = req.params;
    const citaData = req.body;
    try {
        await modifyCita(id, citaData);
        res.status(200).json({ message: 'Cita modificada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al modificar cita' });
    }
};

// Controlador para eliminar una cita
const deleteCita = async (req, res) => {
    const { id } = req.params;
    try {
        await removeCita(id);
        res.status(200).json({ message: 'Cita eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar cita' });
    }
};

module.exports = {
    getCitas,
    getCita,
    postCita,
    putCita,
    deleteCita
};