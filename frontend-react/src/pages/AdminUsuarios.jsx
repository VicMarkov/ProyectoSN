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
import * as usuariosService from '../services/usuarios';
import { ApiError } from '../services/api';
import { useTituloPagina } from '../hooks/useTituloPagina';

const ROLES = ['Administrador', 'Vendedor', 'Cliente'];

function AdminUsuarios() {
  useTituloPagina('Administración de usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ q: '', rol: '', activo: '' });
  const [modal, setModal] = useState({ abierto: false, usuario: null });
  const [passwordModal, setPasswordModal] = useState({ abierto: false, id: null });
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    rol: 'Cliente',
  });
  const [password, setPassword] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      const [lista, rolesResp] = await Promise.all([
        usuariosService.listar({
          q: filtros.q || undefined,
          rol: filtros.rol || undefined,
          activo: filtros.activo || undefined,
          limite: 100,
        }),
        usuariosService.listarRoles(),
      ]);
      setUsuarios(lista.usuarios);
      setRoles(rolesResp.roles);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  function abrirCrear() {
    setForm({ nombre: '', email: '', password: '', telefono: '', rol: 'Cliente' });
    setModal({ abierto: true, usuario: null });
  }

  function abrirEditar(usuario) {
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      telefono: usuario.telefono || '',
      rol: usuario.rol,
    });
    setModal({ abierto: true, usuario });
  }

  async function guardar(evento) {
    evento.preventDefault();
    setGuardando(true);
    setError('');
    try {
      if (modal.usuario) {
        await usuariosService.actualizar(modal.usuario.id, {
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          rol: form.rol,
        });
        if (form.password) {
          await usuariosService.restablecerPassword(modal.usuario.id, form.password);
        }
      } else {
        await usuariosService.crear({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          telefono: form.telefono,
          rol: form.rol,
        });
      }
      setModal({ abierto: false, usuario: null });
      await cargar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible guardar el usuario.');
    } finally {
      setGuardando(false);
    }
  }

  async function toggleEstado(usuario) {
    try {
      await usuariosService.cambiarEstado(usuario.id, !usuario.activo);
      await cargar();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible cambiar el estado.');
    }
  }

  async function guardarPassword(evento) {
    evento.preventDefault();
    setGuardando(true);
    try {
      await usuariosService.restablecerPassword(passwordModal.id, password);
      setPasswordModal({ abierto: false, id: null });
      setPassword('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible cambiar la contraseña.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <PlantillaSitio>
      <section className="seccion">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>Usuarios</h1>
            <Button onClick={abrirCrear}>Nuevo usuario</Button>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form className="row g-2 mb-3">
            <div className="col-md-4">
              <Form.Control
                placeholder="Buscar por nombre o correo"
                value={filtros.q}
                onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <Form.Select
                value={filtros.rol}
                onChange={(e) => setFiltros({ ...filtros, rol: e.target.value })}
              >
                <option value="">Todos los roles</option>
                {ROLES.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </Form.Select>
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
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      <Badge bg={usuario.activo ? 'success' : 'secondary'}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="d-flex gap-2">
                      <Button size="sm" variant="outline-primary" onClick={() => abrirEditar(usuario)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-warning"
                        onClick={() => setPasswordModal({ abierto: true, id: usuario.id })}
                      >
                        Clave
                      </Button>
                      <Button
                        size="sm"
                        variant={usuario.activo ? 'outline-danger' : 'outline-success'}
                        onClick={() => toggleEstado(usuario)}
                      >
                        {usuario.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Modal show={modal.abierto} onHide={() => setModal({ abierto: false, usuario: null })}>
            <Form onSubmit={guardar}>
              <Modal.Header closeButton>
                <Modal.Title>{modal.usuario ? 'Editar usuario' : 'Nuevo usuario'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </Form.Group>
                {!modal.usuario && (
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      minLength={8}
                    />
                  </Form.Group>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    value={form.rol}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  >
                    {ROLES.map((rol) => (
                      <option key={rol} value={rol}>
                        {rol}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                {modal.usuario && (
                  <Form.Group className="mb-3">
                    <Form.Label>Nueva contraseña (opcional)</Form.Label>
                    <Form.Control
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      minLength={8}
                    />
                  </Form.Group>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModal({ abierto: false, usuario: null })}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          <Modal
            show={passwordModal.abierto}
            onHide={() => setPasswordModal({ abierto: false, id: null })}
          >
            <Form onSubmit={guardarPassword}>
              <Modal.Header closeButton>
                <Modal.Title>Restablecer contraseña</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setPasswordModal({ abierto: false, id: null })}>
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

export default AdminUsuarios;
