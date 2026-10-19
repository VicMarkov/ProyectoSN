import { useEffect, useMemo, useRef, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import CampoFormulario from '../components/molecules/CampoFormulario';
import TarjetaProducto from '../components/molecules/TarjetaProducto';
import { PRODUCTOS, categorias } from '../data/productos';
import { useCart } from '../context/CarritoContext';
import { useTituloPagina } from '../hooks/useTituloPagina';

const OPCIONES_CATEGORIA = [
  { valor: 'todas', texto: 'Todas las categorías' },
  ...categorias.map((categoria) => ({ valor: categoria, texto: categoria })),
];

// PÁGINA: catálogo. Filtra con dos useState (categoría y término de
// búsqueda) y memoriza el resultado con useMemo para no recalcularlo en
// cada render que no cambió los filtros.
function Catalogo() {
  useTituloPagina('Catálogo');
  const { agregarProducto } = useCart();

  const [categoria, setCategoria] = useState('todas');
  const [termino, setTermino] = useState('');
  const [agregado, setAgregado] = useState(null); // código recién agregado
  const reloj = useRef(null);

  // Al desmontar, no queda ningún temporizador escribiendo en estado.
  useEffect(() => () => clearTimeout(reloj.current), []);

  const visibles = useMemo(() => {
    const buscado = termino.trim().toLowerCase();
    return PRODUCTOS.filter((producto) => {
      const coincideCategoria = categoria === 'todas' || producto.categoria === categoria;
      const coincideTexto =
        !buscado ||
        producto.nombre.toLowerCase().includes(buscado) ||
        producto.marca.toLowerCase().includes(buscado) ||
        producto.modelo.toLowerCase().includes(buscado);
      return coincideCategoria && coincideTexto;
    });
  }, [categoria, termino]);

  function manejarAgregar(codigo) {
    agregarProducto(codigo, 1);
    setAgregado(codigo);
    clearTimeout(reloj.current);
    reloj.current = setTimeout(() => setAgregado(null), 1200);
  }

  return (
    <PlantillaSitio>
      <section className="seccion">
        <Container>
          <div className="seccion-intro">
            <h1>Catálogo</h1>
            <p>
              340 referencias distintas repartidas en 12 categorías. Esta vista muestra una
              selección representativa con stock y precio actualizados.
            </p>
          </div>

          <Form
            role="search"
            className="catalogo-toolbar"
            onSubmit={(evento) => evento.preventDefault()}
          >
            <div className="campo">
              <CampoFormulario
                id="filtro-categoria"
                etiqueta="Categoría"
                valor={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                opciones={OPCIONES_CATEGORIA}
              />
            </div>
            <div className="campo-buscar">
              <CampoFormulario
                id="filtro-buscar"
                etiqueta="Buscar por nombre o marca"
                tipo="search"
                placeholder="Ej: Stratocaster, Yamaha, pedal de reverb..."
                valor={termino}
                onChange={(e) => setTermino(e.target.value)}
              />
            </div>
          </Form>

          <p className="resultado-info" aria-live="polite">
            {visibles.length} producto(s) encontrados de 340 referencias totales del catálogo.
          </p>

          {visibles.length === 0 ? (
            <p className="sin-resultados">
              No encontramos productos con ese filtro. Prueba con otra categoría o término de
              búsqueda.
            </p>
          ) : (
            <Row className="g-4">
              {visibles.map((producto) => (
                <Col key={producto.codigo} xs={12} sm={6} lg={4}>
                  <TarjetaProducto
                    producto={producto}
                    agregado={agregado === producto.codigo}
                    onAgregar={manejarAgregar}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </PlantillaSitio>
  );
}

export default Catalogo;
