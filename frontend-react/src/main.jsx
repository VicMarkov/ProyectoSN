import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Bootstrap siempre primero: así nuestro index.css puede sobrescribirlo si es necesario.
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { SesionProvider } from './context/SesionContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import App from './App.jsx';

// Los providers van FUERA del App (que es donde está el router): así la
// sesión y el carrito se mantienen al cambiar de página y solo se pierden
// al recargar el navegador.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SesionProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </SesionProvider>
  </StrictMode>
);
