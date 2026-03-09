// Utilidades puras de dominio para reglas reutilizables y testeables.

const normalizeRol = (rol) => {
    if (rol === undefined || rol === null) {
        return rol;
    }

    if (typeof rol === 'string') {
        const rolText = rol.trim().toLowerCase();
        if (rolText === 'admin') {
            return 1;
        }
        if (rolText === 'usuario' || rolText === 'cliente') {
            return 0;
        }
    }

    if (rol === true || rol === 1 || rol === '1') {
        return 1;
    }

    if (rol === false || rol === 0 || rol === '0') {
        return 0;
    }

    return rol;
};

const getDaysFromNow = (date) => {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffMs = targetMidnight - todayMidnight;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const sanitizePerroFilters = (query = {}) => {
    const filters = {};

    if (query.id_usuario !== undefined && query.id_usuario !== '') {
        const idUsuario = Number(query.id_usuario);
        if (!Number.isNaN(idUsuario)) {
            filters.id_usuario = idUsuario;
        }
    }

    if (query.raza) {
        filters.raza = String(query.raza).trim();
    }

    if (query.q) {
        filters.q = String(query.q).trim();
    }

    return filters;
};

module.exports = {
    normalizeRol,
    getDaysFromNow,
    sanitizePerroFilters
};
