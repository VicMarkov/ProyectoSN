import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/auth';
import { borrarToken, guardarToken, leerToken } from '../services/api';

const CLAVE_SESION = 'sonidovivo_sesion';
const SesionContexto = createContext(null);

function leerSesionGuardada() {
  try {
    const datos = localStorage.getItem(CLAVE_SESION);
    return datos ? JSON.parse(datos) : null;
  } catch (error) {
    console.warn('No se pudo leer la sesión guardada:', error);
    return null;
  }
}

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesionGuardada);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (sesion) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify({ email: sesion.email }));
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  }, [sesion]);

  useEffect(() => {
    const token = leerToken();
    if (!token) {
      return undefined;
    }

    let activo = true;
    setCargando(true);
    authService
      .obtenerSesion()
      .then(({ usuario }) => {
        if (activo) setSesion(usuario);
      })
      .catch(() => {
        if (activo) {
          setSesion(null);
          borrarToken();
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    const expirar = () => {
      setSesion(null);
      borrarToken();
    };
    window.addEventListener('sonidovivo:sesion-expirada', expirar);
    return () => window.removeEventListener('sonidovivo:sesion-expirada', expirar);
  }, []);

  function iniciarSesion(emailOCredenciales, password) {
    const credenciales =
      typeof emailOCredenciales === 'string'
        ? { email: emailOCredenciales, password }
        : emailOCredenciales;

    if (password === undefined) {
      setSesion({ email: credenciales.email });
      return;
    }

    return (async () => {
      const { token, usuario } = await authService.iniciarSesion(credenciales);
      guardarToken(token);
      setSesion(usuario);
      return usuario;
    })();
  }

  async function registrar(datos) {
    const resultado = await authService.registrar(datos);
    return resultado.usuario;
  }

  function cerrarSesion() {
    setSesion(null);
    borrarToken();
  }

  function actualizarSesion(usuario) {
    setSesion((anterior) => ({ ...anterior, ...usuario }));
  }

  const valor = {
    sesion,
    cargando,
    iniciarSesion,
    registrar,
    cerrarSesion,
    actualizarSesion,
  };

  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>;
}

export function useSesion() {
  const contexto = useContext(SesionContexto);
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>.');
  }
  return contexto;
}
