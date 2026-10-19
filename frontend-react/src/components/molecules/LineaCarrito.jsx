import { Form } from 'react-bootstrap';
import { formatoCLP } from '../../utils/formato';

// MOLÉCULA: una línea del carrito (producto + cantidad + total + quitar).
// No modifica nada por sí sola: avisa a la página con onCambiarCantidad y
// onQuitar, que son las que llaman al contexto del carrito.
function LineaCarrito({ producto, cantidad, onCambiarCantidad, onQuitar }) {
  function manejarCambio(evento) {
    const nueva = parseInt(evento.target.value, 10) || 1;
    onCambiarCantidad(nueva);
  }

  return (
    <div className="linea-carrito">
      <div>
        <div className="linea-nombre">{producto.nombre}</div>
        <div className="linea-meta">
          {producto.marca} · {producto.modelo} · {formatoCLP(producto.precio)} c/u
        </div>
      </div>

      <div className="cant-control">
        <button
          type="button"
          aria-label={`Disminuir cantidad de ${producto.nombre}`}
          onClick={() => onCambiarCantidad(cantidad - 1)}
        >
          −
        </button>
        <Form.Control
          type="number"
          min={1}
          max={producto.stock}
          value={cantidad}
          aria-label={`Cantidad de ${producto.nombre}`}
          onChange={manejarCambio}
        />
        <button
          type="button"
          aria-label={`Aumentar cantidad de ${producto.nombre}`}
          onClick={() => onCambiarCantidad(cantidad + 1)}
        >
          +
        </button>
      </div>

      <div className="linea-meta linea-total">{formatoCLP(producto.precio * cantidad)}</div>

      <button type="button" className="quitar-item" onClick={onQuitar}>
        Quitar
      </button>
    </div>
  );
}

export default LineaCarrito;
