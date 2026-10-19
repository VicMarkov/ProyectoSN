// Suite de la página Catálogo (filtros, búsqueda y agregar al carrito).
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Catalogo from './Catalogo';
import { PRODUCTOS } from '../data/productos';
import { conProveedores, CLAVE_CARRITO } from '../test/helpers';

const GUITARRAS = PRODUCTOS.filter((p) => p.categoria === 'Guitarras Acústicas').length;

describe('Catalogo', () => {
  it('lista todos los productos del catálogo al abrir', () => {
    conProveedores(<Catalogo />);
    expect(screen.getByText(new RegExp(`${PRODUCTOS.length} producto\\(s\\) encontrados`))).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Agregar al carrito' })).toHaveLength(PRODUCTOS.length);
  });

  it('filtra por categoría', async () => {
    const usuario = userEvent.setup();
    conProveedores(<Catalogo />);

    await usuario.selectOptions(screen.getByLabelText('Categoría'), 'Guitarras Acústicas');

    expect(screen.getByText(new RegExp(`${GUITARRAS} producto\\(s\\) encontrados`))).toBeInTheDocument();
  });

  it('busca por nombre o marca', async () => {
    const usuario = userEvent.setup();
    conProveedores(<Catalogo />);

    await usuario.type(screen.getByLabelText('Buscar por nombre o marca'), 'Stratocaster');

    expect(screen.getByText('Guitarra Eléctrica Stratocaster')).toBeInTheDocument();
    expect(screen.getByText(/producto\(s\) encontrados/)).not.toHaveTextContent(`${PRODUCTOS.length} producto`);
  });

  it('avisa cuando la búsqueda no tiene resultados', async () => {
    const usuario = userEvent.setup();
    conProveedores(<Catalogo />);

    await usuario.type(screen.getByLabelText('Buscar por nombre o marca'), 'zzzznoexiste');

    expect(screen.getByText(/No encontramos productos con ese filtro/)).toBeInTheDocument();
  });

  it('agrega un producto al carrito y lo confirma en el botón', async () => {
    const usuario = userEvent.setup();
    conProveedores(<Catalogo />);

    await usuario.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0]);

    expect(screen.getByRole('button', { name: 'Agregado ✓' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([
      { codigo: PRODUCTOS[0].codigo, cantidad: 1 },
    ]);
  });
});
