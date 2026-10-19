// Suite de la página Carrito (líneas, resumen y confirmación del pedido).
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Carrito from './Carrito';
import { conProveedores, sembrarCarrito, SondaRuta } from '../test/helpers';

describe('Carrito', () => {
  it('avisa que el carrito está vacío y permite ir al catálogo', async () => {
    const usuario = userEvent.setup();
    conProveedores(
      <>
        <Carrito />
        <SondaRuta />
      </>
    );

    expect(screen.getByText('Aún no has agregado productos.')).toBeInTheDocument();
    expect(document.title).toBe('Carrito | Sonido Vivo');

    await usuario.click(screen.getByRole('button', { name: 'Ir al catálogo' }));
    expect(screen.getByTestId('sonda-ruta')).toHaveTextContent('/catalogo');
  });

  it('muestra las líneas del carrito guardado y su resumen', () => {
    sembrarCarrito([{ codigo: 'GA001', cantidad: 2 }]);
    conProveedores(<Carrito />);

    expect(screen.getByText('Guitarra Acústica Folk')).toBeInTheDocument();
    // Con retiro, ese monto aparece 3 veces: total de la línea, subtotal y total.
    expect(screen.getAllByText('$259.980')).toHaveLength(3);
    expect(screen.getByText('Gratis (retiro en tienda)')).toBeInTheDocument();
  });

  it('aumenta la cantidad de una línea desde la página', async () => {
    const usuario = userEvent.setup();
    sembrarCarrito([{ codigo: 'GA001', cantidad: 2 }]);
    conProveedores(<Carrito />);

    await usuario.click(
      screen.getByRole('button', { name: 'Aumentar cantidad de Guitarra Acústica Folk' })
    );

    expect(screen.getByLabelText('Cantidad de Guitarra Acústica Folk')).toHaveValue(3);
  });

  it('quita una línea y vuelve al estado vacío', async () => {
    const usuario = userEvent.setup();
    sembrarCarrito([{ codigo: 'GA001', cantidad: 2 }]);
    conProveedores(<Carrito />);

    await usuario.click(screen.getByRole('button', { name: 'Quitar' }));

    expect(screen.getByText('Aún no has agregado productos.')).toBeInTheDocument();
  });

  it('cobra el despacho al elegirlo en el resumen', async () => {
    const usuario = userEvent.setup();
    sembrarCarrito([{ codigo: 'GA001', cantidad: 2 }]);
    conProveedores(<Carrito />);

    await usuario.click(screen.getByLabelText(/Despacho a domicilio/));

    expect(screen.getByText('$4.990')).toBeInTheDocument();
    expect(screen.getByText('$264.970')).toBeInTheDocument(); // total
  });

  it('confirma el pedido con datos válidos y vacía el carrito', async () => {
    const usuario = userEvent.setup();
    sembrarCarrito([{ codigo: 'GA001', cantidad: 2 }]);
    conProveedores(<Carrito />);

    await usuario.type(screen.getByLabelText('Nombre completo'), 'María Rojas');
    await usuario.type(screen.getByLabelText('RUT'), '123456785');
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'demo@sonidovivo.cl');
    await usuario.type(screen.getByLabelText('Teléfono'), '+56 9 1234 5678');
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(screen.getByText(/Pedido SV-\d+ confirmado a nombre de María Rojas/)).toBeInTheDocument();
    expect(screen.queryByText('Guitarra Acústica Folk')).not.toBeInTheDocument();
  });
});
