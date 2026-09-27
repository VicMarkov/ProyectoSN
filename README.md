# Sonido Vivo — Sitio Web (Evaluación Parcial 1)

Prototipo frontend de la tienda **Sonido Vivo** (instrumentos musicales y
equipos de sonido, Viña del Mar), desarrollado para la Evaluación Parcial 1
del curso **DSY1104 — Desarrollo FullStack II**.

## Alcance de esta entrega

Esta etapa es **solo frontend**: HTML5 semántico, CSS externo y JavaScript
para validación de formularios y simulación del carrito de compras con
`localStorage`. No hay backend, API ni base de datos todavía — eso
corresponde a los Parciales 2 y 3 (React + Spring Boot + MySQL, según la
Sección 0 del documento de contexto de negocio).

## Cómo abrir el sitio

No requiere instalación ni servidor. Basta con abrir `index.html` en el
navegador, o servirlo con cualquier servidor estático (por ejemplo, la
extensión "Live Server" de VS Code) para evitar restricciones de algunos
navegadores con `file://`.

## Estructura del proyecto

```
sonido-vivo/
├── index.html       Inicio: presentación de la tienda, video y ubicación
├── catalogo.html     Catálogo con filtro por categoría y buscador
├── carrito.html      Carrito (localStorage) + formulario de despacho/retiro
├── contacto.html      Formulario de contacto validado con JavaScript
├── css/
│   └── style.css     Hoja de estilos externa única, usada por las 4 páginas
├── js/
│   ├── productos.js   Datos del catálogo (muestra de 51 de 340 referencias)
│   ├── carrito.js      Lógica del carrito en localStorage
│   ├── catalogo.js     Render, filtro y buscador del catálogo
│   ├── validaciones.js Validación de formularios (contacto y checkout)
│   └── nav.js          Menú hamburguesa y contador del carrito
├── img/
│   ├── logo.svg
│   ├── hero-instrumentos.svg
│   └── video/          Carpeta para el video real del equipo (ver abajo)
├── .gitignore
└── README.md
```

## Pendiente antes de la entrega final

- **Video de `index.html`:** el `<video>` de la sección "Compra desde donde
  estés" apunta a `img/video/recorrido-tienda.mp4`, que todavía no existe.
  Agregar ahí un video corto real (grabado con el celular alcanza) mostrando
  la tienda o un producto, con ese mismo nombre de archivo.
- **Datos de contacto:** el correo, teléfono y mapa son de ejemplo;
  reemplazar por los datos reales del equipo/tienda si corresponde.
- **Catálogo:** se usa una muestra de 51 productos reales del archivo Excel
  entregado (de 340 referencias totales). Si se quiere mostrar el catálogo
  completo, basta con ampliar el arreglo `PRODUCTOS` en `js/productos.js`.

## Equipo

- Vicente Markov.

## Control de versiones

- Un commit por avance lógico (estructura HTML, estilos,
  lógica de catálogo, validaciones, etc.), no un solo commit final.
