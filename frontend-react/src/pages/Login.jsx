import { useState } from 'react';
import LayoutAutenticacion from '../components/templates/LayoutAutenticacion';
import FormularioLogin from '../components/organisms/FormularioLogin';

// PÁGINA: el template LayoutAutenticacion ya relleno con datos reales.
// Acá vive el estado real (valores, errores, si está cargando) y la
// función que valida y "envía" el login. Ese handler viaja hacia abajo
// como prop: Login se lo pasa a FormularioLogin, FormularioLogin se lo
// pasa al <Form> de Bootstrap como onSubmit, y cada CampoFormulario
// recibe su propio trozo de estado y su propio onChange ya envuelto
// para saber a qué campo corresponde.
//
// TODO (parte de backend, más adelante): reemplazar el setTimeout que
// simula la llamada a la API por un fetch/axios real contra el
// microservicio de autenticación cuando exista.
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const [valores, setValores] = useState({ email: '', password: '', recordar: false });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  function validarCampo(campo, valor) {
    if (campo === 'email') {
      if (!valor.trim()) return 'Ingresa tu correo electrónico.';
      if (!REGEX_EMAIL.test(valor)) return 'Ese correo no parece válido.';
    }
    if (campo === 'password') {
      if (!valor) return 'Ingresa tu contraseña.';
      if (valor.length < 6) return 'Debe tener al menos 6 caracteres.';
    }
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
        window.alert('Bienvenido/a, sesión iniciada (simulada).');
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
