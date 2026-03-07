// 2.1 Crear el servicio para manejar la lógica de negocio relacionada con los usuarios

const db = require('../config/database').db;
const {get} = require('../config/database').db;
const {getDaysFromNow} = require('./usuarioService');

// Función para obtener todos los usuarios (opcional, no implementada en el controlador)
const findAllUsuarios = async () => {
    try {
        const usuarios = await db('usuarios').select('*');
        return usuarios;
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        throw error;
    }
};1

// Función para buscar un usuario por su email y contraseña (para autenticación)
const findUsuario = async (email, password) => {
    try {
        const usuario = await getUsuarioPorEmail(email);
        if (!usuario) {
            return null; // Usuario no encontrado
        }
        // Aquí podríamos agregar lógica para verificar la contraseña, por ejemplo usando bcrypt
        if (usuario.password !== password) {
            return null; // Contraseña incorrecta
        }
        return usuario; // Retorna el usuario encontrado
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        throw error;
    }
};

// Función para agregar un nuevo usuario
const addUsuario = async (usuario) => {
    try {
        const [id] = await db('usuarios').insert(usuario);
        return id; // Retorna el ID del nuevo usuario
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

// Función para obtener un usuario por su email
const getUsuarioPorEmail = async (email) => {
    try {
        const usuario = await db('usuarios').where({ email }).first();
        return usuario; // Retorna el usuario encontrado o undefined si no existe
    } catch (error) {
        console.error('Error al obtener usuario por email:', error);
        throw error;
    }
};

// Función para obtener un usuario por su ID
const getUsuarioPorId = async (id) => {
    try {
        const usuario = await db('usuarios').where({ id }).first();
        return usuario; // Retorna el usuario encontrado o undefined si no existe
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
    }
};

// Función para modificar un usuario (opcional, no implementada en el controlador)
const modifyUsuario = async (id, usuario) => {
    try {
        await db('usuarios').where({ id }).update(usuario);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
};

// Función para modificar la contraseña de un usuario (opcional, no implementada en el controlador)
const modifyPassword = async (id, newPassword) => {
    try {
        await db('usuarios').where({ id }).update({ password: newPassword });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        throw error;
    }
}

// Función para eliminar un usuario (opcional, no implementada en el controlador)
const removeUsuario = async (id) => {
    try {
        await db('usuarios').where({ id }).del();
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
}

// Función para verificar si un usuario existe por su id
const userExisteById = async (id) => {
    try {
        const usuario = await db('usuarios').where({ id }).first();
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