import { apiFetch } from './api';

const consulta = (parametros) => {
  const search = new URLSearchParams();
  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') search.set(clave, valor);
  });
  const texto = search.toString();
  return texto ? `?${texto}` : '';
};

export const listar = (parametros = {}) => apiFetch(`/productos${consulta(parametros)}`);

export const listarAdmin = (parametros = {}) =>
  apiFetch(`/productos/admin${consulta(parametros)}`);

export const obtener = (id) => apiFetch(`/productos/${id}`);

export const listarCategorias = () => apiFetch('/productos/categorias');

export const listarMarcas = () => apiFetch('/productos/marcas');

export const crear = (datos) => apiFetch('/productos', { method: 'POST', body: datos });

export const actualizar = (id, datos) =>
  apiFetch(`/productos/${id}`, { method: 'PUT', body: datos });

export const cambiarEstado = (id, activo) =>
  apiFetch(`/productos/${id}/estado`, { method: 'PATCH', body: { activo } });

export const ajustarStock = (id, datos) =>
  apiFetch(`/productos/${id}/stock`, { method: 'PUT', body: datos });
