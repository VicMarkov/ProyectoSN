// Suite de la página 404.
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoEncontrada from './NoEncontrada';
import { conProveedores, SondaRuta } from '../test/helpers';

describe('NoEncontrada', () => {
  it('muestra el error 404 con su explicación', () => {
    conProveedores(<NoEncontrada />);
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
    expect(
      screen.getByText('La página que buscas no existe o cambió de dirección.')
    ).toBeInTheDocument();
  });

  it('permite volver al catálogo desde el botón', async () => {
    const usuario = userEvent.setup();
    conProveedores(
      <>
        <NoEncontrada />
        <SondaRuta />
      </>
    );

    await usuario.click(screen.getByRole('button', { name: 'Ir al catálogo' }));

    expect(screen.getByTestId('sonda-ruta')).toHaveTextContent('/catalogo');
  });
});
