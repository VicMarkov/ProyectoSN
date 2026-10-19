// Suite del átomo Etiqueta (label asociada a un campo).
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Etiqueta from './Etiqueta';
import CampoTexto from './CampoTexto';

describe('Etiqueta', () => {
  it('muestra el texto de la etiqueta', () => {
    render(<Etiqueta texto="Correo electrónico" para="correo" />);
    expect(screen.getByText('Correo electrónico')).toBeInTheDocument();
  });

  it('asocia la etiqueta con el campo (getByLabelText la encuentra)', () => {
    render(
      <>
        <Etiqueta texto="Correo electrónico" para="correo" />
        <CampoTexto id="correo" valor="" onChange={() => {}} />
      </>
    );
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
  });
});
