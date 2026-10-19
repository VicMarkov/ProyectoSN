// Se ejecuta antes de cada archivo de prueba (vite.config.js → setupFiles).
// Carga las aserciones útiles de jest-dom: toBeInTheDocument,
// toBeDisabled, toHaveTextContent, etc.
import '@testing-library/jest-dom/vitest';

// Cada caso parte del mismo estado: sin sesión, sin carrito y con el título
// de la pestaña limpio, para que ningún caso dependa de otro.
beforeEach(() => {
  window.localStorage.clear();
  document.title = '';
});
