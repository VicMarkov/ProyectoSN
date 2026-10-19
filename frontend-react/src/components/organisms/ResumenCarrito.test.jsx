// Suite del organismo ResumenCarrito (solo presentación de totales).
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResumenCarrito from './ResumenCarrito';

describe('ResumenCarrito', () => {
  it('muestra cantidad de productos y subtotal', () => {
    render(<ResumenCarrito cantidadItems={2} subtotal={259980} despacho={4990} entrega="retiro" />);
    expect(screen.getByText('Productos').nextSibling).toHaveTextContent('2');
    expect(screen.getByText('$259.980')).toBeInTheDocument();
  });

  it('cobra despacho cuando la entrega es a domicilio', () => {
    render(<ResumenCarrito cantidadItems={2} subtotal={259980} despacho={4990} entrega="despacho" />);
    expect(screen.getByText('$4.990')).toBeInTheDocument();
    expect(screen.getByText('$264.970')).toBeInTheDocument(); // total
  });

  it('muestra el despacho como gratis con retiro en tienda', () => {
    render(<ResumenCarrito cantidadItems={2} subtotal={259980} despacho={4990} entrega="retiro" />);
    expect(screen.getByText('Gratis (retiro en tienda)')).toBeInTheDocument();
    expect(screen.getByText('$259.980')).toBeInTheDocument();
  });
});
