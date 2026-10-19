// Suite del átomo CampoAreaTexto (textarea controlado).
import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampoAreaTexto from './CampoAreaTexto';

function AreaConEstado() {
  const [valor, setValor] = useState('');
  return (
    <CampoAreaTexto
      id="mensaje"
      valor={valor}
      onChange={(evento) => setValor(evento.target.value)}
      placeholder="Cuéntanos..."
      filas={5}
    />
  );
}

describe('CampoAreaTexto', () => {
  it('es un textarea con la cantidad de filas pedida', () => {
    render(<AreaConEstado />);
    expect(screen.getByPlaceholderText('Cuéntanos...')).toHaveAttribute('rows', '5');
  });

  it('refleja lo que escribe el usuario (valor controlado)', async () => {
    const usuario = userEvent.setup();
    render(<AreaConEstado />);

    await usuario.type(screen.getByPlaceholderText('Cuéntanos...'), 'Hola equipo');

    expect(screen.getByPlaceholderText('Cuéntanos...')).toHaveValue('Hola equipo');
  });

  it('se marca inválido cuando el formulario lo pide', () => {
    render(<CampoAreaTexto id="mensaje" valor="" onChange={() => {}} esInvalido />);
    expect(screen.getByRole('textbox')).toHaveClass('is-invalid');
  });
});
