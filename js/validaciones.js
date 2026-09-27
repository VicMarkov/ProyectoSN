// validaciones.js
// Validación de formularios en el cliente, requerida por el indicador IE1.2.1:
// mensajes de error específicos, mostrados en el contexto del campo, con
// sugerencias, y que impiden el envío de datos incorrectos o incompletos.
// Se usa en contacto.html (formulario de consulta) y en carrito.html
// (formulario de despacho / retiro del pedido).

/**
 * Valida un RUT chileno con su dígito verificador.
 * Se incluye porque el checkout pide identificar al cliente y es una regla
 * de negocio real y verificable, no solo "campo obligatorio".
 */
function rutValido(rutSucio) {
  const rut = rutSucio.replace(/[^0-9kK]/g, '').toUpperCase();
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

function formatoRut(rutSucio) {
  const rut = rutSucio.replace(/[^0-9kK]/g, '').toUpperCase();
  if (rut.length < 2) return rutSucio;
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^(\+?56)?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/;

/**
 * Marca un campo como válido o inválido y escribe el mensaje de error
 * en el <span class="mensaje-error"> asociado (debe ir inmediatamente
 * después del input dentro del mismo .campo-form).
 */
function marcarCampo(contenedor, esValido, mensaje) {
  const spanError = contenedor.querySelector('.mensaje-error');
  contenedor.classList.toggle('invalido', !esValido);
  contenedor.classList.toggle('valido', esValido);
  if (spanError) spanError.textContent = esValido ? '' : mensaje;
  return esValido;
}

function validarTexto(input, minimo) {
  const contenedor = input.closest('.campo-form');
  const valor = input.value.trim();
  if (valor.length === 0) {
    return marcarCampo(contenedor, false, 'Este campo es obligatorio.');
  }
  if (valor.length < minimo) {
    return marcarCampo(contenedor, false, 'Debe tener al menos ' + minimo + ' caracteres.');
  }
  return marcarCampo(contenedor, true, '');
}

function validarEmail(input) {
  const contenedor = input.closest('.campo-form');
  const valor = input.value.trim();
  if (valor.length === 0) {
    return marcarCampo(contenedor, false, 'Ingresa tu correo electrónico.');
  }
  if (!REGEX_EMAIL.test(valor)) {
    return marcarCampo(contenedor, false, 'Ese correo no parece válido. Revisa que tenga el formato nombre@dominio.cl');
  }
  return marcarCampo(contenedor, true, '');
}

function validarTelefono(input) {
  const contenedor = input.closest('.campo-form');
  const valor = input.value.trim();
  if (valor.length === 0) {
    return marcarCampo(contenedor, false, 'Ingresa un teléfono de contacto.');
  }
  if (!REGEX_TELEFONO.test(valor)) {
    return marcarCampo(contenedor, false, 'Usa un celular chileno válido, por ejemplo +56 9 1234 5678.');
  }
  return marcarCampo(contenedor, true, '');
}

function validarRut(input) {
  const contenedor = input.closest('.campo-form');
  const valor = input.value.trim();
  if (valor.length === 0) {
    return marcarCampo(contenedor, false, 'Ingresa tu RUT, con guión y dígito verificador.');
  }
  if (!rutValido(valor)) {
    return marcarCampo(contenedor, false, 'El RUT ingresado no es válido. Revisa el número y el dígito verificador.');
  }
  input.value = formatoRut(valor);
  return marcarCampo(contenedor, true, '');
}

function validarSelect(input) {
  const contenedor = input.closest('.campo-form');
  if (!input.value) {
    return marcarCampo(contenedor, false, 'Selecciona una opción.');
  }
  return marcarCampo(contenedor, true, '');
}

// ---------------------------------------------------------
// Formulario de contacto (contacto.html)
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const formContacto = document.getElementById('form-contacto');
  if (!formContacto) return;

  const nombre = formContacto.querySelector('#contacto-nombre');
  const email = formContacto.querySelector('#contacto-email');
  const telefono = formContacto.querySelector('#contacto-telefono');
  const motivo = formContacto.querySelector('#contacto-motivo');
  const mensaje = formContacto.querySelector('#contacto-mensaje');
  const confirmacion = document.getElementById('contacto-confirmacion');

  nombre.addEventListener('blur', function () { validarTexto(nombre, 2); });
  email.addEventListener('blur', function () { validarEmail(email); });
  telefono.addEventListener('blur', function () { validarTelefono(telefono); });
  motivo.addEventListener('change', function () { validarSelect(motivo); });
  mensaje.addEventListener('blur', function () { validarTexto(mensaje, 10); });

  formContacto.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const valido = [
      validarTexto(nombre, 2),
      validarEmail(email),
      validarTelefono(telefono),
      validarSelect(motivo),
      validarTexto(mensaje, 10)
    ].every(Boolean);

    if (!valido) {
      confirmacion.classList.remove('mostrar');
      return;
    }

    // No hay backend todavía: se simula el envío y se muestra confirmación.
    confirmacion.textContent = 'Gracias, ' + nombre.value.trim() + '. Recibimos tu consulta sobre "' +
      motivo.options[motivo.selectedIndex].text + '" y te responderemos a ' + email.value.trim() + '.';
    confirmacion.classList.add('mostrar');
    formContacto.reset();
    formContacto.querySelectorAll('.campo-form').forEach(function (c) {
      c.classList.remove('valido', 'invalido');
    });
  });
});

