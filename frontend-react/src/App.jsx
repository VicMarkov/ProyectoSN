import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import MisPedidos from './pages/MisPedidos';
import DetallePedido from './pages/DetallePedido';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminProductos from './pages/AdminProductos';
import AdminPedidos from './pages/AdminPedidos';
import NoEncontrada from './pages/NoEncontrada';
import RutaProtegida from './components/RutaProtegida';

// App.jsx es el mapa de rutas: el único archivo que decide qué página se
// dibuja para cada dirección del navegador (Guía 14, sección 3).
// BrowserRouter activa la navegación (lee y cambia la dirección sin
// recargar), Routes elige UNA Route según la dirección actual y dibuja su
// element. Todo lo que use useNavigate o useParams queda dentro de él.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/mis-pedidos"
          element={
            <RutaProtegida>
              <MisPedidos />
            </RutaProtegida>
          }
        />
        <Route
          path="/pedidos/:id"
          element={
            <RutaProtegida>
              <DetallePedido />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <RutaProtegida roles={['Administrador']}>
              <AdminUsuarios />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <RutaProtegida roles={['Administrador']}>
              <AdminProductos />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <RutaProtegida roles={['Administrador', 'Vendedor']}>
              <AdminPedidos />
            </RutaProtegida>
          }
        />
        {/* "*" coincide con cualquier dirección que no calce con las demás. */}
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
