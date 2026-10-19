// Suite de la página Inicio.
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Inicio from './Inicio';
import { conProveedores, SondaRuta } from '../test/helpers';

describe('Inicio', () => {
  it('muestra el titular, las estadísticas y cambia el título de la pestaña', () => {
    conProveedores(<Inicio />);
    expect(
      screen.getByRole('heading', { name: 'Instrumentos y sonido para quienes viven de tocar.' })
    ).toBeInTheDocument();
    expect(screen.getByText('340')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(document.title).toBe('Inicio | Sonido Vivo');
  });

  it('navega al catálogo desde el botón del hero', async () => {
    const usuario = userEvent.setup();
    conProveedores(
      <>
        <Inicio />
        <SondaRuta />
      </>
    );

    await usuario.click(screen.getByRole('button', { name: 'Ver catálogo completo' }));

    expect(screen.getByTestId('sonda-ruta')).toHaveTextContent('/catalogo');
  });

  it('muestra los tres destacados de la tienda', () => {
    conProveedores(<Inicio />);
    expect(screen.getByText('Cuerdas y cuerpo')).toBeInTheDocument();
    expect(screen.getByText('Ritmo y teclas')).toBeInTheDocument();
    expect(screen.getByText('Sonido y estudio')).toBeInTheDocument();
  });
});
