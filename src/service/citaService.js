// 2.3 Crear el servicio para manejar la lógica de negocio relacionada con las citas

const db = require('../config/database').db;

// Función para obtener todas las citas (opcional, no implementada en el controlador)
async function findAllCitas() {
    try {
        const citas = await db('cita').select('*');
        return citas;
    } catch (error) {
        console.error('Error al obtener todas las citas:', error);
        throw error;
    }
}

// Función para buscar una cita por ID
async function findCita(id) {
    try {
        const cita = await db('cita').where({ id }).first();
        return cita;
    } catch (error) {
        console.error('Error al buscar cita:', error);
        throw error;
    }
}

// Función para agregar una nueva cita
const addCita = async (cita) => {
    try {
        const { fecha, hora, id_perro } = cita;

        if (!fecha || !hora || !id_perro) {
            const businessError = new Error('fecha, hora e id_perro son obligatorios');
            businessError.code = 'CITA_INVALIDA';
            throw businessError;
        }

        const citaExistente = await db('cita').where({ fecha, hora, id_perro }).first();
        if (citaExistente) {
            const businessError = new Error('Ese perro ya tiene una cita en esa fecha y hora');
            businessError.code = 'CITA_DUPLICADA';
            throw businessError;
        }

        const [id] = await db('cita').insert(cita);
        return id; // Retorna el ID de la nueva cita
    } catch (error) {
        if (error && error.code === 'ER_DUP_ENTRY') {
            const businessError = new Error('Ese perro ya tiene una cita en esa fecha y hora');
            businessError.code = 'CITA_DUPLICADA';
            throw businessError;
        }
        console.error('Error al crear cita:', error);
        throw error;
    }
};

// Función para obtener todas las citas de un usuario
const getCitasPorUsuario = async (id_usuario) => {
    try {
        const citas = await db('cita')
            .join('perro', 'cita.id_perro', 'perro.id')
            .where('perro.id_usuario', id_usuario)
            .select('cita.*');
        return citas; // Retorna un array de citas
    } catch (error) {
        console.error('Error al obtener citas por usuario:', error);
        throw error;
    }
}

// Función para modificar una cita
const modifyCita = async (id, citaData) => {
    try {
        const citaActual = await db('cita').where({ id }).first();
        if (!citaActual) {
            return;
        }

        const fecha = citaData.fecha || citaActual.fecha;
        const hora = citaData.hora || citaActual.hora;
        const id_perro = citaData.id_perro || citaActual.id_perro;

        const citaExistente = await db('cita')
            .where({ fecha, hora, id_perro })
            .whereNot({ id })
            .first();

        if (citaExistente) {
            const businessError = new Error('Ese perro ya tiene una cita en esa fecha y hora');
            businessError.code = 'CITA_DUPLICADA';
            throw businessError;
        }

        await db('cita').where({ id }).update(citaData);
    } catch (error) {
        if (error && error.code === 'ER_DUP_ENTRY') {
            const businessError = new Error('Ese perro ya tiene una cita en esa fecha y hora');
            businessError.code = 'CITA_DUPLICADA';
            throw businessError;
        }
        console.error('Error al actualizar cita:', error);
        throw error;
    }
};

// Función para eliminar una cita (opcional, no implementada en el controlador)
const removeCita = async (id) => {
    try {
        await db('cita').where({ id }).del();
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        throw error;
    }
}

module.exports = {
    findAllCitas,
    findCita,
    addCita,
    getCitasPorUsuario,
    modifyCita,
    removeCita
};