// nav.js
// Controla el menú "hamburguesa" en pantallas angostas (< 720px).
// Se usa en las 4 páginas del sitio.

document.addEventListener('DOMContentLoaded', function () {
  const boton = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.main-nav');

  if (!boton || !menu) return;

  boton.addEventListener('click', function () {
    const abierto = menu.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });

  // Actualiza el contador de items del carrito en el ícono de navegación,
  // en cualquier página que incluya el elemento .nav-cart-count
  const contador = document.querySelector('.nav-cart-count');
  if (contador && window.SonidoVivoCarrito) {
    const carrito = window.SonidoVivoCarrito.obtenerCarrito();
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contador.textContent = totalItems;
  }
});
