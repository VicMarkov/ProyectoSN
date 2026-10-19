// Suite del organismo FormularioContacto (dueño de su estado).
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioContacto from './FormularioContacto';

async function llenarFormularioValido(usuario) {
  await usuario.type(screen.getByLabelText('Nombre'), 'María Rojas');
  await usuario.type(screen.getByLabelText('Correo electrónico'), 'demo@sonidovivo.cl');
  await usuario.type(screen.getByLabelText('Teléfono'), '+56 9 1234 5678');
  await usuario.selectOptions(screen.getByLabelText('Motivo de tu consulta'), 'stock');
  await usuario.type(
    screen.getByLabelText('Mensaje'),
    'Hola equipo, ¿tienen stock de cuerdas este viernes?'
  );
}

describe('FormularioContacto', () => {
  it('muestra los cinco campos y el botón de enviar', () => {
    render(<FormularioContacto onEnviar={() => {}} />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Teléfono')).toBeInTheDocument();
    expect(screen.getByLabelText('Motivo de tu consulta')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar consulta' })).toBeInTheDocument();
  });

  it('al enviar vacío muestra todos los errores y no avisa a la página', async () => {
    const usuario = userEvent.setup();
    const enviar = vi.fn();
    render(<FormularioContacto onEnviar={enviar} />);

    await usuario.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect(screen.getAllByText('Este campo es obligatorio.')).toHaveLength(2); // nombre y mensaje
    expect(screen.getByText('Ingresa tu correo electrónico.')).toBeInTheDocument();
    expect(screen.getByText('Ingresa un teléfono de contacto.')).toBeInTheDocument();
    expect(enviar).not.toHaveBeenCalled();
  });

  it('avisa al salir del campo con un valor inválido (blur)', async () => {
    const usuario = userEvent.setup();
    render(<FormularioContacto onEnviar={() => {}} />);

    await usuario.type(screen.getByLabelText('Nombre'), 'a');
    await usuario.tab();

    expect(screen.getByText('Debe tener al menos 2 caracteres.')).toBeInTheDocument();
  });

  it('corrige el error del campo apenas se escribe un valor válido', async () => {
    const usuario = userEvent.setup();
    render(<FormularioContacto onEnviar={() => {}} />);

    await usuario.click(screen.getByRole('button', { name: 'Enviar consulta' }));
    expect(screen.getAllByText('Este campo es obligatorio.')).toHaveLength(2); // nombre y mensaje

    await usuario.type(screen.getByLabelText('Nombre'), 'María');
    expect(screen.getByLabelText('Nombre')).not.toHaveClass('is-invalid');
  });

  it('envía los datos con el texto del motivo y limpia el formulario', async () => {
    const usuario = userEvent.setup();
    const enviar = vi.fn();
    render(<FormularioContacto onEnviar={enviar} />);

    await llenarFormularioValido(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Enviar consulta' }));

    expect(enviar).toHaveBeenCalledTimes(1);
    expect(enviar).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'María Rojas',
        email: 'demo@sonidovivo.cl',
        telefono: '+56 9 1234 5678',
        motivo: 'stock',
        motivoTexto: 'Disponibilidad de un producto',
      })
    );
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
  });
});
