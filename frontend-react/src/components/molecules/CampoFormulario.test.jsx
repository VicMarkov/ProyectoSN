// Suite de la molécula CampoFormulario (etiqueta + campo + error/ayuda).
import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampoFormulario from './CampoFormulario';

function CampoConEstado({ opciones, multilinea, ...props }) {
  const [valor, setValor] = useState(props.valorInicial ?? '');
  return (
    <CampoFormulario
      id="campo"
      etiqueta="Nombre"
      valor={valor}
      onChange={(evento) => setValor(evento.target.value)}
      opciones={opciones}
      multilinea={multilinea}
      {...props}
    />
  );
}

const OPCIONES = [
  { valor: '', texto: 'Elige...' },
  { valor: 'stock', texto: 'Stock disponible' },
];

describe('CampoFormulario', () => {
  it('dibuja un input de texto por defecto, con su etiqueta', async () => {
    const usuario = userEvent.setup();
    render(<CampoConEstado placeholder="Escribe aquí" />);

    await usuario.type(screen.getByLabelText('Nombre'), 'María');

    expect(screen.getByRole('textbox', { name: 'Nombre' })).toHaveValue('María');
  });

  it('dibuja un select cuando recibe opciones', () => {
    render(<CampoConEstado opciones={OPCIONES} />);
    expect(screen.getByRole('combobox', { name: 'Nombre' })).toBeInTheDocument();
  });

  it('dibuja un textarea cuando se marca multilinea', () => {
    render(<CampoConEstado multilinea placeholder="Mensaje" />);
    expect(screen.getByPlaceholderText('Mensaje')).toHaveAttribute('rows', '4');
  });

  it('muestra el mensaje de error junto al campo inválido', () => {
    render(<CampoConEstado error="Este campo es obligatorio." />);
    expect(screen.getByRole('textbox', { name: 'Nombre' })).toHaveClass('is-invalid');
    expect(screen.getByText('Este campo es obligatorio.')).toBeInTheDocument();
  });

  it('muestra la ayuda cuando no hay error y la oculta cuando lo hay', () => {
    const { rerender } = render(<CampoConEstado ayuda="Ayuda del campo" />);
    expect(screen.getByText('Ayuda del campo')).toBeInTheDocument();

    rerender(<CampoConEstado ayuda="Ayuda del campo" error="Con error" />);
    expect(screen.queryByText('Ayuda del campo')).not.toBeInTheDocument();
    expect(screen.getByText('Con error')).toBeInTheDocument();
  });
});
