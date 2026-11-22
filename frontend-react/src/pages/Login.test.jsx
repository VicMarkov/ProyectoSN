// Suite de la página Login (validación, sesión real y navegación).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { conProveedores, CLAVE_SESION, SondaRuta } from '../test/helpers';
import { CLAVE_TOKEN } from '../services/api';

function renderLogin() {
  conProveedores(
    <>
      <Login />
      <SondaRuta />
    </>,
    '/login'
  );
}

function mockFetch(respuesta) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: respuesta.ok,
      status: respuesta.status,
      text: async () => JSON.stringify(respuesta.body),
    }))
  );
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

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
    mockFetch({ ok: false, status: 401, body: { error: 'Correo electrónico o contraseña incorrectos.' } });
    const usuario = userEvent.setup();
    renderLogin();

    await escribirCredenciales(usuario, 'mal@correo.cl', 'clave123');
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(screen.getByText(/Correo electrónico o contraseña incorrectos/)).toBeInTheDocument();
    });
    expect(screen.getByTestId('sonda-ruta')).toHaveTextContent('/login');
  });

  it('ingresa con las credenciales de prueba, guarda la sesión y navega al inicio', async () => {
    mockFetch({
      ok: true,
      status: 200,
      body: {
        token: 'token-de-prueba',
        usuario: { id: 3, nombre: 'Cliente Demo', email: 'demo@sonidovivo.cl', rol: 'Cliente' },
      },
    });
    const usuario = userEvent.setup();
    renderLogin();

    await escribirCredenciales(usuario, 'demo@sonidovivo.cl', 'demo123');
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(screen.getByTestId('sonda-ruta')).toHaveTextContent('/');
    });
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION)).email).toBe('demo@sonidovivo.cl');
    expect(localStorage.getItem(CLAVE_TOKEN)).toBe('token-de-prueba');
  }, 5000);
});
