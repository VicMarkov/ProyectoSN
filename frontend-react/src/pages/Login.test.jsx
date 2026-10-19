// Suite de la página Login (validación, sesión simulada y navegación).
// El login simula una llamada a la API con setTimeout(800): por eso estos
// casos usan waitFor en lugar de asertar de inmediato.
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { conProveedores, CLAVE_SESION, SondaRuta } from '../test/helpers';

function renderLogin() {
  conProveedores(
    <>
      <Login />
      <SondaRuta />
    </>,
    '/login'
  );
}

async function escribirCredenciales(usuario, email, clave) {
  await usuario.type(screen.getByLabelText('Correo electrónico'), email);
  await usuario.type(screen.getByLabelText('Contraseña'), clave);
}

describe('Login', () => {
  it('muestra el formulario de ingreso y el enlace de volver', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
    expect(screen.getByText('← Volver al inicio')).toBeInTheDocument();
  });

  it('marca los campos vacíos al enviar y no intenta ingresar', async () => {
    const usuario = userEvent.setup();
    renderLogin();

    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(screen.getByText('Ingresa tu correo electrónico.')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu contraseña.')).toBeInTheDocument();
    expect(screen.getByTestId('sonda-ruta')).toHaveTextContent('/login');
  });

  it('rechaza credenciales incorrectas con el mensaje de error', async () => {
    const usuario = userEvent.setup();
    renderLogin();

    await escribirCredenciales(usuario, 'mal@correo.cl', 'clave123');
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(
      () => {
        expect(screen.getByText(/Correo o contraseña incorrectos/)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(screen.getByTestId('sonda-ruta')).toHaveTextContent('/login');
  });

  it('ingresa con las credenciales de prueba, guarda la sesión y navega al inicio', async () => {
    const usuario = userEvent.setup();
    renderLogin();

    await escribirCredenciales(usuario, 'demo@sonidovivo.cl', 'demo123');
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(
      () => {
        expect(screen.getByTestId('sonda-ruta')).toHaveTextContent('/');
        expect(JSON.parse(localStorage.getItem(CLAVE_SESION))).toEqual({
          email: 'demo@sonidovivo.cl',
        });
      },
      { timeout: 2000 }
    );
  }, 5000);
});
