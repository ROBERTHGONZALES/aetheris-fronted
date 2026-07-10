<div align="center">

# AETHERIS — Frontend

### Portal de Control Financiero Corporativo

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Interfaz web para el sistema de gestión financiera AETHERIS.**  
Dashboard, transacciones, aprobaciones, presupuesto, conciliación, auditoría y más.

[Instalación](#-instalación-local) • [Conexión al backend](#-conexión-con-el-backend) • [Módulos](#-módulos-del-sistema) • [Errores conocidos](#-errores-conocidos-al-configurar)

</div>

---

## 🟢 Estado

| Entorno | URL | Estado |
|---|---|---|
| Backend API (Railway) | `https://aetheris-production-3f46.up.railway.app/api` | ✅ Online |
| Frontend (desarrollo) | `http://localhost:5173` | local |

---

## 📐 Arquitectura

```
NAVEGADOR  (React + Vite)
     │
     │  /api/...  (llamadas relativas, sin dominio)
     ▼
┌──────────────────────────────────────────┐
│  Vite Dev Server  (localhost:5173)        │
│  ──────────────────────────────────────  │
│  proxy: /api → BACKEND_URL               │
│  (server-to-server, sin CORS)            │
└──────────────────────┬───────────────────┘
                       │ HTTPS /api/...
                       ▼
        ┌──────────────────────────────┐
        │  API REST AETHERIS           │
        │  Spring Boot 3.3 · Railway   │
        │  Context path: /api          │
        └──────────────────────────────┘
```

> **Por qué el proxy:** Spring Security en el backend valida el header `Origin` contra una lista de orígenes permitidos. Si el navegador llama directamente al backend desde `localhost:5173`, el backend responde **403 Forbidden** porque ese origen no está en la lista. Con el proxy de Vite, la petición llega al backend sin `Origin` (es server-to-server), y Spring Security la deja pasar como llamada de mismo origen.

---

## 🛠️ Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework UI | React 19 + TypeScript 5 |
| Bundler / Dev server | Vite 7 |
| Estilos | Tailwind CSS 4 + tw-animate-css |
| Componentes UI | shadcn/ui (Radix UI primitives) |
| Routing | Wouter 3 |
| Estado / Peticiones | TanStack Query (React Query) 5 |
| Formularios | React Hook Form + Zod |
| Gráficos | Recharts 2 |
| Iconos | Lucide React |
| Fechas | date-fns 3 |
| Animaciones | Framer Motion 12 |

---

## 📁 Estructura del proyecto

```
aetheris-fronted/
├── src/
│   ├── App.tsx                   ← Router principal + guardias de auth
│   ├── main.tsx                  ← Entry point (ReactDOM.createRoot)
│   ├── index.css                 ← Tailwind + variables de diseño corporativo
│   │
│   ├── components/
│   │   ├── layout.tsx            ← Sidebar + shell principal de la app
│   │   └── ui/                   ← Componentes shadcn/ui (accordion, button, card, dialog…)
│   │
│   ├── hooks/
│   │   ├── use-auth.ts           ← useLogin, useLogout, useUser
│   │   ├── use-transacciones.ts  ← Queries y mutations de transacciones
│   │   ├── use-aprobaciones.ts   ← Aprobar / rechazar flujos
│   │   ├── use-presupuesto.ts    ← Partidas presupuestarias
│   │   ├── use-conciliacion.ts   ← Conciliación bancaria
│   │   ├── use-sedes.ts          ← CRUD de sedes
│   │   ├── use-auditoria.ts      ← Logs de auditoría
│   │   ├── use-mobile.tsx        ← Detección de viewport mobile
│   │   └── use-toast.ts          ← Sistema de notificaciones toast
│   │
│   ├── lib/
│   │   ├── api.ts                ← apiFetch, queryClient, helpers de token
│   │   └── utils.ts              ← cn(), formatCurrency(), formatDate()
│   │
│   └── pages/
│       ├── login.tsx             ← Pantalla de acceso
│       ├── dashboard.tsx         ← Resumen financiero del mes
│       ├── transacciones.tsx     ← Listado y registro de transacciones
│       ├── aprobaciones.tsx      ← Flujos pendientes de aprobación
│       ├── presupuesto.tsx       ← Partidas presupuestarias por sede
│       ├── conciliacion.tsx      ← Conciliación bancaria
│       ├── sedes.tsx             ← Gestión de sedes corporativas
│       ├── auditoria.tsx         ← Registro de auditoría del sistema
│       └── not-found.tsx         ← Página 404
│
├── public/
│   ├── favicon.svg
│   └── robots.txt
│
├── index.html
├── vite.config.ts                ← Proxy /api → backend Railway
├── tsconfig.json
├── package.json
├── components.json               ← Config shadcn/ui
├── .env.example                  ← Variables de entorno requeridas
└── .gitignore
```

---

## 🚀 Instalación local

### Prerrequisitos

- Node.js 18 o superior
- npm, yarn o pnpm

### 1. Clonar el repositorio

```bash
git clone https://github.com/ROBERTHGONZALES/aetheris-fronted.git
cd aetheris-fronted
```

### 2. Instalar dependencias

```bash
npm install
# o con pnpm:
pnpm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

El archivo `.env` contiene una sola variable:

```env
VITE_BACKEND_URL=https://aetheris-production-3f46.up.railway.app
```

Si tienes el backend corriendo localmente, cámbiala a:

```env
VITE_BACKEND_URL=http://localhost:8080
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### 5. Credenciales de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@aetheris.com | 73814322GM | ADMIN |
| marta.fernandez@aetheris.com | (ver backend) | CONTADOR |
| carlos.medina@aetheris.com | (ver backend) | APROBADOR |
| lucia.torres@aetheris.com | (ver backend) | AUDITOR |

---

## 🔗 Conexión con el backend

### Cómo funciona el proxy de Vite

Todas las llamadas de la app usan rutas relativas como `/api/auth/login`, `/api/transacciones`, etc. **No se hardcodea ningún dominio** en el código del frontend.

El archivo `vite.config.ts` intercepta esas rutas y las reenvía al backend:

```ts
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_BACKEND_URL,
      changeOrigin: true,
      secure: true,
    },
  },
},
```

Cuando el navegador hace `fetch('/api/auth/login')`:
1. La petición llega al servidor de Vite (`localhost:5173`)
2. Vite la reenvía a Railway (`https://aetheris-production-3f46.up.railway.app/api/auth/login`)
3. Como es una llamada **servidor→servidor**, no lleva header `Origin` — Spring Security no aplica CORS y la procesa como mismo origen
4. La respuesta vuelve al navegador a través del proxy

### Cómo se guarda la sesión

El token JWT y los datos del usuario se guardan en `localStorage` con claves:

| Clave | Contenido |
|---|---|
| `aetheris_token` | JWT Bearer token |
| `aetheris_user` | `{ usuario, rol, sesionId }` |

El helper `apiFetch` en `src/lib/api.ts` los adjunta automáticamente en cada petición:

```ts
headers['Authorization'] = `Bearer ${token}`;
```

Si el backend responde con **401**, `apiFetch` limpia el localStorage y emite el evento `auth-unauthorized`, que el componente `GlobalAuthGuard` en `App.tsx` captura para redirigir al login.

### Protección de rutas

Las rutas protegidas usan el componente `ProtectedRoute`:

```tsx
function ProtectedRoute({ component: Component, path }) {
  const token = getAuthToken();
  useEffect(() => {
    if (!token) setLocation('/login');
  }, [token]);
  if (!token) return null;
  return <Component />;
}
```

---

## 📋 Módulos del sistema

### 🏠 Dashboard (`/dashboard`)
Resumen financiero del mes activo:
- Tarjetas de balance total, ingresos, egresos y aprobaciones pendientes
- Gráfico de barras comparativo (Recharts)
- Últimas 5 transacciones aprobadas

### 💸 Transacciones (`/transacciones`)
- Listado de todas las transacciones con filtro por sede y periodo
- Formulario para registrar nuevas transacciones (tipo, monto, moneda, descripción, sede, categoría)
- Badge de estado: `PENDIENTE` · `APROBADA` · `RECHAZADA`

### ✅ Aprobaciones (`/aprobaciones`) — Roles: ADMIN, APROBADOR
- Lista de flujos pendientes de aprobación
- Aprobar o rechazar con observación
- Actualiza automáticamente el estado de la transacción en el backend

### 💼 Presupuesto (`/presupuesto`) — Roles: ADMIN, CONTADOR
- Partidas presupuestarias por sede y periodo
- Barra de progreso de ejecución (`porcentajeEjecucion` — columna STORED en MariaDB)
- Crear nuevas partidas

### 🏦 Conciliación (`/conciliacion`) — Roles: ADMIN, CONTADOR
- Iniciar proceso de conciliación por cuenta y periodo
- Importar movimientos bancarios (JSON)
- Ejecutar cruce automático

### 🏢 Sedes (`/sedes`) — Rol: ADMIN
- Listado de sedes activas
- Crear y editar sedes
- Actualizar límite de aprobación por sede

### 🛡️ Auditoría (`/auditoria`) — Roles: ADMIN, AUDITOR
- Log completo de todas las acciones del sistema
- Tabla con usuario, acción, entidad y fecha

---

## 🗺️ Rutas de la app

| Ruta | Componente | Protegida | Roles |
|---|---|---|---|
| `/login` | `Login` | No | — |
| `/dashboard` | `Dashboard` | ✅ | Todos |
| `/transacciones` | `Transacciones` | ✅ | ADMIN, CONTADOR, APROBADOR |
| `/aprobaciones` | `Aprobaciones` | ✅ | ADMIN, APROBADOR |
| `/presupuesto` | `Presupuesto` | ✅ | ADMIN, CONTADOR |
| `/conciliacion` | `Conciliacion` | ✅ | ADMIN, CONTADOR |
| `/sedes` | `Sedes` | ✅ | ADMIN |
| `/auditoria` | `Auditoria` | ✅ | ADMIN, AUDITOR |

---

## 🌍 Variables de entorno

| Variable | Requerida | Default | Descripción |
|---|---|---|---|
| `VITE_BACKEND_URL` | ❌ | `https://aetheris-production-3f46.up.railway.app` | URL base del backend (sin `/api` al final) |

> **Nota:** Las variables que comienzan con `VITE_` quedan expuestas en el bundle del cliente. No pongas aquí secretos ni contraseñas.

---

## 🐛 Errores conocidos al configurar

Esta sección documenta los errores que aparecieron durante el desarrollo de este proyecto para que quien clone el repositorio no los sufra.

---

### ❌ Error 1 — `Failed to resolve import "@/lib/api"`

**Síntoma:**
```
[vite] Internal server error: Failed to resolve import "@/lib/api" from "src/App.tsx".
Does the file exist?
```

**Causa:**  
Al copiar los archivos fuente usando `cp -r src/lib/ dest/src/lib/`, si la carpeta de destino `src/lib/` ya existía (porque el scaffold de Vite la crea vacía), el resultado es que los archivos quedan en `src/lib/lib/` en lugar de `src/lib/`. El alias `@/lib/api` nunca resuelve.

**Solución:**  
Copiar el **contenido** de la carpeta, no la carpeta misma:
```bash
# ✅ Correcto — copia el contenido de src/lib/ dentro de dest/src/lib/
cp src/lib/* dest/src/lib/

# ❌ Incorrecto — crea dest/src/lib/lib/api.ts
cp -r src/lib dest/src/lib/
```
Si ya te pasó, mueve los archivos manualmente:
```bash
mv src/lib/lib/api.ts src/lib/api.ts
mv src/lib/lib/utils.ts src/lib/utils.ts
rm -rf src/lib/lib
```
Lo mismo aplica para `src/hooks/hooks/` y `src/pages/pages/`.

---

### ❌ Error 2 — Login responde 404 al hacer clic en "Ingresar"

**Síntoma:**  
El formulario de login se envía, la petición sale hacia `/api/auth/login`, y el servidor responde **404** en menos de 10 ms.

**Causa:**  
En entornos con múltiples servicios en el mismo dominio (como Replit), el proxy de Vite **no llega a interceptar** las peticiones `/api/*` porque otro servidor (un API Gateway o Express local) ya las captura antes. El proxy de Vite solo funciona cuando el navegador llama directamente al servidor de Vite.

En Replit específicamente: el sistema enruta `/api/*` al `api-server` (Express), no al proceso de Vite.

**Solución:**  
El `api-server` Express debe actuar como proxy inverso hacia Railway. Usa `http-proxy-middleware`:

```ts
// artifacts/api-server/src/app.ts
import { createProxyMiddleware } from 'http-proxy-middleware';

app.use(createProxyMiddleware({
  pathFilter: '/api',           // ← usar pathFilter, NO app.use('/api', ...)
  target: 'https://aetheris-production-3f46.up.railway.app',
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.removeHeader('origin');
      proxyReq.removeHeader('referer');
    },
  },
}));
```

> ⚠️ **Detalle crítico:** Si montas el proxy con `app.use('/api', createProxyMiddleware({...}))`, Express **elimina el prefijo `/api`** antes de pasarlo al middleware. El proxy recibe `/auth/login` en lugar de `/api/auth/login`. Como el backend de Spring Boot tiene context-path `/api`, la URL resultante sería `https://railway.app/auth/login` → 404.  
>
> La solución es montar en raíz usando `pathFilter` (v4 de http-proxy-middleware):
> ```ts
> // ✅ Correcto — Express no toca el path, el proxy ve /api/auth/login
> app.use(createProxyMiddleware({ pathFilter: '/api', target: '...' }));
> 
> // ❌ Incorrecto — Express strip /api, proxy ve /auth/login → 404 en Railway
> app.use('/api', createProxyMiddleware({ target: '...' }));
> ```

---

### ❌ Error 3 — 403 Forbidden al llamar al backend directamente desde el navegador

**Síntoma:**
```
Access to fetch at 'https://aetheris-production-3f46.up.railway.app/api/auth/login'
from origin 'http://localhost:5173' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check.
```

**Causa:**  
Spring Security en el backend tiene configurado `CORS_ALLOWED_ORIGINS`. Si el dominio del frontend no está en esa lista, bloquea la petición antes de procesarla.

**Solución A (recomendada para desarrollo):** Usar el proxy de Vite (ver `vite.config.ts`). El navegador llama a `localhost:5173/api/...`, Vite reenvía sin `Origin` y el backend lo acepta.

**Solución B (para producción):** Agregar el dominio del frontend en la variable de entorno `CORS_ALLOWED_ORIGINS` del backend en Railway:
```
CORS_ALLOWED_ORIGINS=https://tu-dominio.com,http://localhost:5173
```

---

### ❌ Error 4 — `catalog:` o `workspace:*` en package.json

**Síntoma al hacer `npm install`:**
```
npm error  Unsupported URL Type "catalog:": catalog:
npm error  Unsupported URL Type "workspace:": workspace:*
```

**Causa:**  
El `package.json` del monorepo de Replit usa referencias especiales de pnpm: `catalog:` (versión desde el catálogo central) y `workspace:*` (paquete interno del monorepo). Estas referencias **no funcionan** con npm, yarn ni con pnpm fuera del monorepo.

**Solución:**  
El `package.json` de este repositorio ya tiene las versiones concretas (`"react": "^19.1.0"`, etc.). Si en algún momento ves estas referencias, reemplázalas manualmente con números de versión o consulta el archivo `pnpm-workspace.yaml` del monorepo.

---

### ❌ Error 5 — `process is not defined` o `import.meta.dirname` no existe

**Síntoma:**
```
ReferenceError: process is not defined
```
o
```
Cannot find name 'import.meta.dirname'
```

**Causa:**  
El `vite.config.ts` original del monorepo de Replit usa `process.env.PORT`, `process.env.BASE_PATH` e `import.meta.dirname` (Node 22+). Fuera de ese entorno, `PORT` y `BASE_PATH` no existen y el servidor lanza un error antes de arrancar.

**Solución:**  
El `vite.config.ts` de este repositorio usa valores por defecto y `__dirname` en lugar de `import.meta.dirname`, por lo que funciona con Node 18+:
```ts
const BACKEND_URL = process.env.VITE_BACKEND_URL ?? 'https://aetheris-production-3f46.up.railway.app';
```

---

### ❌ Error 6 — Pantalla en blanco sin errores en consola (tsconfig mal configurado)

**Síntoma:**  
La app compila sin errores de TypeScript pero la pantalla queda en blanco. En consola del navegador aparece:
```
Uncaught SyntaxError: Cannot use import statement in a module
```
o simplemente nada (pantalla blanca).

**Causa:**  
El `tsconfig.json` del monorepo hereda de `../../tsconfig.base.json` con `"extends": "../../tsconfig.base.json"`. Fuera del monorepo, ese archivo no existe y TypeScript usa configuraciones incorrectas.

**Solución:**  
El `tsconfig.json` de este repo es standalone e incluye todas las opciones necesarias directamente sin `extends` externo:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    ...
  }
}
```

---

## 🔄 Conexión frontend ↔ backend (resumen completo)

```
┌───────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                           │
│                                                                   │
│  src/lib/api.ts → apiFetch('/api/endpoint')                       │
│  src/hooks/use-*.ts → useQuery / useMutation con apiFetch         │
│  JWT guardado en localStorage['aetheris_token']                   │
└────────────────────────────┬──────────────────────────────────────┘
                             │  fetch('/api/...')
                             │  Authorization: Bearer <JWT>
                             ▼
