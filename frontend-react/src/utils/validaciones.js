// validaciones.js
// Reglas de validación del cliente, requeridas por el indicador IE1.2.1:
// mensajes específicos por campo, que impiden enviar datos incorrectos o
// incompletos, SIN alert() y SIN tocar el DOM.
//
// Son funciones puras: reciben el valor escrito y devuelven el mensaje de
// error, o texto vacío si el valor es válido. Por eso el formulario es el
// único dueño del estado y puede mostrar cada mensaje junto a su campo.
// (Puerto de frontend-html/js/validaciones.js, adaptado a React).

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^(\+?56)?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/;

/**
 * Valida un RUT chileno con su dígito verificador. Es una regla de negocio
 * real (el checkout identifica al cliente), no solo "campo obligatorio".
 */
export function rutValido(rutSucio) {
  const rut = String(rutSucio).replace(/[^0-9kK]/g, '').toUpperCase();
  if (rut.length < 2) return false;

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);

  return dv === dvEsperado;
}

export function formatoRut(rutSucio) {
  const rut = String(rutSucio).replace(/[^0-9kK]/g, '').toUpperCase();
  if (rut.length < 2) return rutSucio;
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
}

export function validarTexto(valor, minimo = 2) {
  const texto = String(valor ?? '').trim();
  if (texto.length === 0) return 'Este campo es obligatorio.';
  if (texto.length < minimo) return `Debe tener al menos ${minimo} caracteres.`;
  return '';
}

export function validarEmail(valor) {
  const texto = String(valor ?? '').trim();
  if (texto.length === 0) return 'Ingresa tu correo electrónico.';
  if (!REGEX_EMAIL.test(texto)) {
    return 'Ese correo no parece válido. Revisa que tenga el formato nombre@dominio.cl';
  }
  return '';
}

export function validarTelefono(valor) {
  const texto = String(valor ?? '').trim();
  if (texto.length === 0) return 'Ingresa un teléfono de contacto.';
  if (!REGEX_TELEFONO.test(texto)) {
    return 'Usa un celular chileno válido, por ejemplo +56 9 1234 5678.';
  }
  return '';
}

export function validarRut(valor) {
  const texto = String(valor ?? '').trim();
  if (texto.length === 0) return 'Ingresa tu RUT, con guión y dígito verificador.';
  if (!rutValido(texto)) {
    return 'El RUT ingresado no es válido. Revisa el número y el dígito verificador.';
  }
  return '';
}

export function validarSelect(valor) {
  if (!valor) return 'Selecciona una opción.';
  return '';
}

export function validarClave(valor) {
  const texto = String(valor ?? '');
  if (texto.length === 0) return 'Ingresa tu contraseña.';
  if (texto.length < 6) return 'Debe tener al menos 6 caracteres.';
  return '';
}
