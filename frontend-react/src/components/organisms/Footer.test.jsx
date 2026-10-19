// Suite del organismo Footer (pie del sitio).
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from './Footer';

describe('Footer', () => {
  it('muestra los datos de contacto del negocio', () => {
    render(<Footer onNavegar={() => {}} />);
    expect(screen.getByText('contacto@sonidovivo.cl')).toBeInTheDocument();
    expect(screen.getByText('+56 9 1234 5678')).toBeInTheDocument();
  });

  it('muestra los enlaces de navegación del pie', () => {
    render(<Footer onNavegar={() => {}} />);
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Catálogo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('avisa con onNavegar al hacer clic en un enlace del pie', async () => {
    const usuario = userEvent.setup();
    const navegar = vi.fn();
    render(<Footer onNavegar={navegar} />);

    await usuario.click(screen.getByRole('link', { name: 'Catálogo' }));

    expect(navegar).toHaveBeenCalledWith('/catalogo');
  });
});