// ---------------------------------------------------------
// Formulario de checkout / datos de entrega (carrito.html)
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const formCheckout = document.getElementById('form-checkout');
  if (!formCheckout) return;

  const nombre = formCheckout.querySelector('#checkout-nombre');
  const rut = formCheckout.querySelector('#checkout-rut');
  const email = formCheckout.querySelector('#checkout-email');
  const telefono = formCheckout.querySelector('#checkout-telefono');
  const direccion = formCheckout.querySelector('#checkout-direccion');
  const confirmacion = document.getElementById('checkout-confirmacion');

  nombre.addEventListener('blur', function () { validarTexto(nombre, 2); });
  rut.addEventListener('blur', function () { validarRut(rut); });
  email.addEventListener('blur', function () { validarEmail(email); });
  telefono.addEventListener('blur', function () { validarTelefono(telefono); });

  function entregaEsDespacho() {
    const seleccion = formCheckout.querySelector('input[name="entrega"]:checked');
    return seleccion && seleccion.value === 'despacho';
  }

  if (direccion) {
    direccion.addEventListener('blur', function () {
      if (entregaEsDespacho()) validarTexto(direccion, 8);
    });
  }

  formCheckout.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const carrito = window.SonidoVivoCarrito ? window.SonidoVivoCarrito.obtenerCarrito() : [];
    if (carrito.length === 0) {
      confirmacion.textContent = 'Tu carrito está vacío. Agrega productos desde el catálogo antes de confirmar el pedido.';
      confirmacion.classList.add('mostrar');
      return;
    }

    const validaciones = [
      validarTexto(nombre, 2),
      validarRut(rut),
      validarEmail(email),
      validarTelefono(telefono)
    ];

    if (entregaEsDespacho() && direccion) {
      validaciones.push(validarTexto(direccion, 8));
    }

    const valido = validaciones.every(Boolean);
    if (!valido) {
      confirmacion.classList.remove('mostrar');
      return;
    }

    const numeroPedido = 'SV-' + Math.floor(100000 + Math.random() * 900000);
    confirmacion.textContent = 'Pedido ' + numeroPedido + ' confirmado a nombre de ' + nombre.value.trim() +
      '. Te avisaremos por correo (' + email.value.trim() + ') el estado de preparación y despacho.';
    confirmacion.classList.add('mostrar');

    window.SonidoVivoCarrito.vaciarCarrito();
    setTimeout(function () { window.location.reload(); }, 2500);
  });
});
