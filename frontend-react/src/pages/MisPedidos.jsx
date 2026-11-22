import { useEffect, useState } from 'react';
import { Container, Table, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import * as pedidosService from '../services/pedidos';
import { ApiError } from '../services/api';
import { useTituloPagina } from '../hooks/useTituloPagina';

function colorEstado(estado) {
  if (estado === 'ENTREGADO') return 'success';
  if (estado === 'DESPACHADO') return 'info';
  return 'warning';
}

function MisPedidos() {
  useTituloPagina('Mis pedidos');
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    pedidosService
      .listar({ limite: 100 })
      .then(({ pedidos: recibidos }) => {
        if (activo) setPedidos(recibidos);
      })
      .catch((err) => {
        if (activo) setError(err instanceof ApiError ? err.message : 'No fue posible cargar los pedidos.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  return (
    <PlantillaSitio>
      <section className="seccion">
        <Container>
          <h1>Mis pedidos</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {cargando ? (
            <Spinner animation="border" />
          ) : pedidos.length === 0 ? (
            <Alert variant="info">
              Aún no tienes pedidos. <Button variant="link" onClick={() => navigate('/catalogo')}>Ir al catálogo</Button>
            </Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Número</th>
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

export default MisPedidos;
