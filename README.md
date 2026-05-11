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
