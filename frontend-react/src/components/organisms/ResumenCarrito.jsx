import { formatoCLP } from '../../utils/formato';

// ORGANISMO: resumen del pedido (cantidad, subtotal, despacho y total).
// Solo presenta datos calculados por la página; no calcula ni modifica nada.
function ResumenCarrito({ cantidadItems, subtotal, despacho, entrega }) {
  const total = subtotal + despacho;

  return (
    <aside className="resumen">
      <h3>Resumen</h3>
      <div className="resumen-linea">
        <span>Productos</span>
        <span>{cantidadItems}</span>
      </div>
      <div className="resumen-linea">
        <span>Subtotal</span>
        <span>{formatoCLP(subtotal)}</span>
      </div>
      <div className="resumen-linea">
        <span>Despacho</span>
        <span>
          {entrega === 'despacho' && despacho > 0 ? formatoCLP(despacho) : 'Gratis (retiro en tienda)'}
        </span>
      </div>
      <div className="resumen-linea total">
        <span>Total</span>
        <span>{formatoCLP(total)}</span>
      </div>
    </aside>
  );
}

export default ResumenCarrito;
