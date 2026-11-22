import { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
  Badge,
} from 'react-bootstrap';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import * as productosService from '../services/productos';
import { ApiError } from '../services/api';
import { useTituloPagina } from '../hooks/useTituloPagina';

function AdminProductos() {
  useTituloPagina('Administración de productos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ q: '', activo: '' });
  const [modal, setModal] = useState({ abierto: false, producto: null });
  const [stockModal, setStockModal] = useState({ abierto: false, id: null });
  const [form, setForm] = useState({
    sku: '',
    nombre: '',
    modelo: '',
    descripcion: '',
    precio: '',
    stock: '',
    stockMinimo: '',
    idCategoria: '',
    idMarca: '',
  });
  const [ajuste, setAjuste] = useState({ tipo: 'ENTRADA', cantidad: 1, motivo: '' });
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      const [lista, cats, mars] = await Promise.all([
        productosService.listarAdmin({
          q: filtros.q || undefined,
          activo: filtros.activo || undefined,
          limite: 100,
        }),
        productosService.listarCategorias(),
        productosService.listarMarcas(),
      ]);
      setProductos(Array.isArray(lista.productos) ? lista.productos : []);
      setCategorias(Array.isArray(cats) ? cats : Array.isArray(cats?.categorias) ? cats.categorias : []);
      setMarcas(Array.isArray(mars) ? mars : Array.isArray(mars?.marcas) ? mars.marcas : []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible cargar los productos.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  function abrirCrear() {
    setForm({
      sku: '',
      nombre: '',
      modelo: '',
      descripcion: '',
      precio: '',
      stock: '',
      stockMinimo: '3',
      idCategoria: categorias[0]?.id || '',
      idMarca: marcas[0]?.id || '',
    });
    setModal({ abierto: true, producto: null });
  }

  function abrirEditar(producto) {
    setForm({
      sku: producto.sku,
      nombre: producto.nombre,
      modelo: producto.modelo || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo,
      idCategoria: producto.idCategoria,
      idMarca: producto.idMarca,
    });
    setModal({ abierto: true, producto });
  }

  async function guardar(evento) {
    evento.preventDefault();
    setGuardando(true);
    setError('');
    const datos = {
      sku: form.sku,
      nombre: form.nombre,
      modelo: form.modelo,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockMinimo: Number(form.stockMinimo),
      idCategoria: Number(form.idCategoria),
      idMarca: Number(form.idMarca),
    };
    try {
      if (modal.producto) {
        await productosService.actualizar(modal.producto.id, datos);
      } else {
        await productosService.crear(datos);
      }
      setModal({ abierto: false, producto: null });
      await cargar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible guardar el producto.');
    } finally {
      setGuardando(false);
    }
  }

  async function toggleEstado(producto) {
    try {
      await productosService.cambiarEstado(producto.id, !producto.activo);
      await cargar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible cambiar el estado.');
    }
  }

  async function guardarStock(evento) {
    evento.preventDefault();
    setGuardando(true);
    try {
      await productosService.ajustarStock(stockModal.id, {
        tipo: ajuste.tipo,
        cantidad: Number(ajuste.cantidad),
        motivo: ajuste.motivo,
      });
      setStockModal({ abierto: false, id: null });
      setAjuste({ tipo: 'ENTRADA', cantidad: 1, motivo: '' });
      await cargar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible ajustar el stock.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <PlantillaSitio>
      <section className="seccion">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>Productos</h1>
            <Button onClick={abrirCrear}>Nuevo producto</Button>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form className="row g-2 mb-3">
            <div className="col-md-6">
              <Form.Control
                placeholder="Buscar por nombre, SKU o marca"
                value={filtros.q}
                onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <Form.Select
                value={filtros.activo}
                onChange={(e) => setFiltros({ ...filtros, activo: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </Form.Select>
            </div>
          </Form>

          {cargando ? (
            <Spinner animation="border" />
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(productos) ? productos : []).map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.sku}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td>{producto.marca}</td>
                    <td>${producto.precio.toLocaleString('es-CL')}</td>
                    <td>{producto.stock}</td>
                    <td>
                      <Badge bg={producto.activo ? 'success' : 'secondary'}>
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="d-flex gap-2">
                      <Button size="sm" variant="outline-primary" onClick={() => abrirEditar(producto)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-info"
                        onClick={() => setStockModal({ abierto: true, id: producto.id })}
                      >
                        Stock
                      </Button>
                      <Button
                        size="sm"
                        variant={producto.activo ? 'outline-danger' : 'outline-success'}
                        onClick={() => toggleEstado(producto)}
                      >
                        {producto.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Modal show={modal.abierto} onHide={() => setModal({ abierto: false, producto: null })}>
            <Form onSubmit={guardar}>
              <Modal.Header closeButton>
                <Modal.Title>{modal.producto ? 'Editar producto' : 'Nuevo producto'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control
                    value={form.modelo}
                    onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stock mínimo</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={form.stockMinimo}
                    onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={form.idCategoria}
                    onChange={(e) => setForm({ ...form, idCategoria: e.target.value })}
                    required
                  >
                    {(Array.isArray(categorias) ? categorias : []).map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Marca</Form.Label>
                  <Form.Select
                    value={form.idMarca}
                    onChange={(e) => setForm({ ...form, idMarca: e.target.value })}
                    required
                  >
                    {(Array.isArray(marcas) ? marcas : []).map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModal({ abierto: false, producto: null })}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          <Modal
            show={stockModal.abierto}
            onHide={() => setStockModal({ abierto: false, id: null })}
          >
            <Form onSubmit={guardarStock}>
              <Modal.Header closeButton>
                <Modal.Title>Ajustar stock</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    value={ajuste.tipo}
                    onChange={(e) => setAjuste({ ...ajuste, tipo: e.target.value })}
                  >
                    <option value="ENTRADA">Entrada</option>
                    <option value="SALIDA">Salida</option>
                    <option value="AJUSTE">Ajuste</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={ajuste.cantidad}
                    onChange={(e) => setAjuste({ ...ajuste, cantidad: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Motivo</Form.Label>
                  <Form.Control
                    value={ajuste.motivo}
                    onChange={(e) => setAjuste({ ...ajuste, motivo: e.target.value })}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setStockModal({ abierto: false, id: null })}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Container>
      </section>
    </PlantillaSitio>
  );
}

export default AdminProductos;
