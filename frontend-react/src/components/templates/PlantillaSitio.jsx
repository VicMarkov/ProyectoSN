import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';

// TEMPLATE: esqueleto común de las páginas públicas del sitio (cabecera,
// contenido y pie). Solo las plantillas y las páginas usan el router:
// aquí nace navigate con useNavigate y se lo reparte por props a Navbar y
// Footer, que así no dependen del router y se prueban sin él.
//
// props.children es el contenido que cada página pone dentro de la
// plantilla (<PlantillaSitio> ... </PlantillaSitio>).
function PlantillaSitio({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sitio d-flex flex-column min-vh-100">
      <Navbar onNavegar={navigate} rutaActual={location.pathname} />
      <main className="flex-grow-1">{children}</main>
      <Footer onNavegar={navigate} />
    </div>
  );
}

export default PlantillaSitio;
