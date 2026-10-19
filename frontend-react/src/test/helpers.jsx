// Ayuda compartida por las pruebas: wrappers con los providers del proyecto
// y con el router, más pequeñas sondas para comprobar la dirección actual.
// No es una prueba (no termina en .test) y queda fuera de la cobertura.
import { render } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { SesionProvider } from '../context/SesionContext';
import { CarritoProvider } from '../context/CarritoContext';

// Claves de localStorage usadas por los contextos.
export const CLAVE_CARRITO = 'sonidovivo_carrito';
export const CLAVE_SESION = 'sonidovivo_sesion';

// Renderiza con los dos providers (sesión y carrito), como en main.jsx.
export function conProveedores(ui, rutaInicial = '/') {
  return render(
    <MemoryRouter initialEntries={[rutaInicial]}>
      <SesionProvider>
        <CarritoProvider>{ui}</CarritoProvider>
      </SesionProvider>
    </MemoryRouter>
  );
}

// Renderiza solo con el router (para componentes que no usan contextos).
export function conRouter(ui, rutaInicial = '/') {
  return render(<MemoryRouter initialEntries={[rutaInicial]}>{ui}</MemoryRouter>);
}

// Sonda: muestra la dirección actual para poder asertar que se navegó.
export function SondaRuta() {
  const location = useLocation();
  return <div data-testid="sonda-ruta">{location.pathname}</div>;
}

// Semillas de localStorage para probar estados guardados de forma determinista.
export function sembrarCarrito(items) {
  window.localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
}

export function sembrarSesion(email) {
  window.localStorage.setItem(CLAVE_SESION, JSON.stringify({ email }));
}
