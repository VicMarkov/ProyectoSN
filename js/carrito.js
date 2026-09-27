// carrito.js
// Simula, en el navegador, el flujo de pedido descrito en la Sección 4 del
// documento de negocio: el cliente agrega productos, ve un resumen y elige
// despacho o retiro en tienda. Se guarda en localStorage porque en esta etapa
// del proyecto (Evaluación Parcial 1) no existe backend ni base de datos.

const CLAVE_CARRITO = 'sonidovivo_carrito';

function obtenerCarrito() {
  try {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.warn('No se pudo leer el carrito guardado:', error);
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarProducto(codigo, cantidad) {
  cantidad = cantidad || 1;
  const producto = PRODUCTOS.find(function (p) { return p.codigo === codigo; });
  if (!producto) return;

  const carrito = obtenerCarrito();
  const existente = carrito.find(function (item) { return item.codigo === codigo; });

  if (existente) {
    existente.cantidad = Math.min(existente.cantidad + cantidad, producto.stock);
  } else {
    carrito.push({ codigo: codigo, cantidad: Math.min(cantidad, producto.stock) });
  }

  guardarCarrito(carrito);
  return carrito;
}

function actualizarCantidad(codigo, cantidad) {
  const producto = PRODUCTOS.find(function (p) { return p.codigo === codigo; });
  let carrito = obtenerCarrito();

  cantidad = Math.max(1, Math.min(cantidad, producto ? producto.stock : cantidad));

  carrito = carrito.map(function (item) {
    if (item.codigo === codigo) {
      return Object.assign({}, item, { cantidad: cantidad });
    }
    return item;
  });

  guardarCarrito(carrito);
  return carrito;
}

function quitarProducto(codigo) {
  const carrito = obtenerCarrito().filter(function (item) { return item.codigo !== codigo; });
  guardarCarrito(carrito);
  return carrito;
}

function vaciarCarrito() {
  guardarCarrito([]);
}

function calcularTotales(carrito) {
  let subtotal = 0;
  let cantidadItems = 0;

  carrito.forEach(function (item) {
    const producto = PRODUCTOS.find(function (p) { return p.codigo === item.codigo; });
    if (producto) {
      subtotal += producto.precio * item.cantidad;
      cantidadItems += item.cantidad;
    }
  });

  return { subtotal: subtotal, cantidadItems: cantidadItems };
}

function formatoCLP(valor) {
  return '$' + valor.toLocaleString('es-CL');
}

// API pública reutilizada por catalogo.js y nav.js
window.SonidoVivoCarrito = {
  obtenerCarrito: obtenerCarrito,
  agregarProducto: agregarProducto,
  actualizarCantidad: actualizarCantidad,
  quitarProducto: quitarProducto,
  vaciarCarrito: vaciarCarrito,
  calcularTotales: calcularTotales,
  formatoCLP: formatoCLP
};

// ---------------------------------------------------------
// Render específico de carrito.html
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const lista = document.getElementById('lista-carrito');
  if (!lista) return; // esta página no es carrito.html

  const vacioEl = document.getElementById('carrito-vacio');
  const resumenEl = document.getElementById('resumen-carrito');
  const costoDespachoInput = document.querySelector('input[name="entrega"]');

  function costoDespachoActual() {
    const seleccion = document.querySelector('input[name="entrega"]:checked');
    return seleccion && seleccion.value === 'despacho' ? 4990 : 0;
  }

  function render() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
      lista.innerHTML = '';
      vacioEl.style.display = 'block';
      resumenEl.style.display = 'none';
      return;
    }

    vacioEl.style.display = 'none';
    resumenEl.style.display = 'block';

    lista.innerHTML = carrito.map(function (item) {
      const producto = PRODUCTOS.find(function (p) { return p.codigo === item.codigo; });
      if (!producto) return '';

      return (
        '<div class="linea-carrito" data-codigo="' + producto.codigo + '">' +
          '<div>' +
            '<div class="linea-nombre">' + producto.nombre + '</div>' +
            '<div class="linea-meta">' + producto.marca + ' ' + producto.modelo + ' &middot; ' + formatoCLP(producto.precio) + ' c/u</div>' +
          '</div>' +
          '<div class="cant-control">' +
            '<button type="button" class="restar" aria-label="Disminuir cantidad">&minus;</button>' +
            '<input type="number" min="1" max="' + producto.stock + '" value="' + item.cantidad + '" aria-label="Cantidad de ' + producto.nombre + '">' +
            '<button type="button" class="sumar" aria-label="Aumentar cantidad">+</button>' +
          '</div>' +
          '<div class="linea-meta">' + formatoCLP(producto.precio * item.cantidad) + '</div>' +
          '<button type="button" class="quitar-item">Quitar</button>' +
        '</div>'
      );
    }).join('');

    const totales = calcularTotales(carrito);
    const despacho = costoDespachoActual();

    document.getElementById('resumen-cantidad').textContent = totales.cantidadItems;
    document.getElementById('resumen-subtotal').textContent = formatoCLP(totales.subtotal);
    document.getElementById('resumen-despacho').textContent = despacho === 0 ? 'Gratis (retiro en tienda)' : formatoCLP(despacho);
    document.getElementById('resumen-total').textContent = formatoCLP(totales.subtotal + despacho);
  }

  lista.addEventListener('click', function (evento) {
    const linea = evento.target.closest('.linea-carrito');
    if (!linea) return;
    const codigo = linea.dataset.codigo;

    if (evento.target.classList.contains('quitar-item')) {
      quitarProducto(codigo);
      render();
    }

    if (evento.target.classList.contains('sumar') || evento.target.classList.contains('restar')) {
      const input = linea.querySelector('input[type="number"]');
      let nuevaCantidad = parseInt(input.value, 10) || 1;
      nuevaCantidad += evento.target.classList.contains('sumar') ? 1 : -1;
      if (nuevaCantidad < 1) {
        quitarProducto(codigo);
      } else {
        actualizarCantidad(codigo, nuevaCantidad);
      }
      render();
    }
  });

  lista.addEventListener('change', function (evento) {
    if (evento.target.type !== 'number') return;
    const linea = evento.target.closest('.linea-carrito');
    const codigo = linea.dataset.codigo;
    const nuevaCantidad = parseInt(evento.target.value, 10) || 1;
    actualizarCantidad(codigo, nuevaCantidad);
    render();
  });

  document.querySelectorAll('input[name="entrega"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      document.querySelectorAll('.opcion-entrega').forEach(function (op) {
        op.classList.toggle('activa', op.querySelector('input').checked);
      });
      render();
    });
  });

  render();
});
