// Suite de la página Contacto (formulario + confirmación).
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from './Contacto';
import { conProveedores } from '../test/helpers';

describe('Contacto', () => {
  it('muestra el título, el formulario y los datos de contacto', () => {
    conProveedores(<Contacto />);
    expect(screen.getByRole('heading', { name: 'Escríbenos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeInTheDocument();
    // El correo aparece en la tarjeta de contacto y también en el pie.
    expect(screen.getAllByText('contacto@sonidovivo.cl').length).toBeGreaterThanOrEqual(1);
    expect(document.title).toBe('Contacto | Sonido Vivo');
  });

  it('muestra errores al enviar el formulario vacío', async () => {
    const usuario = userEvent.setup();
    conProveedores(<Contacto />);

    await usuario.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect(screen.getAllByText('Este campo es obligatorio.')).toHaveLength(2);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('muestra la confirmación personalizada con los datos enviados', async () => {
    const usuario = userEvent.setup();
    conProveedores(<Contacto />);

    await usuario.type(screen.getByLabelText('Nombre'), 'María Rojas');
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'demo@sonidovivo.cl');
    await usuario.type(screen.getByLabelText('Teléfono'), '+56 9 1234 5678');
    await usuario.selectOptions(screen.getByLabelText('Motivo de tu consulta'), 'stock');
    await usuario.type(
      screen.getByLabelText('Mensaje'),
      'Hola equipo, ¿tienen stock de cuerdas este viernes?'
    );
    await usuario.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect(
      screen.getByText(/Gracias, María Rojas\. Recibimos tu consulta sobre "Disponibilidad de un producto"/)
    ).toBeInTheDocument();
  });
});
