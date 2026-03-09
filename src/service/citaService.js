// Capa de acceso/negocio para la entidad cita.

const db = require('../configuration/database').db;

// Obtener todas las citas
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

// Crea una cita aplicando reglas de negocio de obligatoriedad y unicidad.
const addCita = async (cita) => {
    try {
        const { fecha, hora, id_perro } = cita;

        if (!fecha || !hora || !id_perro) {
            const businessError = new Error('fecha, hora e id_perro son obligatorios');
            businessError.code = 'CITA_INVALIDA';
            throw businessError;
        }

        // Validacion preventiva para devolver error de negocio claro.
        const citaExistente = await db('cita').where({ fecha, hora, id_perro }).first();
        if (citaExistente) {
            const businessError = new Error('Ese perro ya tiene una cita en esa fecha y hora');
            businessError.code = 'CITA_DUPLICADA';
            throw businessError;
        }

        const [id] = await db('cita').insert(cita);
        return id; // Retorna el ID de la nueva cita
    } catch (error) {
        // Respaldo ante condiciones de carrera: captura duplicado al nivel SQL.
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

// Actualiza cita conservando valores actuales cuando llegan updates parciales.
const modifyCita = async (id, citaData) => {
    try {
        const citaActual = await db('cita').where({ id }).first();
        if (!citaActual) {
            return 0;
        }

        const fecha = citaData.fecha || citaActual.fecha;
        const hora = citaData.hora || citaActual.hora;
        const id_perro = citaData.id_perro || citaActual.id_perro;

        // Evita colisionar con otra cita distinta al registro actual.
        const citaExistente = await db('cita')
            .where({ fecha, hora, id_perro })
            .whereNot({ id })
            .first();

        if (citaExistente) {
            const businessError = new Error('Ese perro ya tiene una cita en esa fecha y hora');
            businessError.code = 'CITA_DUPLICADA';
            throw businessError;
        }

        const updatedRows = await db('cita').where({ id }).update(citaData);
        return updatedRows;
    } catch (error) {
        // Respaldo ante condiciones de carrera o constraints de BD.
        if (error && error.code === 'ER_DUP_ENTRY') {
            const businessError = new Error('Ese perro ya tiene una cita en esa fecha y hora');
            businessError.code = 'CITA_DUPLICADA';
            throw businessError;
        }
        console.error('Error al actualizar cita:', error);
        throw error;
    }
};

// Eliminar una cita por ID
const removeCita = async (id) => {
    try {
        const deletedRows = await db('cita').where({ id }).del();
        return deletedRows;
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