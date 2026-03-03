# Guía de Despliegue KAI-HG (Producción)

Esta guía documenta los pasos necesarios para realizar despliegues exitosos en el servidor Hostinger y evitar los errores de "bloqueo" o "conexión rechazada" experimentados anteriormente.

## 1. Configuración del Servidor (.env)

El archivo `.env` en la raíz del servidor (`/opt/kai-saas/.env`) debe contener las siguientes variables críticas:

```bash
# Secreto para firmar tokens JWT (Cambiar por uno seguro)
JWT_SECRET=super_secret_key_change_me

# Conexión a la base de datos (Interna de Docker)
DATABASE_URL=postgres://postgres:postgres@db:5432/kai

# Configuración de MinIO (Almacenamiento)
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=password123
```

## 2. Estrategia de Red y API (Proxy)

Para evitar errores de `ERR_CONNECTION_REFUSED`:

*   **Frontend**: Nunca debe usar `localhost:4000` en el código. La URL base de la API debe ser siempre relativa: `/api`.
*   **Nginx**: El archivo `frontend/nginx.conf` debe incluir el bloque de proxy:
    ```nginx
    location /api/ {
        proxy_pass http://backend:4000/api/;
        ...
    }
    ```
    Esto permite que todas las llamadas a `dominio.com/api` se redirijan internamente al contenedor del backend sin exponer el puerto 4000 al exterior.

## 3. Sincronización de Base de Datos (Drizzle)

**IMPORTANTE:** Por seguridad y para evitar que el contenedor se quede "congelado" esperando confirmación humana, el comando `db:push` **NO** se ejecuta automáticamente al arrancar.

### Pasos para actualizar tablas:
Si realizas cambios en el esquema (`backend/src/db/schema.ts`), debes ejecutar manualmente:

```bash
docker exec -it kai-saas-backend-1 npx drizzle-kit push:pg
```
*   **Interacción:** Cuando pregunte si deseas aplicar los cambios, usa las flechas del teclado para seleccionar **"Yes"** y presiona Enter.

## 4. Proceso de Actualización (Deploy)

Cuando subas nuevos cambios a GitHub, el proceso oficial en el servidor es:

```bash
cd /opt/kai-saas
git pull origin main
./deploy.sh
```

## 5. Solución de Problemas Comunes

| Error | Causa | Solución |
| :--- | :--- | :--- |
| `Connection Reset` / Backend no responde | El backend se bloqueó esperando confirmación de DB. | Ejecuta el comando del punto 3 manual. |
| `relation "users" does not exist` | Las tablas no han sido creadas. | Ejecuta el comando del punto 3 manual. |
| `ERR_CONNECTION_REFUSED` | El frontend intenta ir a `localhost` en lugar de la IP. | Revisa que `axios.ts` use `/api` como baseURL. |
| El login no funciona tras cambio | Caché del navegador. | Abre la web en una pestaña de **Incógnito**. |

---
*Documentación generada el 03 de Marzo de 2026 para el equipo de KAI-HG.*
