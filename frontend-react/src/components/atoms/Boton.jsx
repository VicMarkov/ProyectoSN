import { Button, Spinner } from 'react-bootstrap';

// ÁTOMO: un botón.
// Recibe texto, variante y onClick, y se limita a mostrarse. El mismo
// Boton sirve para "Iniciar sesión", "Cancelar" o cualquier otra acción
// en cualquier pantalla del proyecto.
function Boton({ texto, variante = 'primary', tipo = 'button', cargando = false, ...resto }) {
  return (
    <Button variant={variante} type={tipo} disabled={cargando} {...resto}>
      {cargando ? (
        <>
          <Spinner as="span" animation="border" size="sm" className="me-2" />
          Ingresando...
        </>
      ) : (
        texto
      )}
    </Button>
  );
}

export default Boton;
