// Suite de la molécula LineaCarrito (una fila del carrito).
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LineaCarrito from './LineaCarrito';

const producto = {
  codigo: 'GA001',
  nombre: 'Fender Player II Stratocaster',
  marca: 'Fender',
  modelo: 'Stratocaster',
  precio: 129990,
  stock: 8,
};

describe('LineaCarrito', () => {
  it('muestra nombre, precio unitario y total de la línea', () => {
    render(
      <LineaCarrito producto={producto} cantidad={2} onCambiarCantidad={() => {}} onQuitar={() => {}} />
    );
    expect(screen.getByText('Fender Player II Stratocaster')).toBeInTheDocument();
    expect(screen.getByText(/\$129\.990 c\/u/)).toBeInTheDocument();
    expect(screen.getByText('$259.980')).toBeInTheDocument();
  });

  it('pide cambiar la cantidad con el botón +', async () => {
    const usuario = userEvent.setup();
    const cambiarCantidad = vi.fn();
    render(
      <LineaCarrito
        producto={producto}
        cantidad={2}
        onCambiarCantidad={cambiarCantidad}
        onQuitar={() => {}}
      />
    );

    await usuario.click(screen.getByRole('button', { name: 'Aumentar cantidad de Fender Player II Stratocaster' }));

    expect(cambiarCantidad).toHaveBeenCalledWith(3);
  });

  it('pide cambiar la cantidad con el botón −', async () => {
    const usuario = userEvent.setup();
    const cambiarCantidad = vi.fn();
    render(
      <LineaCarrito
        producto={producto}
        cantidad={2}
        onCambiarCantidad={cambiarCantidad}
        onQuitar={() => {}}
      />
    );

    await usuario.click(screen.getByRole('button', { name: 'Disminuir cantidad de Fender Player II Stratocaster' }));

    expect(cambiarCantidad).toHaveBeenCalledWith(1);
  });

  it('interpreta la cantidad escrita en el input (y el vacío vuelve a 1)', () => {
    const cambiarCantidad = vi.fn();
    render(
      <LineaCarrito
        producto={producto}
        cantidad={2}
        onCambiarCantidad={cambiarCantidad}
        onQuitar={() => {}}
      />
    );
    const input = screen.getByLabelText('Cantidad de Fender Player II Stratocaster');

    // Un input type=number no permite seleccionar el texto para reemplazarlo,
    // así que el cambio se dispara directamente, como haría el navegador.
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(cambiarCantidad).toHaveBeenNthCalledWith(1, 5);
    expect(cambiarCantidad).toHaveBeenNthCalledWith(2, 1);
  });

  it('avisa al quitar la línea', async () => {
    const usuario = userEvent.setup();
    const quitar = vi.fn();
    render(
      <LineaCarrito producto={producto} cantidad={2} onCambiarCantidad={() => {}} onQuitar={quitar} />
    );

    await usuario.click(screen.getByRole('button', { name: 'Quitar' }));

    expect(quitar).toHaveBeenCalledTimes(1);
  });
});
