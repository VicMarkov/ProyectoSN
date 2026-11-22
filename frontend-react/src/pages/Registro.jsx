import { useState } from 'react';
import { Container, Form, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import { useSesion } from '../context/SesionContext';
import { ApiError } from '../services/api';
import { useTituloPagina } from '../hooks/useTituloPagina';

function Registro() {
  useTituloPagina('Registro');
  const navigate = useNavigate();
  const { registrar, iniciarSesion } = useSesion();
  const [valores, setValores] = useState({ nombre: '', email: '', password: '', telefono: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registrar(valores);
      await iniciarSesion(valores.email, valores.password);
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No fue posible crear la cuenta.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <PlantillaSitio>
      <section className="seccion">
        <Container style={{ maxWidth: 560 }}>
          <h1>Crear cuenta</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={manejarEnvio}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                value={valores.nombre}
                onChange={(e) => setValores({ ...valores, nombre: e.target.value })}
                required
                minLength={2}
                maxLength={80}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={valores.email}
                onChange={(e) => setValores({ ...valores, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={valores.password}
                onChange={(e) => setValores({ ...valores, password: e.target.value })}
                required
                minLength={8}
                maxLength={72}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                value={valores.telefono}
                onChange={(e) => setValores({ ...valores, telefono: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" disabled={cargando}>
              {cargando ? 'Creando...' : 'Crear cuenta'}
            </Button>
          </Form>
        </Container>
      </section>
    </PlantillaSitio>
  );
}

export default Registro;
