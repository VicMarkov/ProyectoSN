const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');

export const CLAVE_TOKEN = 'sonidovivo_token';

export class ApiError extends Error {
  constructor(mensaje, status, detalles) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
    this.detalles = detalles;
  }
}

export function leerToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(CLAVE_TOKEN);
}

export function guardarToken(token) {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(CLAVE_TOKEN, token);
  else window.localStorage.removeItem(CLAVE_TOKEN);
}

export function borrarToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CLAVE_TOKEN);
}

export async function apiFetch(ruta, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const token = leerToken();
  const respuesta = await fetch(`${BASE}${ruta}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const texto = await respuesta.text();
  let datos = null;
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = { error: texto };
    }
  }

  if (!respuesta.ok) {
    if (respuesta.status === 401 && token && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sonidovivo:sesion-expirada'));
    }
    throw new ApiError(
      datos?.error || `No fue posible completar la operación (HTTP ${respuesta.status}).`,
      respuesta.status,
      datos?.errores
    );
  }

  return datos;
}
