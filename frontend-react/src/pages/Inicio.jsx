import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import Boton from '../components/atoms/Boton';
import { useTituloPagina } from '../hooks/useTituloPagina';

const DESTACADOS = [
  {
    titulo: 'Cuerdas y cuerpo',
    texto:
      'Guitarras acústicas, eléctricas, bajos y accesorios de las marcas que ya conoces: Yamaha, Fender, Epiphone, Squier.',
  },
  {
    titulo: 'Ritmo y teclas',
    texto:
      'Baterías acústicas y electrónicas, teclados digitales y controladores MIDI para grabar o tocar en vivo.',
  },
  {
    titulo: 'Sonido y estudio',
    texto:
      'Amplificadores, micrófonos, pedales de efectos e interfaces de audio para grabar desde casa.',
  },
];

const ESTADISTICAS = [
  { num: '340', label: 'referencias en catálogo' },
  { num: '11', label: 'años en Viña del Mar' },
  { num: '3', label: 'personas atendiéndote' },
];

// PÁGINA: inicio del sitio. Presenta la tienda, los destacados, el video,
// la ubicación y los accesos principales (catálogo, contacto y login).
function Inicio() {
  // Hook propio a nivel superior del componente, junto a los demás hooks.
  useTituloPagina('Inicio');
  const navigate = useNavigate();

  function ir(evento, ruta) {
    evento.preventDefault();
    navigate(ruta);
  }

  return (
    <PlantillaSitio>
      <section className="hero-sitio">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <h1>Instrumentos y sonido para quienes viven de tocar.</h1>
              <p className="lead hero-lead">
                Hace 11 años equipamos a músicos de Viña del Mar y la Región de Valparaíso.
                Hoy llevamos el mismo mesón de siempre a internet: catálogo completo, pedidos
                formales y seguimiento, sin depender de un WhatsApp que nadie alcanza a responder.
              </p>

              <div className="hero-stats">
                {ESTADISTICAS.map((stat) => (
                  <div key={stat.label}>
                    <span className="num">{stat.num}</span>
                    <span className="label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="hero-acciones mt-4">
                <Boton texto="Ver catálogo completo" onClick={() => navigate('/catalogo')} />
                <Boton
                  texto="Hacer una consulta"
                  variante="outline-light"
                  onClick={() => navigate('/contacto')}
                />
                <a
                  href="/login"
                  className="hero-enlace"
                  onClick={(e) => ir(e, '/login')}
                >
                  Iniciar sesión
                </a>
              </div>
            </Col>
            <Col lg={5}>
              <img
                src="/img/hero-instrumentos.svg"
                alt="Ilustración de una guitarra acústica y un amplificador de válvulas"
                className="hero-img"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="seccion">
        <Container>
          <div className="seccion-intro">
            <h2>Lo que encuentras en la tienda</h2>
            <p>
              Guitarras, bajos, baterías, teclados, amplificadores, micrófonos, pedales de
              efectos y accesorios, además de reparación de instrumentos de cuerda.
            </p>
          </div>
          <Row className="g-4">
            {DESTACADOS.map((tarjeta) => (
              <Col md={4} key={tarjeta.titulo}>
                <Card className="tarjeta h-100">
                  <Card.Body className="d-flex flex-column">
                    <h3>{tarjeta.titulo}</h3>
                    <p className="flex-grow-1">{tarjeta.texto}</p>
                    <a href="/catalogo" onClick={(e) => ir(e, '/catalogo')}>
                      Ver más →
                    </a>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="seccion seccion-alt">
        <Container>
          <Row className="g-4 align-items-center">
            <Col lg={6}>
              <h2>Compra desde donde estés</h2>
              <p>
                Si vives fuera de Viña del Mar, ya no necesitas escribir por Instagram y
                esperar horas por una respuesta. Revisa el catálogo actualizado, agrega
                productos al carrito y elige si prefieres que te lo despachemos o pasar a
                retirarlo tú mismo.
              </p>
              <ul className="badge-lista">
                <li>Catálogo con stock visible</li>
                <li>Pedido con seguimiento</li>
                <li>Despacho o retiro en tienda</li>
              </ul>
              <Boton texto="Explorar catálogo" onClick={() => navigate('/catalogo')} />
            </Col>
            <Col lg={6}>
              <div className="video-wrap">
                <video controls preload="metadata" poster="/img/hero-instrumentos.svg">
                  <source src="/img/video/recorrido-tienda.mp4" type="video/mp4" />
                  Tu navegador no puede reproducir este video. Puedes escribirnos desde la
                  página de contacto para agendar una visita.
                </video>
                <p className="video-caption">
                  Recorrido breve por la tienda física de Viña del Mar. (Video pendiente del
                  equipo; mientras tanto se muestra el póster.)
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="seccion">
        <Container>
          <h2>Visítanos en Viña del Mar</h2>
          <p className="seccion-intro">
            Atendemos de forma presencial y también coordinamos retiros para pedidos hechos
            por el sitio.
          </p>
          <div className="mapa-embed">
            <iframe
              title="Ubicación de Sonido Vivo en Viña del Mar"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-71.5613%2C-33.0245%2C-71.5313%2C-33.0045&layer=mapnik"
              loading="lazy"
            ></iframe>
          </div>
        </Container>
      </section>
    </PlantillaSitio>
  );
}

export default Inicio;
