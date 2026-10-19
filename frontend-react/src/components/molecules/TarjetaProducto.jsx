import { Card, Badge } from 'react-bootstrap';
import Boton from '../atoms/Boton';
import { formatoCLP } from '../../utils/formato';

// MOLÉCULA: tarjeta de producto del catálogo. Muestra categoría, nombre,
// marca, descripción, precio, stock y el botón para agregarla al carrito.
// No sabe de dónde viene el producto ni en qué página está: recibe datos y
// una función (onAgregar) desde el organismo/página que la usa.
function TarjetaProducto({ producto, onAgregar, agregado = false }) {
  const agotado = producto.stock === 0;
  const ultimasUnidades = !agotado && producto.stock <= 3;

  return (
    <Card className="producto-card h-100">
      <Card.Body className="d-flex flex-column">
        {agotado && (
          <Badge bg="danger" className="producto-tag align-self-start">
            Sin stock
          </Badge>
        )}
        {ultimasUnidades && (
          <Badge bg="warning" text="dark" className="producto-tag align-self-start">
            Últimas {producto.stock}
          </Badge>
        )}

        <span className="producto-categoria">{producto.categoria}</span>
        <h3 className="producto-nombre">{producto.nombre}</h3>
        <span className="producto-marca">
          {producto.marca} · {producto.modelo}
        </span>
        <p className="producto-desc">{producto.descripcion}</p>
        <span className="producto-precio">{formatoCLP(producto.precio)}</span>
        <span className="producto-stock">Stock disponible: {producto.stock} unidades</span>
      </Card.Body>

      <Card.Footer className="producto-footer">
        <Boton
          texto={agotado ? 'Sin stock' : agregado ? 'Agregado ✓' : 'Agregar al carrito'}
          variante={agregado ? 'success' : 'primary'}
          disabled={agotado}
          onClick={() => onAgregar(producto.codigo)}
          className="w-100"
        />
      </Card.Footer>
    </Card>
  );
}

export default TarjetaProducto;
