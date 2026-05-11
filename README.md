# CompetidoreYa

Base técnica segura para plataforma de torneos deportivos, con arquitectura modular enfocada en backend.

## Stack
- Node.js + TypeScript + Express
- Prisma ORM + PostgreSQL
- Autenticación JWT
- Hash de contraseñas con bcrypt
- Validación de entrada con Zod
- Auditoría básica de acciones críticas

## Roles
- `SUPER_ADMIN`: acceso global.
- `ORGANIZADOR`: solo gestiona sus torneos.
- `COMPETIDOR`: solo gestiona sus inscripciones.
- `ARBITRO`: solo reporta resultados de partidos asignados.

## Seguridad aplicada
- Variables sensibles en `.env` (`DATABASE_URL`, `JWT_SECRET`, `BCRYPT_SALT_ROUNDS`).
- Middleware de autenticación y autorización por rol.
- Validación estricta de payloads en backend.
- Controles de ownership para evitar acceso/modificación cruzada entre usuarios.
- Registro de auditoría para login, creación de torneo, inscripción y carga de resultados.

## Configuración
1. Copiar `.env.example` a `.env` y completar valores seguros.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Generar cliente Prisma:
   ```bash
   npm run prisma:generate
   ```
4. Crear/migrar base de datos:
   ```bash
   npm run prisma:migrate
   ```
5. Ejecutar en desarrollo:
   ```bash
   npm run dev
   ```

## Estructura modular
- `src/modules/auth`: registro/login seguro.
- `src/modules/tournaments`: gestión de torneos con scoping por rol.
- `src/modules/registrations`: inscripciones por competidor autenticado.
- `src/modules/matches`: carga de resultados por árbitro asignado.
- `src/modules/audit`: auditoría centralizada.
- `src/core/middleware`: autenticación, autorización y manejo de errores.


## Flujo recomendado para continuar
1. **Levantar PostgreSQL real** (local Docker):
   ```bash
   docker run --name competidoreya-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=competidoreya -p 5432:5432 -d postgres:16
   ```
2. **Configurar variables**: copiar `.env.example` a `.env` y revisar `DATABASE_URL`.
3. **Migrar esquema Prisma**:
   ```bash
   npm run prisma:migrate -- --name init
   ```
4. **Crear primer usuario SUPER_ADMIN**:
   ```bash
   npm run prisma:seed
   ```
   Variables opcionales para el seed:
   - `SEED_ADMIN_EMAIL`
   - `SEED_ADMIN_PASSWORD`
5. **Probar registro/login**:
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"comp1@mail.com","password":"Password123!","role":"COMPETIDOR"}'

   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"comp1@mail.com","password":"Password123!"}'
   ```
6. **Probar permisos por rol** (usar token JWT):
   - `COMPETIDOR` no puede crear torneos (`POST /tournaments` → 403).
   - `ORGANIZADOR` sí puede crear/listar sus torneos.
   - `ARBITRO` solo puede reportar resultados en partidos asignados.
