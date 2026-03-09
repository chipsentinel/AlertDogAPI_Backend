const { normalizeRol, sanitizePerroFilters, getDaysFromNow } = require('../../src/utils/domainRules');

describe('domainRules', () => {
  test('normalizeRol converts role variants to 0/1', () => {
    expect(normalizeRol('admin')).toBe(1);
    expect(normalizeRol('cliente')).toBe(0);
    expect(normalizeRol(true)).toBe(1);
    expect(normalizeRol('0')).toBe(0);
  });

  test('sanitizePerroFilters parses and trims query params', () => {
    const filters = sanitizePerroFilters({ id_usuario: '2', q: '  max ', raza: ' lab ' });
    expect(filters).toEqual({ id_usuario: 2, q: 'max', raza: 'lab' });
  });

  test('getDaysFromNow returns 0 for today and positive for future dates', () => {
    const today = new Date();
    expect(getDaysFromNow(today)).toBe(0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    expect(getDaysFromNow(tomorrow)).toBe(1);
  });
});
