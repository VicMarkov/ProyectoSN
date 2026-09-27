import { Container, Row, Col } from 'react-bootstrap';

// TEMPLATE: el esqueleto de cualquier pantalla de autenticación
// (login, recuperar contraseña, registro). Define DÓNDE va el panel
// de marca y DÓNDE va el formulario, y cómo se acomodan en cada ancho
// de pantalla, pero no sabe todavía qué formulario real se muestra
// ahí adentro — eso lo decide la página, a través de `children`.
//
// Breakpoints usados:
//  - xs (< 576px, celular): una sola columna, formulario primero,
//    panel de marca queda oculto para no obligar a hacer scroll.
//  - md (>= 768px, tablet en adelante): dos columnas lado a lado.
function LayoutAutenticacion({ children }) {
  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--ink)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={5} className="d-none d-md-flex flex-column justify-content-center text-light p-5">
            <h1 className="fuente-titulo" style={{ color: 'var(--paper)' }}>Sonido Vivo</h1>
            <p className="text-white-50">
              Instrumentos y equipos de sonido en Viña del Mar. Entra a tu cuenta para
              seguir tus pedidos y tu historial de compras.
            </p>
          </Col>

          <Col xs={12} md={6} lg={5}>
            <div className="bg-white rounded-3 shadow-sm p-4 p-md-5 my-4">
              {children}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LayoutAutenticacion;
