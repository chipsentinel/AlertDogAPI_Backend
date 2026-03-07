// 2.2 Crear el servicio para manejar la lógica de negocio relacionada con los perros

const db = require('../config/database').db;

const getDaysFromNow = (date) => {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffMs = targetMidnight - todayMidnight;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

// Función para obtener todos los perros (opcional, no implementada en el controlador)
const findAllPerros = async () => {
    try {
        const perros = await db('perro').select('*');
        return perros;
    } catch (error) {
        console.error('Error al obtener todos los perros:', error);
        throw error;
    }
};

// Función para buscar un perro por su ID
const findPerro = async (id) => {
    try {
        const perro = await db('perro').where({ id }).first();
        return perro;
    } catch (error) {
        console.error('Error al buscar perro:', error);
        throw error;
    }
};

// Función para agregar un nuevo perro
const addPerro = async (perro) => {
    try {
        const [id] = await db('perro').insert(perro);
        return id; // Retorna el ID del nuevo perro
    } catch (error) {
        console.error('Error al crear perro:', error);
        throw error;
    }
};

// Función para obtener todos los perros de un usuario
const getPerrosPorUsuario = async (id_usuario) => {
    try {
        const perros = await db('perro').where({ id_usuario });
        return perros; // Retorna un array de perros
    } catch (error) {
        console.error('Error al obtener perros por usuario:', error);
        throw error;
    }
}

// Función para obtener un perro por su Raza
const getPerroPorRaza = async (raza) => {
    try {
        const perro = await db('perro').where({ raza }).first();
        return perro;
    } catch (error) {
        console.error('Error al obtener perro por raza:', error);
        throw error;
    }
};

// Función para modificar un perro
const modifyPerro = async (id, perro) => {
    try {
        await db('perro').where({ id }).update(perro);
    } catch (error) {
        console.error('Error al actualizar perro:', error);
        throw error;
    }
}

// Función para eliminar un perro
const removePerro = async (id) => {
    try {
        await db('perro').where({ id }).del();
    } catch (error) {
        console.error('Error al eliminar perro:', error);
        throw error;
    }
}

// Función para verificar si un perro tiene una cita próxima (opcional, no implementada en el controlador)
const tieneCitaProxima = async (id_perro) => {
    try {
        const citas = await db('cita').where({ id_perro });
        for (const cita of citas) {
            const fechaCita = new Date(cita.fecha);
            const diasParaCita = getDaysFromNow(fechaCita);
            if (diasParaCita >= 0 && diasParaCita <= 7) {
                return true; // El perro tiene una cita próxima en los próximos 7 días
            }
        }
        return false; // El perro no tiene una cita próxima en los próximos 7 días
    } catch (error) {
        console.error('Error al verificar cita próxima:', error);
        throw error;
    }
};

module.exports = {
    findAllPerros,
    findPerro,
    addPerro,
    getPerrosPorUsuario,
    getPerroPorRaza,
    modifyPerro,
    removePerro,
    tieneCitaProxima
};