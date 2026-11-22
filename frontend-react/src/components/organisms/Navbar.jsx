import { Navbar as BootstrapNavbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { useCart } from '../../context/CarritoContext';
import { useSesion } from '../../context/SesionContext';

// ORGANISMO: cabecera del sitio (marca, menú, contador del carrito y acceso
// al login). NO conoce el router: cada enlace es un <a href> de verdad y,
// al hacer clic, cancela la recarga y avisa a la plantilla con props.onNavegar.
// Así este componente se puede probar sin montar un router.
const ENLACES = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/catalogo', texto: 'Catálogo' },
  { ruta: '/carrito', texto: 'Carrito' },
  { ruta: '/mis-pedidos', texto: 'Mis pedidos' },
  { ruta: '/contacto', texto: 'Contacto' },
];

function Navbar({ onNavegar, rutaActual = '/' }) {
  const { items } = useCart();
  const { sesion, cerrarSesion } = useSesion();

  const cantidadItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  // preventDefault() cancela la recarga que el navegador haría por su cuenta:
  // la dirección cambia y React vuelve a dibujar, sin perder el estado.
  function ir(evento, ruta) {
    evento.preventDefault();
    onNavegar(ruta);
  }

  return (
    <BootstrapNavbar expand="md" className="navbar-sitio" sticky="top">
      <Container>
        <BootstrapNavbar.Brand href="/" onClick={(e) => ir(e, '/')} className="navbar-marca">
          <img src="/img/logo.svg" alt="Sonido Vivo" height="40" />
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="menu-principal" />
        <BootstrapNavbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            {ENLACES.map((enlace) => (
              <Nav.Link
                key={enlace.ruta}
                href={enlace.ruta}
                active={rutaActual === enlace.ruta}
                onClick={(e) => ir(e, enlace.ruta)}
              >
                {enlace.texto}
                {enlace.ruta === '/carrito' && cantidadItems > 0 && (
                  <Badge bg="warning" text="dark" className="ms-2">
                    {cantidadItems}
                  </Badge>
                )}
              </Nav.Link>
            ))}
          </Nav>

          {sesion?.rol === 'Administrador' && (
            <Nav className="me-3">
              <Nav.Link href="/admin/usuarios" active={rutaActual === '/admin/usuarios'} onClick={(e) => ir(e, '/admin/usuarios')}>
                Usuarios
              </Nav.Link>
              <Nav.Link href="/admin/productos" active={rutaActual === '/admin/productos'} onClick={(e) => ir(e, '/admin/productos')}>
                Productos
              </Nav.Link>
              <Nav.Link href="/admin/pedidos" active={rutaActual === '/admin/pedidos'} onClick={(e) => ir(e, '/admin/pedidos')}>
                Pedidos
              </Nav.Link>
            </Nav>
          )}

          <Nav className="navbar-sesion">
            {sesion ? (
              <>
                <span className="navbar-usuario">{sesion.email}</span>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => {
                    cerrarSesion();
                    onNavegar('/');
                  }}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Nav.Link
                href="/login"
                active={rutaActual === '/login'}
                onClick={(e) => ir(e, '/login')}
              >
                Iniciar sesión
              </Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
