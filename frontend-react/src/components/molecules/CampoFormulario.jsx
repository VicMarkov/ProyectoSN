import { Form } from 'react-bootstrap';
import Etiqueta from '../atoms/Etiqueta';
import CampoTexto from '../atoms/CampoTexto';

// MOLÉCULA: Etiqueta + CampoTexto + mensaje de error, trabajando juntos
// para una sola responsabilidad clara: "capturar un dato del formulario
// y mostrar si es válido". Ya no es genérica como los átomos, pero
// tampoco es una sección completa de la pantalla todavía.
function CampoFormulario({ id, etiqueta, tipo, valor, onChange, onBlur, placeholder, error, ayuda }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Etiqueta texto={etiqueta} para={id} />
      <CampoTexto
        id={id}
        tipo={tipo}
        valor={valor}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        esInvalido={Boolean(error)}
      />
      {ayuda && !error && <Form.Text className="text-muted">{ayuda}</Form.Text>}
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}

export default CampoFormulario;
