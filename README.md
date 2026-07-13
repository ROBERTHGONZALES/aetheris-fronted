<div align="center">

# AETHERIS — Frontend

### Portal de Control Financiero Corporativo

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Interfaz corporativa para el portal AETHERIS — gestión de transacciones, presupuesto, aprobaciones, conciliación bancaria y auditoría, con chatbot financiero ARIA integrado.**

[Vista previa](#-vista-previa) • [Módulos](#-módulos) • [Chatbot ARIA](#-chatbot-aria) • [Instalación](#-instalación-local) • [Variables de entorno](#-variables-de-entorno)

</div>

---

## 🖥 Vista previa

El portal incluye un chatbot flotante **ARIA** accesible desde cualquier pantalla mediante el botón azul en la esquina inferior derecha.

```
┌────────────────────────────────────────────────────────────┐
│  AETHERIS  │  Dashboard  │  Transacciones  │  Presupuesto  │
├────────────┴──────────────────────────────────────────┐    │
│                                                        │    │
│   Dashboard financiero, tablas, gráficas…              │    │
│                                                        │    │
└────────────────────────────────────────────────────────┘    │
                                                    ┌─────┐   │
                                                    │ 🤖  │ ◄─┘
                                                    └─────┘
                                              (botón ARIA)
```

---

## 🛠 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | React 19 |
| Lenguaje | TypeScript 5.7 |
| Build / Dev | Vite 7 |
| Estilos | Tailwind CSS 4 |
| Componentes | shadcn/ui (Radix UI) |
| Routing | Wouter |
| HTTP | Fetch API nativa |
| Chatbot SSE | `EventSource` / `ReadableStream` |
| Deploy | Railway (Nixpacks + `serve`) |

---

## 📦 Módulos

| Módulo | Ruta | Roles con acceso |
|---|---|---|
| Dashboard | `/dashboard` | Todos |
| Transacciones | `/transacciones` | CONTADOR, ADMIN, APROBADOR |
| Aprobaciones | `/aprobaciones` | APROBADOR, ADMIN |
| Presupuesto | `/presupuesto` | CONTADOR, ADMIN |
| Conciliación | `/conciliacion` | CONTADOR, ADMIN |
| Sedes | `/sedes` | ADMIN |
| Auditoría | `/auditoria` | ADMIN, AUDITOR |
| Chatbot ARIA | Flotante (global) | Todos |

---

## 🤖 Chatbot ARIA

**ARIA** (Asistente de Reportes e Inteligencia de Aetheris) es un chatbot financiero impulsado por **Llama 3.3 70B** vía Groq. Consulta datos reales del sistema mediante *function calling* y responde siempre en español.

### Características

- 💬 **Streaming en tiempo real** — las respuestas se muestran progresivamente via SSE.
- 🔧 **Function calling** — consulta sedes, transacciones, presupuesto, aprobaciones y usuarios directamente.
- 📊 **Tablas Markdown** — cuando la respuesta incluye datos tabulares, ARIA los formatea con Markdown.
- 🔒 **Autenticado** — cada petición incluye el JWT del usuario.
- 🚫 **Stop** — el usuario puede interrumpir el stream en cualquier momento.
- 🗑 **Limpiar** — botón para reiniciar la conversación.

### Preguntas de ejemplo

```
¿Cuántas transacciones están pendientes de aprobación?
Muéstrame el presupuesto de todas las sedes
¿Qué aprobaciones hay sin resolver este mes?
Lista los usuarios del sistema por rol
```

### Archivos clave

| Archivo | Descripción |
|---|---|
| `src/hooks/use-aria.ts` | Hook — gestiona mensajes, streaming, historial y stop |
| `src/components/aria-chat.tsx` | Panel flotante, burbujas de mensaje, sugerencias |
| `src/components/layout.tsx` | `<AriaChat />` montado globalmente en el layout |

### Flujo de datos

```
Usuario escribe → useAria.sendMessage()
  → POST /api/aria/chat  { message, history }  (Bearer JWT)
    ← SSE: event: tool_call  → muestra badge de herramienta
    ← SSE: event: text       → acumula texto en burbuja
    ← SSE: event: done       → finaliza stream
```

---

## 🔗 Conexión con el backend

El frontend **nunca llama directamente a Railway**. Todas las peticiones van a `/api/*`, que un proxy Express interno (`artifacts/api-server`) reenvía al backend eliminando el header `Origin` — esto evita el bloqueo CORS de Spring Security.

```
Navegador  →  /api/*  →  Proxy Express (Replit)  →  Railway (Spring Boot)
```

### Estado de integración

| Módulo | Estado |
|---|---|
| Login / JWT / Logout | ✅ |
| Dashboard | ✅ |
| Transacciones | ✅ |
| Aprobaciones | ✅ |
| Presupuesto | ✅ |
| Conciliación | ✅ |
| Auditoría | ✅ |
| Sedes | ✅ |
| Chatbot ARIA (SSE) | ✅ |

---

## 🚀 Instalación local

### Prerrequisitos

- Node.js 20+
- npm 10+

### 1. Clonar

```bash
git clone https://github.com/ROBERTHGONZALES/aetheris-fronted.git
cd aetheris-fronted
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crea un archivo `.env.local` (opcional; ya trae un valor por defecto):

```env
VITE_BACKEND_URL=https://aetheris-production-3f46.up.railway.app
```

> `VITE_BACKEND_URL` se usa tanto en desarrollo (proxy de Vite en `/api`) como en producción (se incrusta en el bundle al hacer `build`, así que debe estar definida como variable de **build** en el proveedor de hosting).

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## ⚙️ Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `VITE_BACKEND_URL` | `https://aetheris-production-3f46.up.railway.app` | URL base del backend Spring Boot. Se incrusta en el bundle al compilar. |
| `PORT` | `4173` | Puerto en el que `npm start` sirve el build de producción (Railway la asigna automáticamente). |

---

## 🚂 Deploy en Railway

Este repo ya está listo para desplegarse en Railway sin configuración adicional (`railway.json` incluido):

1. En Railway: **New Project → Deploy from GitHub repo** y selecciona `aetheris-fronted`.
2. En **Variables**, agrega `VITE_BACKEND_URL` con la URL del backend (marca la opción de que esté disponible durante el **build**, ya que Vite la incrusta en el bundle en tiempo de compilación, no en runtime).
3. Railway detecta el proyecto Node automáticamente (Nixpacks) y ejecuta:
   - Build: `npm install && npm run build`
   - Start: `npm run start` → sirve `dist/` como sitio estático con soporte de rutas SPA, en el puerto que Railway asigna vía `PORT`.
4. Publica. Railway te da un dominio `*.up.railway.app` (o puedes conectar un dominio propio).

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── aria-chat.tsx        # Chatbot ARIA (panel flotante)
│   ├── layout.tsx           # Layout principal + sidebar
│   └── ui/                  # Componentes shadcn/ui
├── hooks/
│   ├── use-aria.ts          # Hook del chatbot SSE
│   ├── use-auth.ts          # Autenticación y JWT
│   ├── use-transacciones.ts
│   ├── use-aprobaciones.ts
│   ├── use-presupuesto.ts
│   ├── use-conciliacion.ts
│   ├── use-sedes.ts
│   └── use-auditoria.ts
├── pages/
│   ├── login.tsx
│   ├── dashboard.tsx
│   ├── transacciones.tsx
│   ├── aprobaciones.tsx
│   ├── presupuesto.tsx
│   ├── conciliacion.tsx
│   ├── sedes.tsx
│   └── auditoria.tsx
├── lib/
│   ├── api.ts               # Cliente HTTP + gestión del JWT
│   └── utils.ts
└── main.tsx
```

---

## 🤝 Contribuir

1. Fork del repositorio
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: descripción corta'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un **Pull Request** hacia `main`

---

## 📜 Licencia

MIT © [ROBERTHGONZALES](https://github.com/ROBERTHGONZALES)
