# frontend-react

Versión vigente del sitio **Sonido Vivo** en React (Vite). Nació en la
Guía 12 con la pantalla de login bajo Atomic Design y responsividad con
React Bootstrap, y en la Guía 14 se integró el sitio completo: navegación
entre páginas, formularios con validación y hooks propios.

> Las secciones generales del proyecto (equipo, caso, descripción,
> tecnologías) están en el `README.md` de la raíz del repositorio.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Login de prueba (no hay backend todavía, se simula en `src/pages/Login.jsx`):
- Correo: `demo@sonidovivo.cl`
- Contraseña: `demo123`

## Mapa de rutas (`src/App.jsx`)

| Dirección | Página | Qué muestra |
|---|---|---|
| `/` | `Inicio` | Presentación, destacados, video, ubicación |
| `/catalogo` | `Catalogo` | Catálogo con filtro por categoría y buscador |
| `/carrito` | `Carrito` | Carrito, resumen y formulario de despacho/retiro |
| `/contacto` | `Contacto` | Formulario de consulta validado |
| `/login` | `Login` | Inicio de sesión |
| cualquier otra | `NoEncontrada` | Aviso 404 y botón al catálogo |

`BrowserRouter` y `Routes` viven solo en `App.jsx`; `main.jsx` solo monta la
aplicación. Los providers de contexto van fuera del router (en `main.jsx`),
de modo que la sesión y el carrito sobreviven a los cambios de página.

## Clasificación Atomic Design

| Nivel | Componente | Por qué |
|---|---|---|
| Átomo | `Etiqueta`, `CampoTexto`, `CampoAreaTexto`, `CampoSeleccion`, `Boton` | Se bastan a sí mismos; no saben nada del formulario donde terminan usándose |
| Molécula | `CampoFormulario`, `TarjetaProducto`, `LineaCarrito` | Una responsabilidad cada uno: "capturar un dato", "mostrar un producto", "mostrar una línea del carrito" |
| Organismo | `FormularioLogin`, `FormularioContacto`, `FormularioCheckout`, `ResumenCarrito`, `Navbar`, `Footer` | Secciones completas e identificables de la pantalla |
| Template | `LayoutAutenticacion`, `PlantillaSitio` | Esqueleto de las páginas: dónde va la cabecera, el contenido y el pie |
| Página | `Inicio`, `Catalogo`, `Carrito`, `Contacto`, `Login`, `NoEncontrada` | Estado real y decides qué hacer con cada evento |

## Hooks usados (Guía 14)

| Hook | Para qué sirve | Dónde aparece |
|---|---|---|
| `useState` | Guarda valores, errores, filtros, sesión y carrito | Formularios, `Catalogo`, `Carrito`, contextos |
| `useEffect` | Efectos después de dibujar: título de pestaña y persistencia en localStorage | `useTituloPagina`, `CarritoContext`, `SesionContext` |
| `useContext` | Abre una caja compartida entre componentes | `useCart` (carrito), `useSesion` (sesión) |
| `useNavigate` | Cambia de página después de una acción o desde un enlace | `PlantillaSitio`, `LayoutAutenticacion` y todas las páginas |
| `useLocation` | Lee la dirección actual (para marcar el enlace activo) | `PlantillaSitio` |
| `useTituloPagina` | Hook propio: cambia el título de la pestaña | Todas las páginas |

Reglas de los hooks cumplidas: siempre en el nivel superior del componente
(nunca dentro de `if`, bucles o funciones internas) y solo dentro de un
componente o de otro hook.

Solo las páginas y las plantillas usan `useNavigate`/`useLocation`: los
organismos (`Navbar`, `Footer`) reciben `onNavegar` por props y no dependen
del router.

## Formularios y validación

- **`src/utils/validaciones.js`**: funciones puras que reciben el valor y
  devuelven el mensaje de error, o `''` si está bien (correo, teléfono, RUT
  chileno con dígito verificador, texto obligatorio, clave, select).
- El estado de cada formulario vive en su organismo; los errores se dibujan
  junto al campo con `Form.Control.Feedback` de React Bootstrap.
- **Sin `alert()`**: los éxitos se muestran con `Alert` en la página.
- El organismo avisa a la página con `onEnviar(datos)` solo cuando todo está
  correcto; es la página la que decide qué pasa después (navegar, mostrar
  confirmación, vaciar el carrito).

## Carrito y sesión

- `src/context/CarritoContext.jsx` → hook `useCart()`: agregar, actualizar
  cantidad, quitar, vaciar, totales y persistencia en `localStorage`.
- `src/context/SesionContext.jsx` → hook `useSesion()`: `iniciarSesion`,
  `cerrarSesion` y la sesión simulada en `localStorage` (se muestra en el
  navbar con un botón de "Cerrar sesión").

## Verificación

- `npm run build` compila sin errores.
- `npm run dev` + revisión manual de las 6 rutas.
- Flujo completo probado en navegador headless (Edge): navegación sin
  recarga, agregar al carrito, contador del navbar, errores y confirmación
  de checkout, formulario de contacto, login con sesión persistente y 404.
- Capturas responsivas de versiones anteriores en `capturas/` (375px,
  768px y 1280px).

## Pendientes

- **Video de `Inicio`**: `<video>` apunta a `/img/video/recorrido-tienda.mp4`,
  que todavía no existe (video corto grabado por el equipo, nombre igual).
- **Datos de contacto**: correo, teléfono y mapa son de ejemplo.
- **Backend**: el login (`setTimeout`) y la confirmación de pedidos siguen
  simulados; se reemplazarán por `fetch`/`axios` contra Spring Boot en el
  Parcial 2.

## Próximos pasos

- Pruebas unitarias con Vitest (Guía 15): `utils/validaciones.js` ya son
  funciones puras justamente para poder testearlas con `renderHook`.
- Parámetros en la ruta con `useParams` (`/categoria/:nombre`,
  `/producto/:id`) y página de detalle de producto.
- Migrar el sitio a API REST (Spring Boot + MySQL).
