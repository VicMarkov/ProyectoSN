// Suite del hook propio useTituloPagina (sección 4 de la Guía 14).
// renderHook permite probar un hook sin dibujar una pantalla completa.
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTituloPagina } from './useTituloPagina';

describe('useTituloPagina', () => {
  it('cambia el título de la pestaña al montarse', () => {
    renderHook(() => useTituloPagina('Carrito'));
    expect(document.title).toBe('Carrito | Sonido Vivo');
  });

  it('actualiza el título cuando cambia el valor recibido', () => {
    const { rerender } = renderHook(({ titulo }) => useTituloPagina(titulo), {
      initialProps: { titulo: 'Inicio' },
    });
    expect(document.title).toBe('Inicio | Sonido Vivo');

    rerender({ titulo: 'Catálogo' });
    expect(document.title).toBe('Catálogo | Sonido Vivo');
  });

  it('usa el título base del sitio cuando no recibe ninguno', () => {
    renderHook(() => useTituloPagina(''));
    expect(document.title).toBe('Sonido Vivo');
  });
});
