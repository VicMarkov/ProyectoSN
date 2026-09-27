// catalogo.js
// Resuelve el problema descrito en la Sección 3.3 del documento de negocio:
// "no existe catálogo actualizado que el cliente pueda consultar por su cuenta".
// Renderiza los productos de PRODUCTOS (js/productos.js), permite filtrar por
// categoría y buscar por nombre o marca.

document.addEventListener('DOMContentLoaded', function () {
  const grilla = document.getElementById('grilla-productos');
  if (!grilla) return; // esta página no es catalogo.html

  const selectCategoria = document.getElementById('filtro-categoria');
  const inputBuscar = document.getElementById('filtro-buscar');
  const infoResultado = document.getElementById('resultado-info');

  function llenarCategorias() {
    const categorias = Array.from(new Set(PRODUCTOS.map(function (p) { return p.categoria; }))).sort();
    categorias.forEach(function (categoria) {
      const opcion = document.createElement('option');
      opcion.value = categoria;
      opcion.textContent = categoria;
      selectCategoria.appendChild(opcion);
    });
  }

  function etiquetaStock(producto) {
    if (producto.stock === 0) return '<span class="producto-tag agotado">Sin stock</span>';
    if (producto.stock <= 3) return '<span class="producto-tag bajo-stock">Últimas ' + producto.stock + '</span>';
    return '';
  }

  function tarjetaProducto(producto) {
    const deshabilitado = producto.stock === 0 ? 'disabled' : '';
    return (
      '<article class="producto-card">' +
        etiquetaStock(producto) +
        '<div class="producto-body">' +
          '<span class="producto-categoria">' + producto.categoria + '</span>' +
          '<h3 class="producto-nombre">' + producto.nombre + '</h3>' +
          '<span class="producto-marca">' + producto.marca + ' &middot; ' + producto.modelo + '</span>' +
          '<p class="producto-desc">' + producto.descripcion + '</p>' +
          '<span class="producto-precio">' + window.SonidoVivoCarrito.formatoCLP(producto.precio) + '</span>' +
          '<span class="producto-stock">Stock disponible: ' + producto.stock + ' unidades</span>' +
        '</div>' +
        '<div class="producto-footer">' +
          '<button type="button" class="btn agregar-carrito" data-codigo="' + producto.codigo + '" ' + deshabilitado + '>' +
            (producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito') +
          '</button>' +
        '</div>' +
      '</article>'
    );
  }

  function render() {
    const categoria = selectCategoria.value;
    const termino = inputBuscar.value.trim().toLowerCase();

    const filtrados = PRODUCTOS.filter(function (producto) {
      const coincideCategoria = categoria === 'todas' || producto.categoria === categoria;
      const coincideTexto = !termino ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.marca.toLowerCase().includes(termino) ||
        producto.modelo.toLowerCase().includes(termino);
      return coincideCategoria && coincideTexto;
    });

    infoResultado.textContent = filtrados.length + ' producto(s) encontrados de 340 referencias totales del catálogo.';

    grilla.innerHTML = filtrados.length
      ? filtrados.map(tarjetaProducto).join('')
      : '<p class="sin-resultados">No encontramos productos con ese filtro. Prueba con otra categoría o término de búsqueda.</p>';
  }

  grilla.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.agregar-carrito');
    if (!boton || boton.disabled) return;

    window.SonidoVivoCarrito.agregarProducto(boton.dataset.codigo, 1);

    boton.textContent = 'Agregado ✓';
    boton.classList.add('btn-secundario');
    setTimeout(function () {
      boton.textContent = 'Agregar al carrito';
      boton.classList.remove('btn-secundario');
    }, 1200);

    const contador = document.querySelector('.nav-cart-count');
    if (contador) {
      const carrito = window.SonidoVivoCarrito.obtenerCarrito();
      contador.textContent = carrito.reduce(function (acc, item) { return acc + item.cantidad; }, 0);
    }
  });

  selectCategoria.addEventListener('change', render);
  inputBuscar.addEventListener('input', render);

  llenarCategorias();
  render();
});
