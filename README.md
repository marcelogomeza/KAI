# KAI — Knowledge Alive Intelligent (MVP)

KAI es una plataforma modular de gestión del conocimiento con asistente IA para empresas medianas. Este repositorio incluye la Fase 1 (MVP) que implementa autenticación, control de roles y transferencia de documentos con aislamiento multi-tenant.

## Arquitectura

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express, TypeScript, JWT.
- **Base de Datos**: PostgreSQL 16 manejado a través de Drizzle ORM.
- **Almacenamiento**: MinIO (S3-compatible) para documentos.
- **Infraestructura**: Docker Compose para orquestación.

---

## 🚀 Inicio Rápido (Local Development)

### Requisitos
- Node.js (v18+)
- Docker y Docker Compose
- `npm`

### Paso 1: Variables de Entorno y Servicios
1. Clona el repositorio.
2. Copia el archivo de entorno en la raíz:
   ```bash
   cp .env.example .env
   ```
3. Levanta la Base de Datos y MinIO con Docker en segundo plano:
   ```bash
   docker-compose up -d
   ```

### Paso 2: Backend
Abre una terminal en la carpeta `backend/`:
```bash
cd backend
npm install
npm run db:push   # Crea las tablas en PostgreSQL basado en el esquema Drizzle
npm run dev       # Arranca el servidor Express en http://localhost:4000
```

### Paso 3: Frontend
Abre otra terminal en la carpeta `frontend/`:
```bash
cd frontend
npm install
npm run dev       # Arranca Vite en http://localhost:5173
```

---

## 🧪 Pruebas del MVP

1. **Crear el primer Tenant y Administrador**:
   El frontend redireccionará a `/login`. Para tener una cuenta, primero usa la API (con curl o Postman) para crear la empresa y el primer admin:
   ```bash
   curl -X POST http://localhost:4000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"tenantName":"Acme Corp", "email":"admin@acme.com", "password":"Password123!"}'
   ```
2. **Iniciar Sesión**: Entra en `http://localhost:5173/login` usando `admin@acme.com` y `Password123!`.
3. **Subir Documentos**: Usa el botón "Upload Document" para probar la integración a MinIO (máximo 20 MB por archivo de tipo PDF/Word/TXT).

---

## 🌍 Producción (Hostinger / VPS)

Este repositorio está preparado para Integración y Despliegue Continuo (CI/CD) usando GitHub Actions en un entorno basado en Docker.

1. Asegúrate de que el servidor tenga Docker instalado.
2. Agrega los *secrets* requeridos en tu repositorio GitHub:
   - `HOSTINGER_IP`
   - `HOSTINGER_USER`
   - `HOSTINGER_PASSWORD`
   - `HOSTINGER_PORT`
3. Al hacer `push` a la rama `main`, la acción de GitHub `.github/workflows/deploy.yml` automáticamente:
   - Inicia sesión SSH en el servidor.
   - Clona los últimos cambios de código.
   - Ejecuta `docker compose -f docker-compose.prod.yml up -build -d`.

Esta orquestación compilará contenedores hiper-ligeros con Alpine para Node y NGINX.
