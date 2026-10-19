// Suite del organismo FormularioCheckout (dueño de su estado).
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioCheckout from './FormularioCheckout';

function renderCheckout(props = {}) {
  const onEnviar = vi.fn();
  const onEntregaChange = vi.fn();
  render(
    <FormularioCheckout
      entrega="retiro"
      carritoVacio={false}
      onEntregaChange={onEntregaChange}
      onEnviar={onEnviar}
      {...props}
    />
  );
  return { onEnviar, onEntregaChange };
}

async function llenarDatosValidos(usuario) {
  await usuario.type(screen.getByLabelText('Nombre completo'), 'María Rojas');
  await usuario.type(screen.getByLabelText('RUT'), '123456785');
  await usuario.type(screen.getByLabelText('Correo electrónico'), 'demo@sonidovivo.cl');
  await usuario.type(screen.getByLabelText('Teléfono'), '+56 9 1234 5678');
}

describe('FormularioCheckout', () => {
  it('muestra los radios de entrega, los campos y el botón de confirmar', () => {
    renderCheckout();
    expect(screen.getByLabelText(/Retiro en tienda/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Despacho a domicilio/)).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByLabelText('RUT')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeInTheDocument();
  });

  it('avisa con onEntregaChange al elegir despacho', async () => {
    const usuario = userEvent.setup();
    const { onEntregaChange } = renderCheckout();

    await usuario.click(screen.getByLabelText(/Despacho a domicilio/));

    expect(onEntregaChange).toHaveBeenCalledWith('despacho');
  });

  it('no deja confirmar con el carrito vacío y lo explica con un aviso', async () => {
    const usuario = userEvent.setup();
    const { onEnviar } = renderCheckout({ carritoVacio: true });

    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();
    expect(onEnviar).not.toHaveBeenCalled();
  });

  it('envía los datos válidos con el RUT formateado (retiro en tienda)', async () => {
    const usuario = userEvent.setup();
    const { onEnviar } = renderCheckout();

    await llenarDatosValidos(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(onEnviar).toHaveBeenCalledWith({
      nombre: 'María Rojas',
      rut: '12.345.678-5',
      email: 'demo@sonidovivo.cl',
      telefono: '+56 9 1234 5678',
      direccion: '',
      entrega: 'retiro',
    });
  });

  it('exige dirección cuando la entrega es despacho', async () => {
    const usuario = userEvent.setup();
    const { onEnviar } = renderCheckout({ entrega: 'despacho' });

    await llenarDatosValidos(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(screen.getByText('Este campo es obligatorio.')).toBeInTheDocument();
    expect(onEnviar).not.toHaveBeenCalled();
  });

  it('reescribe el RUT formateado al salir del campo (blur)', async () => {
    const usuario = userEvent.setup();
    renderCheckout();

    await usuario.type(screen.getByLabelText('RUT'), '123456785');
    await usuario.tab();

    expect(screen.getByLabelText('RUT')).toHaveValue('12.345.678-5');
  });
});
