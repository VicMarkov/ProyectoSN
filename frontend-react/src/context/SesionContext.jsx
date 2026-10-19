// SesionContext.jsx
// Caja compartida de la sesión de usuario (useContext).
//
// No hay backend todavía: la autenticación sigue simulada en Login.jsx
// (demo@sonidovivo.cl / demo123). Aquí solo se guarda "quién entró" para
// que el navbar pueda mostrarlo y para cerrar sesión desde cualquier
// página. Cuando exista el microservicio de autenticación, solo cambia
// cómo se obtiene la sesión (fetch en lugar de este estado local).
import { createContext, useContext, useEffect, useState } from 'react';

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

  useEffect(() => {
    if (sesion) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  }, [sesion]);

  function iniciarSesion(email) {
    setSesion({ email });
  }

  function cerrarSesion() {
    setSesion(null);
  }

  const valor = { sesion, iniciarSesion, cerrarSesion };

  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>;
}

// Hook propio del proyecto: "abre la caja" de la sesión.
export function useSesion() {
  const contexto = useContext(SesionContexto);
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>.');
  }
  return contexto;
}
