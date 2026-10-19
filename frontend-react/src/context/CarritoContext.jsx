// CarritoContext.jsx
// Caja compartida del carrito (useContext). Centraliza el estado que antes
// vivía repartido en localStorage + window.SonidoVivoCarrito en la versión
// HTML: así el contador del navbar, el catálogo y la página de carrito
// ven siempre lo mismo, sin importar desde dónde se modifique.
//
// El provider va FUERA del router (en main.jsx), para que el carrito se
// mantenga al navegar entre páginas y solo se pierda al recargar.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTOS } from '../data/productos';

const CLAVE_CARRITO = 'sonidovivo_carrito';

const CarritoContexto = createContext(null);

function leerCarritoGuardado() {
  try {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.warn('No se pudo leer el carrito guardado:', error);
    return [];
  }
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarritoGuardado);

  // Persiste el carrito en localStorage cada vez que cambia.
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }, [items]);

  function productoDe(codigo) {
    return PRODUCTOS.find((p) => p.codigo === codigo);
  }

  function agregarProducto(codigo, cantidad = 1) {
    const producto = productoDe(codigo);
    if (!producto || producto.stock === 0) return;

    setItems((anteriores) => {
      const existente = anteriores.find((item) => item.codigo === codigo);
      if (existente) {
        return anteriores.map((item) =>
          item.codigo === codigo
            ? { ...item, cantidad: Math.min(item.cantidad + cantidad, producto.stock) }
            : item
        );
      }
      return [...anteriores, { codigo, cantidad: Math.min(cantidad, producto.stock) }];
    });
  }

  function actualizarCantidad(codigo, cantidad) {
    const producto = productoDe(codigo);
    const limite = producto ? producto.stock : cantidad;
    const nueva = Math.max(1, Math.min(cantidad, limite));

    setItems((anteriores) =>
      anteriores.map((item) => (item.codigo === codigo ? { ...item, cantidad: nueva } : item))
    );
  }

  function quitarProducto(codigo) {
    setItems((anteriores) => anteriores.filter((item) => item.codigo !== codigo));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  // Subtotal y cantidad de productos, memorizados para no recalcular en
  // cada render de los componentes que no cambiaron.
  const totales = useMemo(() => {
    let subtotal = 0;
    let cantidadItems = 0;
    items.forEach((item) => {
      const producto = productoDe(item.codigo);
      if (producto) {
        subtotal += producto.precio * item.cantidad;
        cantidadItems += item.cantidad;
      }
    });
    return { subtotal, cantidadItems };
  }, [items]);

  const valor = {
    items,
    productoDe,
    agregarProducto,
    actualizarCantidad,
    quitarProducto,
    vaciarCarrito,
    totales,
  };

  return <CarritoContexto.Provider value={valor}>{children}</CarritoContexto.Provider>;
}

// Hook propio del proyecto: "abre la caja" del carrito.
export function useCart() {
  const contexto = useContext(CarritoContexto);
  if (!contexto) {
    throw new Error('useCart debe usarse dentro de <CarritoProvider>.');
  }
  return contexto;
}
