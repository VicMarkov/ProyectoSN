// Suite del organismo Navbar (menú, carrito y sesión).
// Recibe la navegación por props (onNavegar), así que no necesita router.
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import { conProveedores, sembrarCarrito, sembrarSesion } from '../../test/helpers';

function renderNavbar(props = {}) {
  const onNavegar = vi.fn();
  conProveedores(<Navbar onNavegar={onNavegar} rutaActual="/" {...props} />);
  return { onNavegar };
}

describe('Navbar', () => {
  it('muestra la marca y los cuatro enlaces del menú', () => {
    renderNavbar();
    expect(screen.getByAltText('Sonido Vivo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Catálogo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeInTheDocument();
  });

  it('avisa con onNavegar al hacer clic en un enlace', async () => {
    const usuario = userEvent.setup();
    const { onNavegar } = renderNavbar();

    await usuario.click(screen.getByRole('link', { name: 'Catálogo' }));

    expect(onNavegar).toHaveBeenCalledWith('/catalogo');
  });

  it('muestra el contador del carrito cuando hay productos', () => {
    sembrarCarrito([
      { codigo: 'GA001', cantidad: 2 },
      { codigo: 'GA004', cantidad: 1 },
    ]);
    renderNavbar();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('muestra "Iniciar sesión" cuando no hay sesión', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('muestra el correo y permite cerrar sesión cuando hay sesión', async () => {
    const usuario = userEvent.setup();
    sembrarSesion('demo@sonidovivo.cl');
    const { onNavegar } = renderNavbar();

    expect(screen.getByText('demo@sonidovivo.cl')).toBeInTheDocument();

    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    expect(screen.queryByText('demo@sonidovivo.cl')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument();
    expect(onNavegar).toHaveBeenCalledWith('/');
  });
});
