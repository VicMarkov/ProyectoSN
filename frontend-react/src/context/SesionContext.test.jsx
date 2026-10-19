// Suite de la sesión (contexto + persistencia en localStorage).
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SesionProvider, useSesion } from './SesionContext';
import { CLAVE_SESION, sembrarSesion } from '../test/helpers';

function renderSesion() {
  return renderHook(() => useSesion(), {
    wrapper: ({ children }) => <SesionProvider>{children}</SesionProvider>,
  });
}

describe('SesionContext', () => {
  it('empieza sin sesión iniciada', () => {
    const { result } = renderSesion();
    expect(result.current.sesion).toBeNull();
  });

  it('inicia sesión y guarda el correo', () => {
    const { result } = renderSesion();
    act(() => result.current.iniciarSesion('demo@sonidovivo.cl'));
    expect(result.current.sesion).toEqual({ email: 'demo@sonidovivo.cl' });
  });

  it('cierra la sesión', () => {
    const { result } = renderSesion();
    act(() => result.current.iniciarSesion('demo@sonidovivo.cl'));
    act(() => result.current.cerrarSesion());
    expect(result.current.sesion).toBeNull();
  });

  it('persiste la sesión iniciada en localStorage', () => {
    const { result } = renderSesion();
    act(() => result.current.iniciarSesion('demo@sonidovivo.cl'));
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION))).toEqual({
      email: 'demo@sonidovivo.cl',
    });
  });

  it('elimina la sesión guardada al cerrarla', () => {
    const { result } = renderSesion();
    act(() => result.current.iniciarSesion('demo@sonidovivo.cl'));
    act(() => result.current.cerrarSesion());
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });

  it('lee una sesión guardada previamente', () => {
    sembrarSesion('demo@sonidovivo.cl');
    const { result } = renderSesion();
    expect(result.current.sesion).toEqual({ email: 'demo@sonidovivo.cl' });
  });

  it('lanza un error claro si se usa fuera del provider', () => {
    expect(() => renderHook(() => useSesion())).toThrow(
      'useSesion debe usarse dentro de <SesionProvider>.'
    );
  });
});
