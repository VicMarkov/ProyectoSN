import { useState } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import LineaCarrito from '../components/molecules/LineaCarrito';
import ResumenCarrito from '../components/organisms/ResumenCarrito';
import FormularioCheckout from '../components/organisms/FormularioCheckout';
import { useCart } from '../context/CarritoContext';
import { useSesion } from '../context/SesionContext';
import * as productosService from '../services/productos';
import * as pedidosService from '../services/pedidos';
import { ApiError, leerToken } from '../services/api';
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
  const [errorPedido, setErrorPedido] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { sesion } = useSesion();

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

  async function manejarEnvio(datos) {
    setErrorPedido('');
    const token = leerToken();

    if (!token) {
      const numeroPedido = 'SV-' + Math.floor(100000 + Math.random() * 900000);
      setConfirmacion(
        `Pedido ${numeroPedido} confirmado a nombre de ${datos.nombre}. Te avisaremos por correo (${datos.email}) el estado de preparación y despacho.`
      );
      vaciarCarrito();
      return;
    }

    setEnviando(true);
    try {
      const { productos } = await productosService.listar({ limite: 100 });
      const porSku = new Map(productos.map((producto) => [producto.sku, producto.id]));
      const itemsPedido = items
        .map((item) => ({ idProducto: porSku.get(item.codigo), cantidad: item.cantidad }))
        .filter((item) => item.idProducto);

      if (itemsPedido.length === 0) {
        throw new ApiError('No se pudieron asociar los productos del carrito.', 400);
      }

      const respuesta = await pedidosService.crear({
        items: itemsPedido,
        tipoEntrega: entrega === 'despacho' ? 'DOMICILIO' : 'RETIRO_TIENDA',
        nombreContacto: datos.nombre,
        emailContacto: datos.email,
        telefonoContacto: datos.telefono,
        direccionDespacho: entrega === 'despacho' ? datos.direccion : undefined,
      });

      setConfirmacion(
        `Pedido ${respuesta.pedido.numeroPedido} confirmado a nombre de ${datos.nombre}. Te avisaremos por correo (${datos.email}) el estado de preparación y despacho.`
      );
      vaciarCarrito();
    } catch (error) {
      setErrorPedido(error instanceof ApiError ? error.message : 'No fue posible confirmar el pedido.');
    } finally {
      setEnviando(false);
    }
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

          {errorPedido && (
            <Alert variant="danger" onClose={() => setErrorPedido('')} dismissible>
              {errorPedido}
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
