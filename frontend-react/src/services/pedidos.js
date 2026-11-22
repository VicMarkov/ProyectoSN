import { apiFetch } from './api';

const consulta = (parametros) => {
  const search = new URLSearchParams();
  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') search.set(clave, valor);
  });
  const texto = search.toString();
  return texto ? `?${texto}` : '';
};

export const crear = (datos) => apiFetch('/pedidos', { method: 'POST', body: datos });

export const listar = (parametros = {}) => apiFetch(`/pedidos${consulta(parametros)}`);

export const obtener = (id) => apiFetch(`/pedidos/${id}`);

export const cambiarEstado = (id, estado, observacion = '') =>
  apiFetch(`/pedidos/${id}/estado`, { method: 'PATCH', body: { estado, observacion } });
