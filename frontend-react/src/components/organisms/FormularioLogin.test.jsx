// Suite del organismo FormularioLogin (controlado por la página).
// Un wrapper con estado simula a la página, igual que hace Login.jsx.
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioLogin from './FormularioLogin';

function LoginConEstado({ onSubmit = () => {}, cargando = false, errorGeneral = '' }) {
  const [valores, setValores] = useState({ email: '', password: '', recordar: false });
  return (
    <FormularioLogin
      valores={valores}
      errores={{}}
      errorGeneral={errorGeneral}
      cargando={cargando}
      onChange={(campo, valor) => setValores((anteriores) => ({ ...anteriores, [campo]: valor }))}
      onBlur={() => {}}
      onSubmit={onSubmit}
    />
  );
}

describe('FormularioLogin', () => {
  it('muestra el título, los dos campos y el botón de ingresar', () => {
    render(<LoginConEstado />);
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('permite escribir el correo y la contraseña', async () => {
    const usuario = userEvent.setup();
    render(<LoginConEstado />);

    await usuario.type(screen.getByLabelText('Correo electrónico'), 'demo@sonidovivo.cl');
    await usuario.type(screen.getByLabelText('Contraseña'), 'demo123');

    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('demo@sonidovivo.cl');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('demo123');
  });

  it('permite marcar "Recordarme"', async () => {
    const usuario = userEvent.setup();
    render(<LoginConEstado />);

    await usuario.click(screen.getByLabelText('Recordarme'));

    expect(screen.getByLabelText('Recordarme')).toBeChecked();
  });

  it('muestra el error general cuando la página lo envía', () => {
    render(<LoginConEstado errorGeneral="Correo o contraseña incorrectos." />);
    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
  });

  it('se deshabilita mientras carga', () => {
    render(<LoginConEstado cargando />);
    expect(screen.getByText('Ingresando...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ingresando...' })).toBeDisabled();
  });

  it('avisa con onSubmit al enviar el formulario', async () => {
    const usuario = userEvent.setup();
    const enviar = vi.fn();
    render(<LoginConEstado onSubmit={enviar} />);

    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(enviar).toHaveBeenCalledTimes(1);
  });
});
