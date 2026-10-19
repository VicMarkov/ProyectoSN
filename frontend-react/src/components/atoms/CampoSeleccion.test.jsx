// Suite del átomo CampoSeleccion (select controlado).
import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampoSeleccion from './CampoSeleccion';

const OPCIONES = [
  { valor: '', texto: 'Elige...' },
  { valor: 'stock', texto: 'Stock disponible' },
  { valor: 'precio', texto: 'Precio menor' },
];

function SelectConEstado() {
  const [valor, setValor] = useState('');
  return <CampoSeleccion id="orden" valor={valor} onChange={(e) => setValor(e.target.value)} opciones={OPCIONES} />;
}

describe('CampoSeleccion', () => {
  it('dibuja todas las opciones recibidas', () => {
    render(<SelectConEstado />);
    expect(screen.getByRole('option', { name: 'Elige...' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Stock disponible' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Precio menor' })).toBeInTheDocument();
  });

  it('refleja la opción elegida por el usuario (valor controlado)', async () => {
    const usuario = userEvent.setup();
    render(<SelectConEstado />);

    await usuario.selectOptions(screen.getByRole('combobox'), 'precio');

    expect(screen.getByRole('combobox')).toHaveValue('precio');
  });

  it('se marca inválido cuando el formulario lo pide', () => {
    render(<CampoSeleccion id="orden" valor="" onChange={() => {}} opciones={OPCIONES} esInvalido />);
    expect(screen.getByRole('combobox')).toHaveClass('is-invalid');
  });
});
