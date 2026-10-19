import { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import CampoFormulario from '../molecules/CampoFormulario';
import Boton from '../atoms/Boton';
import {
  validarTexto,
  validarEmail,
  validarTelefono,
  validarRut,
  formatoRut,
} from '../../utils/validaciones';

// ORGANISMO: formulario de datos de entrega del pedido (checkout).
// Dueño de sus valores y errores, igual que FormularioContacto. Dos
// particularidades:
//  - la dirección solo es obligatoria si la entrega es "despacho";
//  - si el carrito está vacío, no deja confirmar y lo avisa con un Alert
//    (en la versión HTML esto era un alert() ahora es estado en React).
// La elección retiro/despacho llega controlada desde la página, porque el
// resumen del carrito (que vive fuera de este formulario) también depende
// de ella.
const VALIDADORES = {
  nombre: (valor) => validarTexto(valor, 2),
  rut: (valor) => validarRut(valor),
  email: (valor) => validarEmail(valor),
  telefono: (valor) => validarTelefono(valor),
};

const VALORES_INICIALES = { nombre: '', rut: '', email: '', telefono: '', direccion: '' };

function FormularioCheckout({ entrega, onEntregaChange, carritoVacio, onEnviar }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const [avisoCarrito, setAvisoCarrito] = useState('');

  function esDespacho() {
    return entrega === 'despacho';
  }

  function validarDireccion(valor) {
    if (!esDespacho()) return ''; // retiro en tienda: no se pide dirección
    return validarTexto(valor, 8);
  }

  function manejarCambio(campo, valor) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
    const validador = campo === 'direccion' ? validarDireccion : VALIDADORES[campo];
    if (errores[campo]) {
      setErrores((anteriores) => ({ ...anteriores, [campo]: validador(valor) }));
    }
  }

  function manejarBlur(campo) {
    const validador = campo === 'direccion' ? validarDireccion : VALIDADORES[campo];
    setErrores((anteriores) => ({ ...anteriores, [campo]: validador(valores[campo]) }));

    // Si el RUT es válido, se reescribe formateado (12.345.678-5).
    if (campo === 'rut' && !validarRut(valores.rut)) {
      setValores((anteriores) => ({ ...anteriores, rut: formatoRut(valores.rut) }));
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    setAvisoCarrito('');

    if (carritoVacio) {
      setAvisoCarrito(
        'Tu carrito está vacío. Agrega productos desde el catálogo antes de confirmar el pedido.'
      );
      return;
    }

    const nuevosErrores = {};
    Object.keys(VALIDADORES).forEach((campo) => {
      nuevosErrores[campo] = VALIDADORES[campo](valores[campo]);
    });
    nuevosErrores.direccion = validarDireccion(valores.direccion);
    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(Boolean)) return;

    onEnviar({ ...valores, rut: formatoRut(valores.rut), entrega });
    setValores(VALORES_INICIALES);
    setErrores({});
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      <fieldset className="mb-4 border rounded p-3">
        <legend className="fs-6 fw-semibold px-2">¿Cómo quieres recibir tu pedido?</legend>
        <div className="d-flex flex-column gap-2">
          <Form.Check
            type="radio"
            id="entrega-retiro"
            name="entrega"
            value="retiro"
            checked={entrega === 'retiro'}
            onChange={() => onEntregaChange('retiro')}
            label="Retiro en tienda (Viña del Mar) — gratis"
          />
          <Form.Check
            type="radio"
            id="entrega-despacho"
            name="entrega"
            value="despacho"
            checked={entrega === 'despacho'}
            onChange={() => onEntregaChange('despacho')}
            label="Despacho a domicilio — $4.990"
          />
        </div>
      </fieldset>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <CampoFormulario
            id="checkout-nombre"
            etiqueta="Nombre completo"
            valor={valores.nombre}
            onChange={(e) => manejarCambio('nombre', e.target.value)}
            onBlur={() => manejarBlur('nombre')}
            error={errores.nombre}
            autoComplete="name"
          />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario
            id="checkout-rut"
            etiqueta="RUT"
            placeholder="12.345.678-5"
            valor={valores.rut}
            onChange={(e) => manejarCambio('rut', e.target.value)}
            onBlur={() => manejarBlur('rut')}
            error={errores.rut}
            ayuda="Con guión y dígito verificador, ej: 12.345.678-5"
            autoComplete="off"
          />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario
            id="checkout-email"
            etiqueta="Correo electrónico"
            tipo="email"
            valor={valores.email}
            onChange={(e) => manejarCambio('email', e.target.value)}
            onBlur={() => manejarBlur('email')}
            error={errores.email}
            autoComplete="email"
          />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario
            id="checkout-telefono"
            etiqueta="Teléfono"
            tipo="tel"
            placeholder="Ej: +56 9 1234 5678"
            valor={valores.telefono}
            onChange={(e) => manejarCambio('telefono', e.target.value)}
            onBlur={() => manejarBlur('telefono')}
            error={errores.telefono}
            autoComplete="tel"
          />
        </div>
        <div className="col-12">
          <CampoFormulario
            id="checkout-direccion"
            etiqueta="Dirección de despacho"
            valor={valores.direccion}
            onChange={(e) => manejarCambio('direccion', e.target.value)}
            onBlur={() => manejarBlur('direccion')}
            error={errores.direccion}
            ayuda="Solo si elegiste despacho a domicilio"
            autoComplete="street-address"
          />
        </div>
      </div>

      {avisoCarrito && <Alert variant="warning">{avisoCarrito}</Alert>}

      <Boton texto="Confirmar pedido" tipo="submit" />
    </Form>
  );
}

export default FormularioCheckout;
