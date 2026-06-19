# Portal Corporativo — LDAP Dashboard

Stack: **React + Vite** (frontend) · **NestJS** (backend) · **LDAP** (autenticación)

---

## Estructura del proyecto

```
app/
├── frontend/   → React + Vite (puerto 3000)
└── backend/    → NestJS      (puerto 3001)
```

---

## 1. Configurar el backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar y editar variables de entorno
cp .env .env.local
```

Editá `.env` con tus datos LDAP reales:

```env
LDAP_URL=ldap://tu-servidor-ldap:389
LDAP_BASE_DN=dc=corp,dc=local
LDAP_BIND_DN=cn=ldap-reader,dc=corp,dc=local
LDAP_BIND_PASSWORD=tu-contraseña-de-bind
JWT_SECRET=cambia-esto-por-algo-largo-y-aleatorio
JWT_EXPIRES_IN=8h
PORT=3001
```

```bash
# Compilar y correr en desarrollo
npm run start:dev
```

---

## 2. Configurar el frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev
```

Abrí http://localhost:3000 — el proxy de Vite redirige `/api/*` al backend en `:3001`.

---

## 3. Flujo de autenticación

```
Usuario                  Frontend              Backend              LDAP
  │  Ingresa user+pass      │                     │                   │
  │ ──────────────────────► │  POST /api/auth/login│                   │
  │                         │ ──────────────────► │                   │
  │                         │                     │  Bind como reader  │
  │                         │                     │ ─────────────────► │
  │                         │                     │  Busca user DN     │
  │                         │                     │ ─────────────────► │
  │                         │                     │  Bind como user    │
  │                         │                     │ ─────────────────► │
  │                         │                     │  OK / Error        │
  │                         │   { access_token }  │                    │
  │                         │ ◄────────────────── │                    │
  │  Redirige al Dashboard   │                     │                    │
  │ ◄──────────────────────  │                     │                    │
```

---

## 4. Endpoints de la API

| Método | Endpoint          | Auth | Descripción                  |
|--------|-------------------|------|------------------------------|
| POST   | /api/auth/login   | No   | Login LDAP → devuelve JWT    |
| GET    | /api/users/me     | JWT  | Perfil del usuario actual    |
| GET    | /api/users        | JWT  | Lista de usuarios (ejemplo)  |

---

## 5. Proteger rutas adicionales

Cualquier endpoint nuevo se protege con `@UseGuards(JwtAuthGuard)`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('reportes')
export class ReportesController {
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return { data: [] };
  }
}
```

---

## 6. Build para producción

```bash
# Backend
cd backend && npm run build && npm run start

# Frontend
cd frontend && npm run build
# → genera dist/ para servir con nginx, apache, etc.
```

---

## Notas LDAP

- El atributo de búsqueda soporta tanto `sAMAccountName` (Active Directory) como `uid` (OpenLDAP).
- Si tu servidor usa **LDAPS** (puerto 636), cambiá `ldap://` por `ldaps://`.
- La cuenta de bind (`LDAP_BIND_DN`) necesita permisos de **lectura** sobre el árbol de usuarios.
