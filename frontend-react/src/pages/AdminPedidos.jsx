import { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Badge,
  Spinner,
  Alert,
  Form,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import * as pedidosService from '../services/pedidos';
import { ApiError } from '../services/api';
import { useTituloPagina } from '../hooks/useTituloPagina';

const ESTADOS = ['EN_PREPARACION', 'DESPACHADO', 'ENTREGADO'];

function colorEstado(estado) {
  if (estado === 'ENTREGADO') return 'success';
  if (estado === 'DESPACHADO') return 'info';
  return 'warning';
}

function AdminPedidos() {
  useTituloPagina('Administración de pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [estado, setEstado] = useState('');

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      const lista = await pedidosService.listar({ estado: estado || undefined, limite: 100 });
      setPedidos(lista.pedidos);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible cargar los pedidos.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  return (
    <PlantillaSitio>
      <section className="seccion">
        <Container>
          <h1>Pedidos</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form className="mb-3" style={{ maxWidth: 280 }}>
            <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              {ESTADOS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form>

          {cargando ? (
            <Spinner animation="border" />
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Entrega</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.numeroPedido}</td>
                    <td>{pedido.cliente}</td>
                    <td>{new Date(pedido.fechaCreacion).toLocaleDateString('es-CL')}</td>
                    <td>
                      <Badge bg={colorEstado(pedido.estado)}>{pedido.estado}</Badge>
                    </td>
                    <td>{pedido.tipoEntrega}</td>
                    <td>${pedido.total.toLocaleString('es-CL')}</td>
                    <td>
                      <Link to={`/pedidos/${pedido.id}`}>Ver detalle</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Container>
      </section>
    </PlantillaSitio>
  );
}

export default AdminPedidos;
