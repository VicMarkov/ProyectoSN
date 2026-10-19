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

Pruebas unitarias (Vitest, Guía 15):

```bash
npm test          # en modo watch (re-ejecuta al guardar)
npm run test:run  # ejecuta todo una vez y termina
npm run test:cov  # lo mismo, más el reporte de cobertura en coverage/
```

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

## Pruebas unitarias (Guía 15)

- **Framework**: Vitest + Testing Library (`jsdom` simula el navegador en
  la terminal, sin pantalla ni EC2 gráfica).
- **Ubicación**: cada prueba vive junto a lo que prueba, con el sufijo
  `.test.jsx` (regla de la guía, igual que el estilo de componentes).
  Ej: `src/components/atoms/Boton.jsx` → `Boton.test.jsx`.
- **Config**: bloque `test` en `vite.config.js`, arranque global en
  `src/setupTests.js` (aserciones de jest-dom + limpieza de
  `localStorage` y título antes de cada caso).
- **Ayuda**: `src/test/helpers.jsx` concentra los wrappers
  `conProveedores()` (sesión + carrito + router), `conRouter()`, la sonda
  `SondaRuta` para asertar direcciones y las semillas de `localStorage`.

| Suite | Archivos | Qué cubre |
|---|---|---|
| Utilidades | `utils/validaciones.test.js`, `utils/formato.test.js` | Reglas puras de correo, teléfono, RUT con dígito verificador, texto, clave, select y formato `$129.990` |
| Hook | `hooks/useTituloPagina.test.js` | Título de la pestaña al montar y al cambiar el valor (`renderHook`) |
| Contextos | `context/CarritoContext.test.jsx`, `context/SesionContext.test.jsx` | Agregar/actualizar/quitar/vaciar, tope por stock, totales, persistencia y error fuera del provider |
| Átomos (5) | `atoms/*.test.jsx` | Texto, spinner, inválido, textarea, select y etiqueta asociada |
| Moléculas (3) | `molecules/*.test.jsx` | Campo con error/ayuda, tarjeta de producto (stock, agregado ✓) y línea del carrito |
| Organismos (6) | `organisms/*.test.jsx` | Login, contacto, checkout (dirección solo con despacho, RUT formateado), resumen, navbar y footer |
| Templates (2) | `templates/*.test.jsx` | Plantilla del sitio con navegación real y layout de login |
| Páginas (6) + App | `pages/*.test.jsx`, `App.test.jsx` | Filtros del catálogo, carrito completo, confirmaciones, login simulado y mapa de rutas completo |

**Total: 28 suites, 138 casos.** No se testean `main.jsx` (solo monta el
árbol), `data/productos.js` (datos) ni los propios helpers.

### El caso que falla a propósito (requerido por la rúbrica)

`src/utils/validaciones.test.js` contiene **un único caso con error
intencional**, marcado con `[A PROPÓSITO]`:

```js
it('[A PROPÓSITO] considera inválido el RUT 12.345.678-5', () => {
  expect(rutValido('12.345.678-5')).toBe(false); // en realidad es true → falla
});
```

Por eso:

- `npm run test:run` y `npm run test:cov` terminan con **137 pasando y 1
  fallando (código de salida 1)**: es el comportamiento esperado.
- **No corregir ese expect**: la rúbrica del Parcial 2 exige demostrar que
  Vitest detecta un error. Los otros 137 casos deben seguir en verde.

### Cobertura

`npm run test:cov` genera el reporte en `coverage/` (carpeta ignorada por
git). Último resultado:

| Métrica | Resultado |
|---|---|
| Statements | 92.95% |
| Branches | 88.37% |
| Functions | 90.36% |
| Lines | 93.6% |

El reporte HTML (`coverage/index.html`) sirve de evidencia para el
documento de cobertura de la Guía 15.

## Verificación

- `npm run build` compila sin errores.
- `npm run test:run`: 137 pruebas en verde y 1 fallando (la intencional).
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

- Parámetros en la ruta con `useParams` (`/categoria/:nombre`,
  `/producto/:id`) y página de detalle de producto.
- Migrar el sitio a API REST (Spring Boot + MySQL).
