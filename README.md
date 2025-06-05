# Proyecto Vue.js - Visualización de Índices e Instrumentos Financieros

## Descripción General

Este proyecto es una aplicación construida con Vue.js que permite visualizar información financiera a través de una interfaz interactiva. La aplicación está dividida en múltiples componentes y utiliza un estado global gestionado por Pinia. Permite al usuario seleccionar un instrumento (acción) de una lista para actualizar dinámicamente el resumen, cabecera y gráfico del índice correspondiente.

## Componentes Principales

- **SearchBarComponent**: Barra de búsqueda de instrumentos.
- **HeaderComponent**: Muestra el nombre del índice y su valor actual.
- **ChartComponent**: Muestra la evolución histórica del índice seleccionado.
- **TabComponent**: Permite cambiar entre distintos índices (IPSA, IGPA, NASDAQ, etc.).
- **SummaryComponent**: Muestra el detalle del instrumento seleccionado.
- **InstrumentListComponent**: Lista de acciones disponibles.
- **InstrumentItemComponent**: Fila individual de la lista, interactiva para selección.

## Estado Global

El proyecto utiliza **Pinia** como sistema de gestión de estado global para almacenar:

- Instrumento seleccionado.
- Datos de los índices e instrumentos.
- Periodo de tiempo seleccionado para el gráfico.

## Funcionalidades Clave

- Al seleccionar un instrumento desde la lista:
  - Se actualiza el estado global.
  - Los componentes `HeaderComponent`, `SummaryComponent` y `ChartComponent` se actualizan automáticamente con los nuevos datos.

## Testing

### Pruebas de Unidad

Se utilizan **Vitest** y **Vue Test Utils** para validar el comportamiento individual de cada componente:

- Verificación de renderizado correcto.
- Manejo de eventos (clics, cambios de selección, etc.).
- Reacción a cambios en el estado global.

### Pruebas de Estado Global

- Verificación de actualizaciones del store al interactuar con la interfaz.
- Confirmación de que los cambios de estado afectan correctamente los componentes asociados.

### Pruebas de Integración

- Simulación del flujo completo desde la selección de un instrumento hasta la actualización visual.
- Validación de datos mostrados en los componentes afectados.

## Instalación y Configuración

```bash
npm install
