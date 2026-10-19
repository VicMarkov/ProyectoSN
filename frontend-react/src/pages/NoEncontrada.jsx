import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import { useTituloPagina } from '../hooks/useTituloPagina';

// PÁGINA: "no encontrada". La ruta "*" de App.jsx la muestra para cualquier
// dirección que no calce con las demás.
function NoEncontrada() {
  useTituloPagina('Página no encontrada');
  const navigate = useNavigate();

  return (
    <PlantillaSitio>
      <section className="seccion">
        <Container className="text-center">
          <h1>404</h1>
          <p className="seccion-intro mx-auto">
            La página que buscas no existe o cambió de dirección.
          </p>
          <Button onClick={() => navigate('/catalogo')}>Ir al catálogo</Button>
        </Container>
      </section>
    </PlantillaSitio>
  );
}

export default NoEncontrada;
