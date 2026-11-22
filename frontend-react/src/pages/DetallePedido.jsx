import { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Table,
  Badge,
  Spinner,
  Alert,
  Form,
  Button,
  Row,
  Col,
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import * as pedidosService from '../services/pedidos';
import { ApiError } from '../services/api';
import { useSesion } from '../context/SesionContext';
import { useTituloPagina } from '../hooks/useTituloPagina';

const ESTADOS = ['EN_PREPARACION', 'DESPACHADO', 'ENTREGADO'];

function colorEstado(estado) {
  if (estado === 'ENTREGADO') return 'success';
  if (estado === 'DESPACHADO') return 'info';
  return 'warning';
}

function DetallePedido() {
  useTituloPagina('Detalle del pedido');
  const { id } = useParams();
  const navigate = useNavigate();
  const { sesion } = useSesion();
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observacion, setObservacion] = useState('');
  const [actualizando, setActualizando] = useState(false);

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      const recibido = await pedidosService.obtener(Number(id));
      setPedido(recibido.pedido);
      setNuevoEstado(recibido.pedido.estado);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible cargar el pedido.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function cambiarEstado(evento) {
    evento.preventDefault();
    setActualizando(true);
    setError('');
    try {
      const actualizado = await pedidosService.cambiarEstado(Number(id), nuevoEstado, observacion);
      setPedido(actualizado.pedido);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible actualizar el estado.');
    } finally {
      setActualizando(false);
    }
  }

  const puedeCambiarEstado =
    sesion && (sesion.rol === 'Administrador' || sesion.rol === 'Vendedor');

  return (
    <PlantillaSitio>
      <section className="seccion">
        <Container>
          {cargando ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : pedido ? (
            <>
              <h1>Pedido {pedido.numeroPedido}</h1>
              <Row className="g-4">
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <p>
                        <strong>Estado:</strong>{' '}
                        <Badge bg={colorEstado(pedido.estado)}>{pedido.estado}</Badge>
                      </p>
                      <p>
                        <strong>Fecha:</strong> {new Date(pedido.fechaCreacion).toLocaleString('es-CL')}
                      </p>
                      <p>
                        <strong>Cliente:</strong> {pedido.nombreContacto} ({pedido.emailContacto})
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {pedido.telefonoContacto}
                      </p>
                      <p>
                        <strong>Entrega:</strong> {pedido.tipoEntrega}
                      </p>
                      {pedido.direccionDespacho && (
                        <p>
                          <strong>Dirección:</strong> {pedido.direccionDespacho}
                        </p>
                      )}
                      <p>
                        <strong>Subtotal:</strong> ${pedido.subtotal.toLocaleString('es-CL')}
                      </p>
                      <p>
                        <strong>Envío:</strong> ${pedido.costoEnvio.toLocaleString('es-CL')}
                      </p>
                      <p>
                        <strong>Total:</strong> ${pedido.total.toLocaleString('es-CL')}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h5>Productos</h5>
                      <Table size="sm">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedido.detalle.map((linea) => (
                            <tr key={linea.id}>
                              <td>{linea.nombre}</td>
                              <td>{linea.cantidad}</td>
                              <td>${linea.precioUnitario.toLocaleString('es-CL')}</td>
                              <td>${linea.subtotal.toLocaleString('es-CL')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="mt-4">
                <Card.Body>
                  <h5>Historial de estados</h5>
                  <ul>
                    {pedido.historial.map((h) => (
                      <li key={h.id}>
                        {h.estadoAnterior ? `${h.estadoAnterior} → ` : ''}
                        {h.estadoNuevo} ({new Date(h.fechaCambio).toLocaleString('es-CL')})
                        {h.usuario ? ` por ${h.usuario}` : ''}
                        {h.observacion ? ` - ${h.observacion}` : ''}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>

              {puedeCambiarEstado && (
                <Card className="mt-4">
                  <Card.Body>
                    <h5>Actualizar estado</h5>
                    <Form onSubmit={cambiarEstado}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nuevo estado</Form.Label>
                        <Form.Select
                          value={nuevoEstado}
                          onChange={(e) => setNuevoEstado(e.target.value)}
                        >
                          {ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Observación</Form.Label>
                        <Form.Control
                          value={observacion}
                          onChange={(e) => setObservacion(e.target.value)}
                        />
                      </Form.Group>
                      <Button type="submit" disabled={actualizando}>
                        {actualizando ? 'Actualizando...' : 'Actualizar estado'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              <Button className="mt-3" variant="secondary" onClick={() => navigate(-1)}>
                Volver
              </Button>
            </>
          ) : null}
        </Container>
      </section>
    </PlantillaSitio>
  );
}

export default DetallePedido;
