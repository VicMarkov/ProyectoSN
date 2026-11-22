# Sonido Vivo — Sitio Web

Prototipo frontend de la tienda **Sonido Vivo** (instrumentos musicales y
equipos de sonido, Viña del Mar), desarrollado para el curso
**DSY1104 — Desarrollo FullStack II**.

El repositorio tiene dos versiones del frontend:

| Carpeta | Estado | Contenido |
|---|---|---|
| `frontend-html/` | **Obsoleto** (archivo del Parcial 1) | Versión original en HTML5 + CSS + JavaScript: se conserva sin cambios como evidencia de la primera entrega y como referencia de datos y diseño. |
| `frontend-react/` | **Vigente** | Migración a React con Vite, Atomic Design, React Bootstrap, navegación con `react-router-dom`, hooks y formularios validados (Guías 12 y 14). |

Todo lo nuevo se desarrolla en `frontend-react/`.

El **backend** del proyecto vive en un repositorio separado:
**<https://github.com/VicMarkov/ProyectoSN_Backend>** — API REST con Node.js +
Express y PostgreSQL, en su fase de construcción inicial (auth con JWT,
catálogo y ajuste de stock). Su README explica cómo ejecutarla y probarla
desde Swagger UI. La integración frontend ↔ API es el siguiente paso.

## Alcance de esta entrega

La versión HTML es **solo frontend**: HTML5 semántico, CSS externo y
JavaScript para validación de formularios y simulación del carrito de
compras con `localStorage`. La versión React mantiene ese alcance **sin
integración todavía**: los datos y la sesión siguen simulados en el cliente.
El backend ya existe en su propio repositorio
([ProyectoSN_Backend](https://github.com/VicMarkov/ProyectoSN_Backend),
Node.js + Express + PostgreSQL según el ERS v1.2), y conectarlo con el
frontend corresponde a la siguiente fase (antes era "React + Spring Boot +
MySQL" en la Sección 0 del documento de contexto de negocio; la elección
definitiva está documentada en el ERS y en el README del backend).

## Cómo abrir el sitio

### frontend-react (vigente)

```bash
cd frontend-react
npm install
npm run dev
```

Login de prueba: `demo@sonidovivo.cl` / `demo123`.

### frontend-html (archivo del Parcial 1)

No requiere instalación ni servidor. Basta con abrir
`frontend-html/index.html` en el navegador, o servirlo con cualquier
servidor estático (por ejemplo, la extensión "Live Server" de VS Code) para
evitar restricciones de algunos navegadores con `file://`.

## Estructura del proyecto

```
ProyectoSN/
├── README.md            Este archivo
├── frontend-react/      Versión vigente (React + Vite)
│   ├── index.html
│   ├── package.json
│   ├── public/img/      logo, ilustración hero y carpeta de video
│   └── src/
│       ├── App.jsx          Mapa de rutas (react-router-dom)
│       ├── main.jsx         Providers de contexto + montaje
│       ├── data/            Catálogo de productos
│       ├── hooks/           Hooks propios (useTituloPagina)
│       ├── context/         CarritoContext (useCart), SesionContext (useSesion)
│       ├── utils/           validaciones.js (funciones puras), formato.js
│       ├── components/
│       │   ├── atoms/       Etiqueta, CampoTexto, CampoAreaTexto, CampoSeleccion, Boton
│       │   ├── molecules/   CampoFormulario, TarjetaProducto, LineaCarrito
│       │   ├── organisms/   FormularioLogin/Contacto/Checkout, ResumenCarrito, Navbar, Footer
│       │   └── templates/   PlantillaSitio, LayoutAutenticacion
│       └── pages/           Inicio, Catalogo, Carrito, Contacto, Login, NoEncontrada
└── frontend-html/       Archivo del Parcial 1 (obsoleto)
    ├── index.html        Inicio: presentación de la tienda, video y ubicación
    ├── catalogo.html     Catálogo con filtro por categoría y buscador
    ├── carrito.html      Carrito (localStorage) + formulario de despacho/retiro
    ├── contacto.html     Formulario de contacto validado con JavaScript
    ├── css/style.css     Hoja de estilos externa única de esa versión
    ├── js/               productos, carrito, catálogo, validaciones, nav
    └── img/              logo, ilustración hero y video
```

## Pendiente antes de la entrega final

- **Video de `index.html` / `Inicio`:** el `<video>` de la sección "Compra
  desde donde estés" apunta a `img/video/recorrido-tienda.mp4`
  (`/img/video/recorrido-tienda.mp4` en React), que todavía no existe.
  Agregar ahí un video corto real (grabado con el celular alcanza)
  mostrando la tienda o un producto, con ese mismo nombre de archivo.
- **Datos de contacto:** el correo, teléfono y mapa son de ejemplo;
  reemplazar por los datos reales del equipo/tienda si corresponde.
- **Catálogo:** se usa una muestra de 51 productos reales del archivo Excel
  entregado (de 340 referencias totales). Si se quiere mostrar el catálogo
  completo, basta con ampliar el arreglo `PRODUCTOS` en
  `frontend-react/src/data/productos.js` (o `frontend-html/js/productos.js`
  en la versión HTML).

## Equipo

- Vicente Markov.

## Control de versiones

- Un commit por avance lógico (estructura HTML, estilos,
  lógica de catálogo, validaciones, migración a React, navegación, etc.),
  no un solo commit final.

## Material complementario

https://drive.google.com/drive/folders/1Keo7lzNY78dB0mSs8sC1TsTszuUVn-96?usp=drive_link
