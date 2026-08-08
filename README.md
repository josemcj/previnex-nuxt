# Nuxt Base App

Plantilla base construida con Nuxt 4, Vue 3, TypeScript, Pinia y BootstrapVueNext. Incluye layouts vertical y horizontal, autenticación, validación de formularios, tablas paginadas, notificaciones y una instancia centralizada de `$fetch` para consumir una API.

## Requisitos

Antes de comenzar, asegúrate de tener instalados:

- Node.js
- npm
- Git

## Instalación

Clona el repositorio y entra al directorio del proyecto:

```bash
git clone https://github.com/josemcj/nuxt-base-app.git
cd nuxt-base-app
```

Instala las dependencias:

```bash
npm install
```

Crea el archivo de variables de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

Configura en `.env` la URL base de la API:

```dotenv
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

La instancia `$api`, definida en `app/plugins/api.ts`, utiliza esta URL para las peticiones y agrega automáticamente el token de autenticación cuando está disponible.

## Configuración de la aplicación

Las opciones globales de apariencia y funcionalidades se encuentran en `app/app.config.ts`:

```ts
export default defineAppConfig({
  title: 'Skote theme',
  description: 'Skote theme App.',

  layout: {
    type: 'horizontal' as 'horizontal' | 'vertical',
    width: 'fluid' as 'fluid' | 'boxed' | 'scrollable',
    leftSidebarType: 'dark' as 'dark' | 'light' | 'compact' | 'icon' | 'colored',
    topbar: 'dark' as 'dark' | 'light' | 'colored',
  },

  features: {
    notifications: false,
    toggleFullScreen: false,
  },
});
```

### Opciones disponibles

| Propiedad                   | Valores                                       | Descripción                                                   |
| --------------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| `title`                     | Texto                                         | Nombre mostrado por la aplicación.                            |
| `description`               | Texto                                         | Descripción general del proyecto.                             |
| `layout.type`               | `horizontal`, `vertical`                      | Define la navegación principal.                               |
| `layout.width`              | `fluid`, `boxed`, `scrollable`                | Define el ancho y comportamiento del contenido.               |
| `layout.leftSidebarType`    | `dark`, `light`, `compact`, `icon`, `colored` | Define la apariencia de la barra lateral del layout vertical. |
| `layout.topbar`             | `dark`, `light`, `colored`                    | Define la apariencia de la barra superior.                    |
| `features.notifications`    | `true`, `false`                               | Muestra u oculta el menú de notificaciones.                   |
| `features.toggleFullScreen` | `true`, `false`                               | Muestra u oculta el control de pantalla completa.             |

Estas opciones son definidas por el desarrollador y no forman parte del estado modificable por el usuario.

## Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Verificación de TypeScript

Ejecuta la comprobación de tipos con:

```bash
npm run typecheck
```

## Compilación para producción

Genera la aplicación para producción:

```bash
npm run build
```

Prueba localmente la compilación generada:

```bash
npm run preview
```

Para generar una versión estática utiliza:

```bash
npm run generate
```

## Comandos disponibles

| Comando             | Descripción                                      |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Inicia el servidor de desarrollo.                |
| `npm run build`     | Compila la aplicación para producción.           |
| `npm run preview`   | Ejecuta localmente la compilación de producción. |
| `npm run generate`  | Genera una versión estática de la aplicación.    |
| `npm run typecheck` | Verifica los tipos de TypeScript.                |

## Limpieza de archivos generados

Si después de modificar dependencias o configuración Vite muestra errores relacionados con dependencias optimizadas, detén el servidor y ejecuta:

```bash
npx nuxt cleanup
npm run dev
```