┌───────────────────────────────────────────────────────────────────┐
│                  PROXY (Vite Dev Server / Express)                │
│                                                                   │
│  Modo desarrollo local:  Vite  (vite.config.ts proxy)             │
│  Modo Replit:            Express api-server (pathFilter: '/api')  │
│                                                                   │
│  • Elimina o no transmite el header Origin                        │
│  • Reenvía la petición completa (incluyendo /api/... en la ruta) │
└────────────────────────────┬──────────────────────────────────────┘
                             │  HTTPS /api/...
                             │  Sin header Origin
                             ▼
┌───────────────────────────────────────────────────────────────────┐
│             BACKEND (Spring Boot 3.3 · Railway)                   │
│                                                                   │
│  Context-path: /api                                               │
│  Seguridad: Spring Security + JWT HS384                           │
│  CORS: Spring Security (no aplica para llamadas sin Origin)       │
│  Base de datos: MariaDB en AlwaysData                             │
│                                                                   │
│  Repo: github.com/ROBERTHGONZALES/aetheris-backend               │
└───────────────────────────────────────────────────────────────────┘
```

### Endpoints que consume el frontend

| Hook | Endpoint | Método |
|---|---|---|
| `useLogin` | `/api/auth/login` | POST |
| `useGetTransacciones` | `/api/transacciones?sedeId=` | GET |
| `useGetTransaccionesPendientes` | `/api/transacciones/pendientes` | GET |
| `useGetTransaccionesPeriodo` | `/api/transacciones/periodo?inicio=&fin=` | GET |
| `useCreateTransaccion` | `/api/transacciones` | POST |
| `useGetAprobacionesPendientes` | `/api/aprobaciones/pendientes` | GET |
| `useAprobarTransaccion` | `/api/aprobaciones/{id}/aprobar` | PUT |
| `useRechazarTransaccion` | `/api/aprobaciones/{id}/rechazar` | PUT |
| `useGetPresupuestos` | `/api/presupuesto?sedeId=` | GET |
| `useGetPresupuestosEnAlerta` | `/api/presupuesto/alerta` | GET |
| `useCreatePresupuesto` | `/api/presupuesto` | POST |
| `useIniciarConciliacion` | `/api/conciliacion?cuentaId=&periodo=` | POST |
| `useImportarMovimientos` | `/api/conciliacion/{id}/movimientos` | POST |
| `useCruzarConciliacion` | `/api/conciliacion/{id}/cruce` | POST |
| `useGetSedes` | `/api/sedes` | GET |
| `useCreateSede` | `/api/sedes` | POST |
| `useUpdateSede` | `/api/sedes/{id}` | PUT |
| `useUpdateLimiteSede` | `/api/sedes/{id}/limite?monto=` | PUT |
| `useGetAuditoria` | `/api/auditoria` | GET |

---

## 📦 Build para producción

```bash
npm run build
```

Los archivos quedan en `dist/`. Puedes servirlos con cualquier servidor estático (Nginx, Apache, Vercel, Netlify…).

> ⚠️ **En producción, el proxy de Vite no existe.** Debes configurar Nginx o tu servidor para hacer proxy de `/api/*` al backend, o usar un API Gateway. Alternativa: agrega tu dominio de producción a `CORS_ALLOWED_ORIGINS` en Railway para permitir llamadas directas desde el navegador.

---

## 📜 Licencia

MIT © [ROBERTHGONZALES](https://github.com/ROBERTHGONZALES)
