import { Form } from 'react-bootstrap';

// ÁTOMO: un select de formulario.
// Recibe la lista de opciones (valor/texto) y el valor elegido, y avisa
// cuando cambia. No decide si la selección es válida.
function CampoSeleccion({ id, valor, onChange, opciones = [], esInvalido, ...resto }) {
  return (
    <Form.Select
      id={id}
      value={valor}
      onChange={onChange}
      isInvalid={esInvalido}
      {...resto}
    >
      {opciones.map((opcion) => (
        <option key={opcion.valor} value={opcion.valor}>
          {opcion.texto}
        </option>
      ))}
    </Form.Select>
  );
}

export default CampoSeleccion;
