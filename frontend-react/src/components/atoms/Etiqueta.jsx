import { Form } from 'react-bootstrap';

// ÁTOMO: una etiqueta de formulario.
// No sabe nada del formulario en el que vive: solo muestra un texto
// asociado a un campo (htmlFor). Si la dividieras en algo más chico,
// dejaría de ser útil por sí sola.
function Etiqueta({ texto, para }) {
  return (
    <Form.Label htmlFor={para} className="fw-semibold">
      {texto}
    </Form.Label>
  );
}

export default Etiqueta;
