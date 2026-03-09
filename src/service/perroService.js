// Capa de acceso/negocio para la entidad perro.

const db = require('../configuration/database').db;
const { getDaysFromNow } = require('../utils/domainRules');

// Obtener todos los perros con filtros opcionales: id_usuario, raza, q (busqueda general en nombre y raza).
const findAllPerros = async (filters = {}) => {
    try {
        let query = db('perro').select('*');

        if (filters.id_usuario !== undefined) {
            query = query.where('id_usuario', filters.id_usuario);
        }

        if (filters.raza) {
            query = query.where('raza', 'like', `%${filters.raza}%`);
        }

        if (filters.q) {
            query = query.where((builder) => {
                builder
                    .where('nombre', 'like', `%${filters.q}%`)
                    .orWhere('raza', 'like', `%${filters.q}%`);
            });
        }

        const perros = await query;
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

// Función para agregar un nuevo perro a un usuario
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
        const updatedRows = await db('perro').where({ id }).update(perro);
        return updatedRows;
    } catch (error) {
        console.error('Error al actualizar perro:', error);
        throw error;
    }
}

// Función para eliminar un perro
const removePerro = async (id) => {
    try {
        const deletedRows = await db('perro').where({ id }).del();
        return deletedRows;
    } catch (error) {
        console.error('Error al eliminar perro:', error);
        throw error;
    }
}

// Regla utilitaria: detecta si existe cita en ventana [hoy, hoy + 7 dias].
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