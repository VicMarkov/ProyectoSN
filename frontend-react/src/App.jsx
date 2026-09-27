import Login from './pages/Login';

// Por ahora App solo muestra Login: es la única página migrada a React
// en esta actividad. Cuando el resto del sitio (catálogo, carrito,
// contacto) se migre desde la versión HTML/CSS/JS del Parcial 1, este
// archivo pasará a usar react-router-dom (ya está en package.json)
// para elegir qué página mostrar según la URL, tal como muestra la
// Guía 12, sección 5.2.
function App() {
  return <Login />;
}

export default App;
