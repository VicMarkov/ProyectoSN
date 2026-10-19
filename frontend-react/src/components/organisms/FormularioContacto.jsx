import { useState } from 'react';
import { Form } from 'react-bootstrap';
import CampoFormulario from '../molecules/CampoFormulario';
import Boton from '../atoms/Boton';
import {
  validarTexto,
  validarEmail,
  validarTelefono,
  validarSelect,
} from '../../utils/validaciones';

// ORGANISMO: formulario de contacto completo. Es el dueño del estado:
// guarda lo que se escribe en cada campo y los mensajes de error. Al enviar,
// ejecuta TODAS las validaciones (no solo la del primer campo con error) y,
// solo si no hay ningún error, avisa a la página con props.onEnviar.
// Nunca usa alert(): los mensajes se dibujan junto a cada campo.

export const OPCIONES_MOTIVO = [
  { valor: '', texto: 'Selecciona una opción' },
  { valor: 'stock', texto: 'Disponibilidad de un producto' },
  { valor: 'reparacion', texto: 'Reparación de instrumento de cuerda' },
  { valor: 'pedido', texto: 'Estado de un pedido' },
  { valor: 'otro', texto: 'Otro' },
];

const VALIDADORES = {
  nombre: (valor) => validarTexto(valor, 2),
  email: (valor) => validarEmail(valor),
  telefono: (valor) => validarTelefono(valor),
  motivo: (valor) => validarSelect(valor),
  mensaje: (valor) => validarTexto(valor, 10),
};

const VALORES_INICIALES = { nombre: '', email: '', telefono: '', motivo: '', mensaje: '' };

function FormularioContacto({ onEnviar }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});

  function manejarCambio(campo, valor) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
    // Solo vuelve a validar si ese campo ya tenía un error: así el mensaje
    // desaparece en cuanto la persona lo corrige.
    if (errores[campo]) {
      setErrores((anteriores) => ({ ...anteriores, [campo]: VALIDADORES[campo](valor) }));
    }
  }

  function manejarBlur(campo) {
    setErrores((anteriores) => ({
      ...anteriores,
      [campo]: VALIDADORES[campo](valores[campo]),
    }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault(); // cancela la recarga del navegador

    const nuevosErrores = {};
    Object.keys(VALIDADORES).forEach((campo) => {
      nuevosErrores[campo] = VALIDADORES[campo](valores[campo]);
    });
    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(Boolean)) return;

    const motivoTexto = OPCIONES_MOTIVO.find((o) => o.valor === valores.motivo)?.texto ?? '';
    onEnviar({ ...valores, motivoTexto });
    setValores(VALORES_INICIALES);
    setErrores({});
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      <CampoFormulario
        id="contacto-nombre"
        etiqueta="Nombre"
        valor={valores.nombre}
        onChange={(e) => manejarCambio('nombre', e.target.value)}
        onBlur={() => manejarBlur('nombre')}
        error={errores.nombre}
        autoComplete="name"
      />

      <CampoFormulario
        id="contacto-email"
        etiqueta="Correo electrónico"
        tipo="email"
        valor={valores.email}
        onChange={(e) => manejarCambio('email', e.target.value)}
        onBlur={() => manejarBlur('email')}
        error={errores.email}
        autoComplete="email"
      />

      <CampoFormulario
        id="contacto-telefono"
        etiqueta="Teléfono"
        tipo="tel"
        placeholder="Ej: +56 9 1234 5678"
        valor={valores.telefono}
        onChange={(e) => manejarCambio('telefono', e.target.value)}
        onBlur={() => manejarBlur('telefono')}
        error={errores.telefono}
        ayuda="Celular chileno, con o sin +56."
        autoComplete="tel"
      />

      <CampoFormulario
        id="contacto-motivo"
        etiqueta="Motivo de tu consulta"
        valor={valores.motivo}
        onChange={(e) => manejarCambio('motivo', e.target.value)}
        onBlur={() => manejarBlur('motivo')}
        error={errores.motivo}
        opciones={OPCIONES_MOTIVO}
      />

      <CampoFormulario
        id="contacto-mensaje"
        etiqueta="Mensaje"
        multilinea
        filas={5}
        placeholder="Cuéntanos en qué podemos ayudarte"
        valor={valores.mensaje}
        onChange={(e) => manejarCambio('mensaje', e.target.value)}
        onBlur={() => manejarBlur('mensaje')}
        error={errores.mensaje}
      />

      <Boton texto="Enviar consulta" tipo="submit" />
    </Form>
  );
}

export default FormularioContacto;
