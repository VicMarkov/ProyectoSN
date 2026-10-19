// Suite del átomo CampoTexto (input controlado).
// CampoTexto no tiene estado propio: la prueba lo envuelve en un componente
// mínimo que guarda el valor, como hace el formulario real.
import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampoTexto from './CampoTexto';

function CampoConEstado() {
  const [valor, setValor] = useState('');
  return (
    <CampoTexto
      id="correo"
      valor={valor}
      onChange={(evento) => setValor(evento.target.value)}
      placeholder="tu@correo.cl"
    />
  );
}

describe('CampoTexto', () => {
  it('muestra el placeholder como ayuda visual', () => {
    render(<CampoConEstado />);
    expect(screen.getByPlaceholderText('tu@correo.cl')).toBeInTheDocument();
  });

  it('refleja lo que escribe el usuario (valor controlado)', async () => {
    const usuario = userEvent.setup();
    render(<CampoConEstado />);

    await usuario.type(screen.getByPlaceholderText('tu@correo.cl'), 'demo@sonidovivo.cl');

    expect(screen.getByPlaceholderText('tu@correo.cl')).toHaveValue('demo@sonidovivo.cl');
  });

  it('cambia a tipo password cuando se le pide', () => {
    render(
      <CampoTexto id="clave" tipo="password" valor="" onChange={() => {}} placeholder="Tu contraseña" />
    );
    expect(screen.getByPlaceholderText('Tu contraseña')).toHaveAttribute('type', 'password');
  });

  it('se marca inválido cuando el formulario lo pide', () => {
    render(<CampoTexto id="correo" valor="" onChange={() => {}} esInvalido />);
    expect(screen.getByRole('textbox')).toHaveClass('is-invalid');
  });
});
