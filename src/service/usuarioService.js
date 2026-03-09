// Capa de acceso/negocio para la entidad usuario.

const db = require('../configuration/database').db;
const { normalizeRol } = require('../utils/domainRules');

// Obtener todos los usuarios
const findAllUsuarios = async () => {
    try {
        const usuarios = await db('usuario').select('*');
        return usuarios;
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        throw error;
    }
};

// Busca un usuario para autenticacion basica.
// Nota: comparacion de password en texto plano; idealmente migrar a bcrypt.
const findUsuario = async (email, password) => {
    try {
        const usuario = await getUsuarioPorEmail(email);
        if (!usuario) {
            return null; // Usuario no encontrado
        }
        // Comparacion simple actual, mantenida por compatibilidad.
        if (usuario.password !== password) {
            return null; // Contraseña incorrecta
        }
        return usuario; // Retorna el usuario encontrado
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        throw error;
    }
};

// Función para crear un nuevo usuario
const addUsuario = async (usuario) => {
    try {
        const usuarioToSave = {
            ...usuario,
            rol: normalizeRol(usuario.rol)
        };

        const [id] = await db('usuario').insert(usuarioToSave);
        return id; // Retorna el ID del nuevo usuario 
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

// Función para obtener un usuario por su email 
const getUsuarioPorEmail = async (email) => {
    try {
        const usuario = await db('usuario').where({ email }).first();
        return usuario; // Retorna el usuario encontrado o undefined si no existe
    } catch (error) {
        console.error('Error al obtener usuario por email:', error);
        throw error;
    }
};

// Función para obtener un usuario por su ID 
const getUsuarioPorId = async (id) => {
    try {
        const usuario = await db('usuario').where({ id }).first();
        return usuario; // Retorna el usuario encontrado o undefined si no existe
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
    }
};

// Modificar un usuario por ID  
const modifyUsuario = async (id, usuario) => {
    try {
        const usuarioToUpdate = {
            ...usuario,
            rol: normalizeRol(usuario.rol)
        };

        const updatedRows = await db('usuario').where({ id }).update(usuarioToUpdate);
        return updatedRows;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
};

// Modificar la contraseña de un usuario 
const modifyPassword = async (id, newPassword) => {
    try {
        const updatedRows = await db('usuario').where({ id }).update({ password: newPassword });
        return updatedRows;
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        throw error;
    }
}

// Eliminar un usuario por ID 
const removeUsuario = async (id) => {
    try {
        const deletedRows = await db('usuario').where({ id }).del();
        return deletedRows;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
}

// Util para validaciones de relaciones y reglas de negocio. 
const userExisteById = async (id) => {
    try {
        const usuario = await db('usuario').where({ id }).first();
        return !!usuario; // Retorna true si el usuario existe, false si no 
    } catch (error) {
        console.error('Error al verificar existencia de usuario:', error);
        throw error;
    }
};


module.exports = {
    findAllUsuarios,
    findUsuario,
    addUsuario,
    getUsuarioPorEmail,
    getUsuarioPorId,
    modifyUsuario,
    modifyPassword,
    removeUsuario,
    userExisteById
};