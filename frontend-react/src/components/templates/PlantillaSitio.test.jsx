// Suite del template PlantillaSitio (navbar + contenido + pie, con router).
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlantillaSitio from './PlantillaSitio';
import { conProveedores, SondaRuta } from '../../test/helpers';

describe('PlantillaSitio', () => {
  it('dibuja el navbar, el contenido de la página y el pie', () => {
    conProveedores(
      <PlantillaSitio>
        <p>Contenido de la página</p>
      </PlantillaSitio>
    );
    expect(screen.getByAltText('Sonido Vivo')).toBeInTheDocument();
    expect(screen.getByText('Contenido de la página')).toBeInTheDocument();
    expect(screen.getByText('contacto@sonidovivo.cl')).toBeInTheDocument();
  });

  it('navega de verdad al hacer clic en un enlace del menú', async () => {
    const usuario = userEvent.setup();
    conProveedores(
      <>
        <PlantillaSitio>
          <p>Contenido de la página</p>
        </PlantillaSitio>
        <SondaRuta />
      </>
    );

    await usuario.click(screen.getAllByRole('link', { name: 'Catálogo' })[0]); // el primero es el del navbar

    expect(screen.getByTestId('sonda-ruta')).toHaveTextContent('/catalogo');
  });

  it('marca como activo el enlace de la ruta actual', () => {
    conProveedores(
      <PlantillaSitio>
        <p>Contenido</p>
      </PlantillaSitio>,
      '/catalogo'
    );
    expect(screen.getAllByRole('link', { name: 'Catálogo' })[0]).toHaveClass('active');
  });
});
