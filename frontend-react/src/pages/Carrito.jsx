import { useState } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import LineaCarrito from '../components/molecules/LineaCarrito';
import ResumenCarrito from '../components/organisms/ResumenCarrito';
import FormularioCheckout from '../components/organisms/FormularioCheckout';
import { useCart } from '../context/CarritoContext';
import { useTituloPagina } from '../hooks/useTituloPagina';

const COSTO_DESPACHO = 4990;

// PÁGINA: carrito de compras. Lee y modifica el contexto del carrito,
// muestra el formulario de entrega y confirma el pedido. La confirmación es
// estado de la página (Alert de Bootstrap), sin alert() del navegador.
function Carrito() {
  useTituloPagina('Carrito');
  const navigate = useNavigate();
  const { items, productoDe, actualizarCantidad, quitarProducto, vaciarCarrito, totales } =
    useCart();

  const [entrega, setEntrega] = useState('retiro');
  const [confirmacion, setConfirmacion] = useState('');

  const despacho = entrega === 'despacho' ? COSTO_DESPACHO : 0;
  const carritoVacio = items.length === 0;

  function cambiarCantidad(codigo, nueva) {
    // Igual que en la versión HTML: bajar de 1 quita la línea del carrito.
    if (nueva < 1) {
      quitarProducto(codigo);
    } else {
      actualizarCantidad(codigo, nueva);
    }
  }

  function manejarEnvio(datos) {
    const numeroPedido = 'SV-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmacion(
      `Pedido ${numeroPedido} confirmado a nombre de ${datos.nombre}. Te avisaremos por correo (${datos.email}) el estado de preparación y despacho.`
    );
    vaciarCarrito();
  }

  return (
    <PlantillaSitio>
      <section className="seccion">
        <Container>
          <h1>Tu pedido</h1>

          {confirmacion && (
            <Alert variant="success" onClose={() => setConfirmacion('')} dismissible>
              {confirmacion}
            </Alert>
          )}

          {carritoVacio ? (
            !confirmacion && (
              <div className="carrito-vacio">
                <p>Aún no has agregado productos.</p>
                <Button onClick={() => navigate('/catalogo')}>Ir al catálogo</Button>
              </div>
            )
          ) : (
            <Row className="g-4">
              <Col lg={8}>
                <div className="ticket">
                  {items.map((item) => {
                    const producto = productoDe(item.codigo);
                    if (!producto) return null;
                    return (
                      <LineaCarrito
                        key={item.codigo}
                        producto={producto}
                        cantidad={item.cantidad}
                        onCambiarCantidad={(nueva) => cambiarCantidad(item.codigo, nueva)}
                        onQuitar={() => quitarProducto(item.codigo)}
                      />
                    );
                  })}
                </div>

                <section className="datos-entrega mt-5">
                  <h2>Datos de despacho o retiro</h2>
                  <FormularioCheckout
                    entrega={entrega}
                    onEntregaChange={setEntrega}
                    carritoVacio={carritoVacio}
                    onEnviar={manejarEnvio}
                  />
                </section>
              </Col>

              <Col lg={4}>
                <ResumenCarrito
                  cantidadItems={totales.cantidadItems}
                  subtotal={totales.subtotal}
                  despacho={despacho}
                  entrega={entrega}
                />
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </PlantillaSitio>
  );
}

export default Carrito;
