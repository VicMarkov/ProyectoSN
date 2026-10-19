// Suite del template LayoutAutenticacion (pantallas de login).
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LayoutAutenticacion from './LayoutAutenticacion';
import { conRouter, SondaRuta } from '../../test/helpers';

describe('LayoutAutenticacion', () => {
  it('muestra el panel de marca y el contenido (children)', () => {
    conRouter(
      <LayoutAutenticacion>
        <p>Formulario de ingreso</p>
      </LayoutAutenticacion>
    );
    expect(screen.getByRole('heading', { name: 'Sonido Vivo' })).toBeInTheDocument();
    expect(screen.getByText('Formulario de ingreso')).toBeInTheDocument();
  });

  it('vuelve al inicio al hacer clic en el enlace de regreso', async () => {
    const usuario = userEvent.setup();
    conRouter(
      <>
        <LayoutAutenticacion>
          <p>Formulario de ingreso</p>
        </LayoutAutenticacion>
        <SondaRuta />
      </>,
      '/login'
    );

    await usuario.click(screen.getByText('← Volver al inicio'));

    expect(screen.getByTestId('sonda-ruta')).toHaveTextContent('/');
  });
});
