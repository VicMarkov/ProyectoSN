import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Bootstrap siempre primero: así nuestro index.css puede sobrescribirlo si es necesario.
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
