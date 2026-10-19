import { Form } from 'react-bootstrap';
import Etiqueta from '../atoms/Etiqueta';
import CampoTexto from '../atoms/CampoTexto';
import CampoAreaTexto from '../atoms/CampoAreaTexto';
import CampoSeleccion from '../atoms/CampoSeleccion';

// MOLÉCULA: Etiqueta + campo + mensaje de error, trabajando juntos para una
// sola responsabilidad clara: "capturar un dato del formulario y mostrar si
// es válido". Según la prop que reciba dibuja un átomo u otro:
//   - sin extras           → CampoTexto (input de texto/email/contraseña)
//   - `multilinea`         → CampoAreaTexto (textarea)
//   - `opciones`           → CampoSeleccion (select)
// El valor y los errores viven siempre en el formulario/página de arriba.
function CampoFormulario({
  id,
  etiqueta,
  tipo,
  valor,
  onChange,
  onBlur,
  placeholder,
  error,
  ayuda,
  opciones,
  multilinea,
  filas,
  autoComplete,
}) {
  const invalido = Boolean(error);

  let campo;
  if (opciones) {
    campo = (
      <CampoSeleccion
        id={id}
        valor={valor}
        onChange={onChange}
        onBlur={onBlur}
        opciones={opciones}
        esInvalido={invalido}
      />
    );
  } else if (multilinea) {
    campo = (
      <CampoAreaTexto
        id={id}
        valor={valor}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        esInvalido={invalido}
        filas={filas}
      />
    );
  } else {
    campo = (
      <CampoTexto
        id={id}
        tipo={tipo}
        valor={valor}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        esInvalido={invalido}
        autoComplete={autoComplete}
      />
    );
  }

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Etiqueta texto={etiqueta} para={id} />
      {campo}
      {ayuda && !error && <Form.Text className="text-muted">{ayuda}</Form.Text>}
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}

export default CampoFormulario;
