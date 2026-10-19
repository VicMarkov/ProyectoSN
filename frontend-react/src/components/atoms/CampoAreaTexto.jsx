import { Form } from 'react-bootstrap';

// ÁTOMO: un área de texto (textarea) de formulario.
// Igual que CampoTexto: solo muestra la caja y avisa cuando cambia su valor.
// No valida nada ni sabe qué significa el campo; eso lo decide la
// molécula/página que lo usa.
function CampoAreaTexto({ id, valor, onChange, placeholder, esInvalido, filas = 4, ...resto }) {
  return (
    <Form.Control
      as="textarea"
      id={id}
      rows={filas}
      value={valor}
      onChange={onChange}
      placeholder={placeholder}
      isInvalid={esInvalido}
      {...resto}
    />
  );
}

export default CampoAreaTexto;
