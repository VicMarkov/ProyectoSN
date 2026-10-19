// Suite de la molécula TarjetaProducto (catálogo).
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TarjetaProducto from './TarjetaProducto';

// Doble de producto: no depende de data/productos.js.
const producto = {
  codigo: 'GA001',
  categoria: 'Guitarras',
  nombre: 'Fender Player II Stratocaster',
  marca: 'Fender',
  modelo: 'Stratocaster',
  descripcion: 'Guitarra eléctrica con alma clásica y ataque brillante.',
  precio: 129990,
  stock: 8,
};

describe('TarjetaProducto', () => {
  it('muestra los datos principales del producto', () => {
    render(<TarjetaProducto producto={producto} onAgregar={() => {}} />);
    expect(screen.getByText('Fender Player II Stratocaster')).toBeInTheDocument();
    expect(screen.getByText('$129.990')).toBeInTheDocument();
    expect(screen.getByText(/Stock disponible: 8 unidades/)).toBeInTheDocument();
  });

  it('avisa con el código del producto al agregarlo al carrito', async () => {
    const usuario = userEvent.setup();
    const agregar = vi.fn();
    render(<TarjetaProducto producto={producto} onAgregar={agregar} />);

    await usuario.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

    expect(agregar).toHaveBeenCalledWith('GA001');
  });

  it('muestra "Sin stock" y deshabilita el botón cuando no hay unidades', async () => {
    const usuario = userEvent.setup();
    const agregar = vi.fn();
    render(<TarjetaProducto producto={{ ...producto, stock: 0 }} onAgregar={agregar} />);

    // Aparece dos veces: en el badge y en el texto del botón.
    expect(screen.getAllByText('Sin stock')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled();

    await usuario.click(screen.getByRole('button', { name: 'Sin stock' }));
    expect(agregar).not.toHaveBeenCalled();
  });

  it('muestra el botón "Agregado ✓" cuando ya está en el carrito', () => {
    render(<TarjetaProducto producto={producto} onAgregar={() => {}} agregado />);
    expect(screen.getByRole('button', { name: 'Agregado ✓' })).toBeInTheDocument();
  });

  it('marca "Últimas 3" cuando el stock es bajo pero mayor que cero', () => {
    render(<TarjetaProducto producto={{ ...producto, stock: 3 }} onAgregar={() => {}} />);
    expect(screen.getByText('Últimas 3')).toBeInTheDocument();
  });
});
