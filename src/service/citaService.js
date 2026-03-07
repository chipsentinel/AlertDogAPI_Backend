// 2.3 Crear el servicio para manejar la lógica de negocio relacionada con las citas

const db = require('../config/database').db;
const {get} = require('../config/database').db;

// Función para obtener todas las citas (opcional, no implementada en el controlador)
async function findAllCitas() {
    try {
        const citas = await db('citas').select('*');
        return citas;
    } catch (error) {
        console.error('Error al obtener todas las citas:', error);
        throw error;
    }
}

// Función para buscar un citas por fecha y hora
async function findCita(fecha_hora) {
    try {
        const cita = await db('citas').where({ fecha_hora }).first();
        return cita;
    } catch (error) {
        console.error('Error al buscar cita:', error);
        throw error;
    }
}

// Función para agregar una nueva cita
const addCita = async (cita) => {
    try {
        const [id] = await db('citas').insert(cita);
        return id; // Retorna el ID de la nueva cita
    } catch (error) {
        console.error('Error al crear cita:', error);
        throw error;
    }
};

// Función para obtener todas las citas de un usuario
const getCitasPorUsuario = async (id_usuario) => {
    try {
        const citas = await db('citas').where({ id_usuario });
        return citas; // Retorna un array de citas
    } catch (error) {
        console.error('Error al obtener citas por usuario:', error);
        throw error;
    }
}

// Función para modificar fecha de una cita (opcional, no implementada en el controlador)
const modifyCita = async (id, nueva_fecha_hora) => {
    try {
        await db('citas').where({ id }).update({ fecha_hora: nueva_fecha_hora });
    } catch (error) {
        console.error('Error al actualizar cita:', error);
        throw error;
    }
};

// Función para eliminar una cita (opcional, no implementada en el controlador)
const removeCita = async (id) => {
    try {
        await db('citas').where({ id }).del();
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