# Reglas y Convenciones del Proyecto - Radio Corrientes Viva

## 1. Base Principal Inmutable
La estructura visual, arquitectónica y de diseño actual constituye la **base principal definitiva e intocable** de la aplicación:

- **Estructura de Carátula**: 
  - Formato cuadrado (`aspect-square`) con bordes redondeados sutiles (`rounded-2xl`).
  - Marco neón perimetral con degradado (cian, púrpura y rosa neón) y resplandor ambiental reactivo con aceleración por GPU.
  - **Sin recuadro de oyentes** dentro de la carátula.
- **Identidad y Logo**:
  - Logo oficial de Radio Corrientes Viva con micrófono vintage y cintas distintivas ("Porque está viva la raíz, porque hay esperanza y fé").
  - Presente en la cabecera superior junto al título, en el menú lateral y como carátula predeterminada.
- **Barra de Navegación Inferior**:
  - Exclusivamente 3 opciones: **Inicio**, **Noticias** (sistema de novedades regionales de San Miguel, Loreto, Caá Catí, Santa Rosa y zonas aledañas) y **Más**.
  - No volver a agregar las pestañas de Chat ni Pedir tema a la barra inferior.
- **Controles de Reproducción**:
  - Botón izquierdo: **Temporizador de apagado** (`Timer`) con presets de tiempo, cuenta regresiva en vivo y detención automática de la transmisión.
  - Botón central: Reproducción y Pausa en gradiente rosa/púrpura con resplandor neón.
  - Botón derecho: **Función de Compartir** (`Share2`) con integración nativa y copiado de enlace.
- **Atmósfera y Rendimiento**:
  - Contenedor principal con borde semioscuro redondeado perimetral (`rounded-[36px] sm:rounded-[44px]` con `border-black/70`).
  - Base general de cristal translúcido esmerilado (`glassmorphism` con `backdrop-blur-xl` y fondo translúcido).
  - Fotografía del estudio de radio con difuminado sutil al 50% (`blur-[3.5px] sm:blur-[4.5px]`) para que la cabina, micrófonos y consola se distingan con claridad en profundidad.
  - Precarga de recursos esenciales y aceleración de gráficos por GPU (`transform-gpu`) para máxima fluidez al iniciar la app.

## 2. Directiva de Desarrollo
- Todas las modificaciones, adiciones o nuevas características futuras deben construirse **sobre esta base principal**, respetando intactos su diseño, navegación y rendimiento.
