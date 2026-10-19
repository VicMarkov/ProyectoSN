// Suite del carrito (contexto + estado + persistencia).
// Los contextos se prueban con renderHook y un wrapper con el provider.
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CarritoProvider, useCart } from './CarritoContext';
import { CLAVE_CARRITO, sembrarCarrito } from '../test/helpers';

// GA001: stock 8, precio $129.990 — GA004: stock 3, precio $349.990.
function renderCarrito() {
  return renderHook(() => useCart(), {
    wrapper: ({ children }) => <CarritoProvider>{children}</CarritoProvider>,
  });
}

describe('CarritoContext', () => {
  it('empieza con el carrito vacío', () => {
    const { result } = renderCarrito();
    expect(result.current.items).toEqual([]);
    expect(result.current.totales).toEqual({ subtotal: 0, cantidadItems: 0 });
  });

  it('agrega un producto y acumula su cantidad', () => {
    const { result } = renderCarrito();
    act(() => result.current.agregarProducto('GA001', 2));
    act(() => result.current.agregarProducto('GA001', 1));
    expect(result.current.items).toEqual([{ codigo: 'GA001', cantidad: 3 }]);
  });

  it('no deja que un producto supere su stock', () => {
    const { result } = renderCarrito();
    act(() => result.current.agregarProducto('GA001', 10));
    expect(result.current.items[0].cantidad).toBe(8);
  });

  it('acumula productos distintos en el carrito', () => {
    const { result } = renderCarrito();
    act(() => result.current.agregarProducto('GA001'));
    act(() => result.current.agregarProducto('GA004'));
    expect(result.current.items).toHaveLength(2);
  });

  it('ignora los códigos de producto que no existen', () => {
    const { result } = renderCarrito();
    act(() => result.current.agregarProducto('NOEXISTE'));
    expect(result.current.items).toEqual([]);
  });

  it('actualiza la cantidad respetando el mínimo (1) y el stock', () => {
    const { result } = renderCarrito();
    act(() => result.current.agregarProducto('GA001', 2));

    act(() => result.current.actualizarCantidad('GA001', 5));
    expect(result.current.items[0].cantidad).toBe(5);

    act(() => result.current.actualizarCantidad('GA001', 0));
    expect(result.current.items[0].cantidad).toBe(1);

    act(() => result.current.actualizarCantidad('GA001', 99));
    expect(result.current.items[0].cantidad).toBe(8);
  });

  it('quita un producto del carrito', () => {
    const { result } = renderCarrito();
    act(() => result.current.agregarProducto('GA001'));
    act(() => result.current.agregarProducto('GA004'));
    act(() => result.current.quitarProducto('GA001'));
    expect(result.current.items.map((item) => item.codigo)).toEqual(['GA004']);
  });

  it('vacía el carrito por completo', () => {
    const { result } = renderCarrito();
    act(() => result.current.agregarProducto('GA001'));
    act(() => result.current.agregarProducto('GA004'));
    act(() => result.current.vaciarCarrito());
    expect(result.current.items).toEqual([]);
  });

  it('calcula el subtotal y la cantidad de productos', () => {
    const { result } = renderCarrito();
    act(() => result.current.agregarProducto('GA001', 2));
    act(() => result.current.agregarProducto('GA004', 1));
    expect(result.current.totales.subtotal).toBe(129990 * 2 + 349990);
    expect(result.current.totales.cantidadItems).toBe(3);
  });

  it('persiste el carrito en localStorage', () => {
    const { result } = renderCarrito();
    act(() => result.current.agregarProducto('GA001', 2));
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([
      { codigo: 'GA001', cantidad: 2 },
    ]);
  });

  it('lee un carrito guardado previamente', () => {
    sembrarCarrito([{ codigo: 'GA004', cantidad: 2 }]);
    const { result } = renderCarrito();
    expect(result.current.items).toEqual([{ codigo: 'GA004', cantidad: 2 }]);
    expect(result.current.totales.subtotal).toBe(349990 * 2);
  });

  it('lanza un error claro si se usa fuera del provider', () => {
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart debe usarse dentro de <CarritoProvider>.'
    );
  });
});
