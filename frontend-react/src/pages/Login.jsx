import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutAutenticacion from '../components/templates/LayoutAutenticacion';
import FormularioLogin from '../components/organisms/FormularioLogin';
import { useSesion } from '../context/SesionContext';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { validarEmail, validarClave } from '../utils/validaciones';

// PÁGINA: el template LayoutAutenticacion ya relleno con datos reales.
// Acá vive el estado real (valores, errores, si está cargando) y la
// función que valida y "envía" el login. Ese handler viaja hacia abajo
// como prop: Login se lo pasa a FormularioLogin, FormularioLogin se lo
// pasa al <Form> de Bootstrap como onSubmit, y cada CampoFormulario
// recibe su propio trozo de estado y su propio onChange ya envuelto
// para saber a qué campo corresponde.
//
// Las reglas de validación están en utils/validaciones.js (funciones
// puras, compartidas con el resto de los formularios del sitio).
//
// TODO (parte de backend, más adelante): reemplazar el setTimeout que
// simula la llamada a la API por un fetch/axios real contra el
// microservicio de autenticación cuando exista.

function Login() {
  useTituloPagina('Iniciar sesión');
  const navigate = useNavigate();
  const { iniciarSesion } = useSesion();

  const [valores, setValores] = useState({ email: '', password: '', recordar: false });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  function validarCampo(campo, valor) {
    if (campo === 'email') return validarEmail(valor);
    if (campo === 'password') return validarClave(valor);
    return '';
  }

  function manejarCambio(campo, valor) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
    if (errores[campo]) {
      setErrores((anteriores) => ({ ...anteriores, [campo]: validarCampo(campo, valor) }));
    }
  }

  function manejarBlur(campo) {
    setErrores((anteriores) => ({ ...anteriores, [campo]: validarCampo(campo, valores[campo]) }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    setErrorGeneral('');

    const nuevosErrores = {
      email: validarCampo('email', valores.email),
      password: validarCampo('password', valores.password),
    };
    setErrores(nuevosErrores);

    const hayErrores = Object.values(nuevosErrores).some(Boolean);
    if (hayErrores) return;

    setCargando(true);

    // Simulación temporal: todavía no existe backend de autenticación.
    setTimeout(() => {
      setCargando(false);
      if (valores.email === 'demo@sonidovivo.cl' && valores.password === 'demo123') {
        // Login correcto: se guarda la sesión en el contexto y la página
        // cambia de dirección con navigate (sin alert() y sin recargar).
        iniciarSesion(valores.email);
        navigate('/');
      } else {
        setErrorGeneral('Correo o contraseña incorrectos. Prueba con demo@sonidovivo.cl / demo123.');
      }
    }, 800);
  }

  return (
    <LayoutAutenticacion>
      <FormularioLogin
        valores={valores}
        errores={errores}
        errorGeneral={errorGeneral}
        cargando={cargando}
        onChange={manejarCambio}
        onBlur={manejarBlur}
        onSubmit={manejarEnvio}
      />
    </LayoutAutenticacion>
  );
}

export default Login;
