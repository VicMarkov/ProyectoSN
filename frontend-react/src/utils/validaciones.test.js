// Suite de las reglas de validación del cliente (funciones puras).
// Es el archivo que más fácil de probar del proyecto: recibe un valor y
// devuelve un mensaje, sin tocar el DOM ni el estado.
//
// IMPORTANTE (rúbrica Parcial 2): este archivo contiene el ÚNICO caso del
// proyecto que falla a propósito, para demostrar que Vitest detecta un
// error. Está marcado con [A PROPÓSITO] y NO debe corregirse.
import { describe, it, expect } from 'vitest';
import {
  rutValido,
  formatoRut,
  validarTexto,
  validarEmail,
  validarTelefono,
  validarRut,
  validarSelect,
  validarClave,
} from './validaciones';

describe('rutValido', () => {
  it('acepta un RUT chileno con dígito verificador correcto', () => {
    expect(rutValido('12.345.678-5')).toBe(true);
  });

  it('rechaza un RUT con dígito verificador equivocado', () => {
    expect(rutValido('12.345.678-9')).toBe(false);
  });

  it('rechaza un texto demasiado corto para ser un RUT', () => {
    expect(rutValido('1')).toBe(false);
  });

  // ---------------------------------------------------------------
  // CASO CON ERROR A PROPÓSITO — exigido por la rúbrica del Parcial 2.
  // Debe seguir FALLANDO: así se comprueba en la captura que Vitest
  // detecta errores. No corregir este expect.
  // ---------------------------------------------------------------
  it('[A PROPÓSITO] considera inválido el RUT 12.345.678-5', () => {
    expect(rutValido('12.345.678-5')).toBe(false); // en realidad es true → falla
  });
});

describe('formatoRut', () => {
  it('agrega puntos de miles y guión al dígito verificador', () => {
    expect(formatoRut('123456785')).toBe('12.345.678-5');
  });
});

describe('validarTexto', () => {
  it('marca como obligatorio el campo vacío', () => {
    expect(validarTexto('')).toBe('Este campo es obligatorio.');
  });

  it('marca como obligatorio el campo con solo espacios', () => {
    expect(validarTexto('   ')).toBe('Este campo es obligatorio.');
  });

  it('rechaza un texto más corto que el mínimo', () => {
    expect(validarTexto('a', 2)).toBe('Debe tener al menos 2 caracteres.');
  });

  it('devuelve texto vacío cuando el valor es válido', () => {
    expect(validarTexto('María', 2)).toBe('');
  });
});

describe('validarEmail', () => {
  it('pide el correo cuando está vacío', () => {
    expect(validarEmail('')).toBe('Ingresa tu correo electrónico.');
  });

  it('rechaza un correo sin formato', () => {
    expect(validarEmail('no-tiene-arroba')).toContain('no parece válido');
  });

  it('acepta un correo con formato correcto', () => {
    expect(validarEmail('demo@sonidovivo.cl')).toBe('');
  });
});

describe('validarTelefono', () => {
  it('pide el teléfono cuando está vacío', () => {
    expect(validarTelefono('')).toBe('Ingresa un teléfono de contacto.');
  });

  it('rechaza un número que no es celular chileno', () => {
    expect(validarTelefono('1234')).toContain('celular chileno');
  });

  it('acepta un celular con y sin +56', () => {
    expect(validarTelefono('+56 9 1234 5678')).toBe('');
    expect(validarTelefono('912345678')).toBe('');
  });
});

describe('validarRut', () => {
  it('pide el RUT cuando está vacío', () => {
    expect(validarRut('')).toContain('Ingresa tu RUT');
  });

  it('rechaza un RUT con dígito verificador incorrecto', () => {
    expect(validarRut('12.345.678-9')).toContain('no es válido');
  });

  it('acepta un RUT correcto', () => {
    expect(validarRut('12.345.678-5')).toBe('');
  });
});

describe('validarSelect', () => {
  it('rechaza la opción vacía del select', () => {
    expect(validarSelect('')).toBe('Selecciona una opción.');
  });

  it('acepta una opción elegida', () => {
    expect(validarSelect('stock')).toBe('');
  });
});

describe('validarClave', () => {
  it('pide la contraseña cuando está vacía', () => {
    expect(validarClave('')).toBe('Ingresa tu contraseña.');
  });

  it('exige al menos 6 caracteres', () => {
    expect(validarClave('abc')).toBe('Debe tener al menos 6 caracteres.');
  });

  it('acepta la clave de prueba del proyecto', () => {
    expect(validarClave('demo123')).toBe('');
  });
});
