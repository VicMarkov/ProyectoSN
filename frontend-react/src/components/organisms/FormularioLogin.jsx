import { Form, Alert } from 'react-bootstrap';
import CampoFormulario from '../molecules/CampoFormulario';
import Boton from '../atoms/Boton';

// ORGANISMO: la sección completa e identificable "formulario de inicio
// de sesión". Está compuesta por moléculas (los dos CampoFormulario) y
// átomos (el Boton, el checkbox), y cualquiera podría señalarla en una
// captura de pantalla y decir "eso es el login". No decide de dónde
// vienen los datos ni qué pasa después de un login exitoso: solo
// recibe props (valores, errores, handlers) desde la página que la usa.
function FormularioLogin({
  valores,
  errores,
  errorGeneral,
  cargando,
  onChange,
  onBlur,
  onSubmit,
}) {
  return (
    <Form noValidate onSubmit={onSubmit}>
      <h2 className="fuente-titulo mb-1">Iniciar sesión</h2>
      <p className="text-muted mb-4">Accede a tu cuenta de Sonido Vivo.</p>

      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

      <CampoFormulario
        id="login-email"
        etiqueta="Correo electrónico"
        tipo="email"
        placeholder="nombre@correo.cl"
        valor={valores.email}
        onChange={(e) => onChange('email', e.target.value)}
        onBlur={() => onBlur('email')}
        error={errores.email}
      />

      <CampoFormulario
        id="login-password"
        etiqueta="Contraseña"
        tipo="password"
        placeholder="Tu contraseña"
        valor={valores.password}
        onChange={(e) => onChange('password', e.target.value)}
        onBlur={() => onBlur('password')}
        error={errores.password}
        ayuda="Mínimo 6 caracteres."
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Form.Check
          type="checkbox"
          id="login-recordar"
          label="Recordarme"
          checked={valores.recordar}
          onChange={(e) => onChange('recordar', e.target.checked)}
        />
        <a href="#recuperar" className="small">¿Olvidaste tu contraseña?</a>
      </div>

      <Boton
        texto="Iniciar sesión"
        tipo="submit"
        cargando={cargando}
        className="w-100"
      />

      <p className="text-center text-muted mt-4 mb-0 small">
        ¿Aún no tienes cuenta? <a href="#registro">Regístrate</a>
      </p>
    </Form>
  );
}

export default FormularioLogin;
