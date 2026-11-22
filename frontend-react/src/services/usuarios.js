import { apiFetch } from './api';

const consulta = (parametros) => {
  const search = new URLSearchParams();
  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') search.set(clave, valor);
  });
  const texto = search.toString();
  return texto ? `?${texto}` : '';
};

export const listar = (parametros = {}) => apiFetch(`/usuarios${consulta(parametros)}`);

export const listarRoles = () => apiFetch('/usuarios/roles');

export const obtener = (id) => apiFetch(`/usuarios/${id}`);

export const crear = (datos) => apiFetch('/usuarios', { method: 'POST', body: datos });

export const actualizar = (id, datos) =>
  apiFetch(`/usuarios/${id}`, { method: 'PUT', body: datos });

export const cambiarEstado = (id, activo) =>
  apiFetch(`/usuarios/${id}/estado`, { method: 'PATCH', body: { activo } });

export const restablecerPassword = (id, password) =>
  apiFetch(`/usuarios/${id}/password`, { method: 'PATCH', body: { password } });

export const eliminar = (id) => apiFetch(`/usuarios/${id}`, { method: 'DELETE' });
