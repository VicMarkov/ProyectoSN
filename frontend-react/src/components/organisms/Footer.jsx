import { Container, Row, Col } from 'react-bootstrap';

// ORGANISMO: pie del sitio. Igual que el Navbar, no conoce el router:
// recibe la función de navegación por props (props.onNavegar) y la llama.
function Footer({ onNavegar }) {
  function ir(evento, ruta) {
    evento.preventDefault();
    onNavegar(ruta);
  }

  const enlaces = [
    { ruta: '/', texto: 'Inicio' },
    { ruta: '/catalogo', texto: 'Catálogo' },
    { ruta: '/carrito', texto: 'Carrito' },
    { ruta: '/contacto', texto: 'Contacto' },
    { ruta: '/login', texto: 'Iniciar sesión' },
  ];

  return (
    <footer className="site-footer">
      <Container>
        <Row className="footer-grid g-4">
          <Col md={4}>
            <h4>Sonido Vivo</h4>
            <p className="footer-descripcion">
              Instrumentos musicales, equipos de sonido y accesorios en Viña del Mar,
              Región de Valparaíso.
            </p>
          </Col>
          <Col md={4}>
            <h4>Navegación</h4>
            <ul className="footer-lista">
              {enlaces.map((enlace) => (
                <li key={enlace.ruta}>
                  <a href={enlace.ruta} onClick={(e) => ir(e, enlace.ruta)}>
                    {enlace.texto}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={4}>
            <h4>Contacto</h4>
            <ul className="footer-lista">
              <li>Viña del Mar, Región de Valparaíso</li>
              <li>
                <a href="mailto:contacto@sonidovivo.cl">contacto@sonidovivo.cl</a>
              </li>
              <li>
                <a href="tel:+56912345678">+56 9 1234 5678</a>
              </li>
            </ul>
          </Col>
        </Row>
        <div className="footer-bottom">
          Sonido Vivo — Proyecto académico DSY1104, Desarrollo FullStack II. Prototipo de
          frontend, sin fines comerciales reales.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
