# frontend-react

Migración a React de Sonido Vivo, empezando por la pantalla de inicio de
sesión (Guía 12 — Atomic Design + responsividad con React Bootstrap).

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

## Clasificación Atomic Design de la pantalla de login

| Nivel | Componente | Por qué |
|---|---|---|
| Átomo | `atoms/Etiqueta.jsx`, `atoms/CampoTexto.jsx`, `atoms/Boton.jsx` | Cada uno se basta a sí mismo; no saben nada del formulario donde terminan usándose |
| Molécula | `molecules/CampoFormulario.jsx` | Etiqueta + CampoTexto + mensaje de error, con una sola responsabilidad: "capturar un dato y mostrar si es válido" |
| Organismo | `organisms/FormularioLogin.jsx` | La sección completa "inicio de sesión" |
| Template | `templates/LayoutAutenticacion.jsx` | Esqueleto responsivo con `Container`/`Row`/`Col`: panel de marca oculto en móvil (`d-none d-md-flex`), dos columnas desde `md` |
| Página | `pages/Login.jsx` | Estado real (`useState`), validación y el `onSubmit` que baja como prop hasta el botón |

## Verificación responsiva

Capturas en `capturas/` (375px, 768px y 1280px), tomadas con DevTools en
modo de simulación de dispositivos (`Ctrl+Shift+M`).

- [x] 375px (móvil)
- [x] 768px (tablet)
- [x] 1280px (escritorio)

## Próximos pasos
Migrar catálogo, carrito y contacto desde `frontend-html/` a componentes
React (`react-router-dom` ya está en `package.json` para cuando existan
varias páginas, según la Guía 12, sección 5.2).
