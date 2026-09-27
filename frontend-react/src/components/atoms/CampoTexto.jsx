import { Form } from 'react-bootstrap';

// ÁTOMO: un campo de texto/contraseña.
// Solo sabe mostrar un input y avisar cuando cambia su valor (onChange).
// No decide si el valor es válido ni qué significa el campo dentro
// del formulario completo; eso lo maneja la molécula/página que lo usa.
function CampoTexto({ id, tipo = 'text', valor, onChange, placeholder, esInvalido, ...resto }) {
  return (
    <Form.Control
      id={id}
      type={tipo}
      value={valor}
      onChange={onChange}
      placeholder={placeholder}
      isInvalid={esInvalido}
      {...resto}
    />
  );
}

export default CampoTexto;
