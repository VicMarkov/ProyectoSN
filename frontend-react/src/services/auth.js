import { apiFetch } from './api';

export const iniciarSesion = (credenciales) =>
  apiFetch('/auth/login', { method: 'POST', body: credenciales, auth: false });

export const registrar = (datos) =>
  apiFetch('/auth/register', { method: 'POST', body: datos, auth: false });

export const obtenerSesion = () => apiFetch('/auth/me');
