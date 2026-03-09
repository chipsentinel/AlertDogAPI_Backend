// Controlador para manejar las solicitudes relacionadas con citas

// Importar las funciones del servicio de cita
const {
    findAllCitas,
    findCita,
    addCita,
    modifyCita,
    removeCita
} = require('../service/citaService');

// Función auxiliar para mapear errores de negocio de citas a códigos HTTP adecuados
// CITA_INVALIDA -> 400 (solicitud inválida)
// CITA_DUPLICADA -> 409 (conflicto por recurso duplicado)
// Otros errores -> 500 (error interno)
const mapCitaBusinessError = (error, fallbackMessage) => {
    if (error?.code === 'CITA_INVALIDA') {
        return { status: 400, body: { error: error.message } };
    }

    if (error?.code === 'CITA_DUPLICADA') {
        return { status: 409, body: { error: error.message } };
    }

    return { status: 500, body: { error: fallbackMessage } };
};

// Obtener todas las citas
const getCitas = async (req, res) => {
    try {
        const citas = await findAllCitas();
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener citas' });
    }
};

// Obtener una cita por su ID
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

// Crear una nueva cita
const postCita = async (req, res) => {
    const citaData = req.body;
    try {
        const id_cita = await addCita(citaData);
        res.status(201).json({ id_cita });
    } catch (error) {
        // Convertir errores de negocio a la respuesta HTTP correcta
        const mappedError = mapCitaBusinessError(error, 'Error al crear cita');
        res.status(mappedError.status).json(mappedError.body);
    }
};


// Modificar una cita por ID
const putCita = async (req, res) => {
    const { id } = req.params;
    const citaData = req.body;
    try {
        const updatedRows = await modifyCita(id, citaData);
        if (updatedRows === 0) {
            res.status(404).json({ error: 'Cita no encontrada' });
            return;
        }
        res.status(200).json({ message: 'Cita modificada correctamente' });
    } catch (error) {
        // Convertir errores de negocio a la respuesta HTTP correcta
        const mappedError = mapCitaBusinessError(error, 'Error al modificar cita');
        res.status(mappedError.status).json(mappedError.body);
    }
};

// Eliminar una cita por ID
const deleteCita = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRows = await removeCita(id);
        if (deletedRows === 0) {
            res.status(404).json({ error: 'Cita no encontrada' });
            return;
        }
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