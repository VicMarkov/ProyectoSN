// formato.js
// Formateo de números chilenos, compartido por catálogo, carrito y resumen.

export function formatoCLP(valor) {
  return '$' + Number(valor).toLocaleString('es-CL');
}
