import { useEffect, useMemo, useRef, useState } from 'react';
import { Container, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import PlantillaSitio from '../components/templates/PlantillaSitio';
import CampoFormulario from '../components/molecules/CampoFormulario';
import TarjetaProducto from '../components/molecules/TarjetaProducto';
import * as productosService from '../services/productos';
import { useCart } from '../context/CarritoContext';
import { useTituloPagina } from '../hooks/useTituloPagina';

function mapearProducto(producto) {
  return {
    id: producto.id,
    codigo: producto.sku,
    categoria: producto.categoria,
    nombre: producto.nombre,
    marca: producto.marca,
    modelo: producto.modelo,
    stock: producto.stock,
    precio: producto.precio,
    descripcion: producto.descripcion,
  };
}

// PÁGINA: catálogo. Obtiene los productos desde la API y filtra en cliente.
function Catalogo() {
  useTituloPagina('Catálogo');
  const { agregarProducto } = useCart();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [termino, setTermino] = useState('');
  const [agregado, setAgregado] = useState(null);
  const reloj = useRef(null);

  useEffect(() => () => clearTimeout(reloj.current), []);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    productosService
      .listar({ limite: 100 })
      .then(({ productos: recibidos }) => {
        if (activo) setProductos(recibidos.map(mapearProducto));
      })
      .catch((err) => {
        if (activo) setError(err.message || 'No fue posible cargar el catálogo.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  const categorias = useMemo(
    () => [...new Set(productos.map((producto) => producto.categoria))].sort(),
    [productos]
  );

  const opcionesCategoria = useMemo(
    () => [{ valor: 'todas', texto: 'Todas las categorías' }, ...categorias.map((cat) => ({ valor: cat, texto: cat }))],
    [categorias]
  );

  const visibles = useMemo(() => {
    const buscado = termino.trim().toLowerCase();
    return productos.filter((producto) => {
      const coincideCategoria = categoria === 'todas' || producto.categoria === categoria;
      const coincideTexto =
        !buscado ||
        producto.nombre.toLowerCase().includes(buscado) ||
        producto.marca.toLowerCase().includes(buscado) ||
        producto.modelo.toLowerCase().includes(buscado) ||
        producto.codigo.toLowerCase().includes(buscado);
      return coincideCategoria && coincideTexto;
    });
  }, [productos, categoria, termino]);

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
              Catálogo actualizado con stock y precio vigentes.
            </p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

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
                opciones={opcionesCategoria}
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

          {cargando ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <p className="resultado-info" aria-live="polite">
                {visibles.length} producto(s) encontrados de {productos.length} referencias totales del catálogo.
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
            </>
          )}
        </Container>
      </section>
    </PlantillaSitio>
  );
}

export default Catalogo;
