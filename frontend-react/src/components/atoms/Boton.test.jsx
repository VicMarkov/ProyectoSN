// Suite del átomo Boton.
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Boton from './Boton';

describe('Boton', () => {
  it('muestra el texto que recibe', () => {
    render(<Boton texto="Agregar al carrito" />);
    expect(screen.getByRole('button', { name: 'Agregar al carrito' })).toBeInTheDocument();
  });

  it('se deshabilita y muestra el spinner mientras carga', () => {
    render(<Boton texto="Iniciar sesión" cargando />);
    expect(screen.getByText('Ingresando...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('avisa con onClick cuando se presiona', async () => {
    const usuario = userEvent.setup();
    const manejarClick = vi.fn();
    render(<Boton texto="Agregar" onClick={manejarClick} />);

    await usuario.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(manejarClick).toHaveBeenCalledTimes(1);
  });

  it('es un botón button por defecto y submit cuando se lo piden', () => {
    const { rerender } = render(<Boton texto="Enviar" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');

    rerender(<Boton texto="Enviar" tipo="submit" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
