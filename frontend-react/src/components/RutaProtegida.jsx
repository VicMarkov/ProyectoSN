import { Navigate } from 'react-router-dom';
import { useSesion } from '../context/SesionContext';

export default function RutaProtegida({ children, roles }) {
  const { sesion, cargando } = useSesion();

  if (cargando) return null;
  if (!sesion) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(sesion.rol)) return <Navigate to="/" replace />;
  return children;
}
