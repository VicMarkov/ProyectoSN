// useTituloPagina.js
// Hook propio: cambia el título de la pestaña del navegador según la página
// que esté dibujada. Es un hook porque su nombre empieza con "use" y porque
// por dentro llama a otro hook de React (useEffect).
//
// Reglas de los hooks cumplidas:
//  1. Se llama siempre en el nivel superior del componente (nunca dentro de
//     un if, un for ni una función interna).
//  2. Solo se llama dentro de un componente o de otro hook.
import { useEffect } from 'react';

export function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | Sonido Vivo` : 'Sonido Vivo';
    // El arreglo de dependencias indica cuándo se repite el efecto:
    // solo si "titulo" cambia.
  }, [titulo]);
}
