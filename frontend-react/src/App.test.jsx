// Suite de App: el mapa de rutas completo (humo + navegación real).
// App usa BrowserRouter (lee y cambia window.history), por eso hay que
// reiniciar la dirección antes de cada caso y envolverlo en los providers,
// igual que hace main.jsx.
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { SesionProvider } from './context/SesionContext';
import { CarritoProvider } from './context/CarritoContext';

function renderApp() {
  return render(
    <SesionProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </SesionProvider>
  );
}

describe('App', () => {
  beforeEach(() => {
    // BrowserRouter arranca siempre en la raíz, sin importar lo que dejó el caso anterior.
    window.history.pushState({}, '', '/');
  });

  it('dibuja la página de inicio en la dirección raíz', () => {
    renderApp();
    expect(
      screen.getByRole('heading', { name: 'Instrumentos y sonido para quienes viven de tocar.' })
    ).toBeInTheDocument();
  });

  it('navega del inicio al catálogo sin recargar', async () => {
    const usuario = userEvent.setup();
    renderApp();

    await usuario.click(screen.getAllByRole('link', { name: 'Catálogo' })[0]);

    expect(await screen.findByRole('heading', { name: 'Catálogo' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/catalogo');
  });

  it('muestra la página 404 en cualquier dirección desconocida', () => {
    window.history.pushState({}, '', '/ruta-que-no-existe');
    renderApp();
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
  });
});
