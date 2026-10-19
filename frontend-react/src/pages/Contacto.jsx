import { useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import FormularioContacto from '../components/organisms/FormularioContacto';
import { useTituloPagina } from '../hooks/useTituloPagina';

// PÁGINA: contacto. Recibe del organismo los datos ya validados y muestra
// la confirmación con un Alert (estado local), sin alert() del navegador.
function Contacto() {
  useTituloPagina('Contacto');
  const [confirmacion, setConfirmacion] = useState('');

  function manejarEnvio(datos) {
    setConfirmacion(
      `Gracias, ${datos.nombre}. Recibimos tu consulta sobre "${datos.motivoTexto}" y te responderemos a ${datos.email}.`
    );
  }

  return (
    <PlantillaSitio>
      <section className="seccion">
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <h1>Escríbenos</h1>
              <p>
                Reemplaza el mensaje de WhatsApp por un formulario que sí queda registrado.
                Respondemos consultas de stock, reparaciones de instrumentos de cuerda y
                cualquier otra duda.
              </p>

              {confirmacion && (
                <Alert variant="success" onClose={() => setConfirmacion('')} dismissible>
                  {confirmacion}
                </Alert>
              )}

              <FormularioContacto onEnviar={manejarEnvio} />
            </Col>

            <Col lg={5}>
              <Card className="tarjeta mb-3">
                <Card.Body>
                  <h3>Tienda física</h3>
                  <p className="mb-0">
                    Viña del Mar, Región de Valparaíso.
                    <br />
                    Atención de lunes a sábado.
                  </p>
                </Card.Body>
              </Card>
              <Card className="tarjeta mb-3">
                <Card.Body>
                  <h3>Correo</h3>
                  <p className="mb-0">
                    <a href="mailto:contacto@sonidovivo.cl">contacto@sonidovivo.cl</a>
                  </p>
                </Card.Body>
              </Card>
              <Card className="tarjeta">
                <Card.Body>
                  <h3>Teléfono</h3>
                  <p className="mb-0">
                    <a href="tel:+56912345678">+56 9 1234 5678</a>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </PlantillaSitio>
  );
}

export default Contacto;
