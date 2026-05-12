# CompetidoreYa

Base técnica segura para plataforma de torneos deportivos, con arquitectura modular enfocada en backend + frontend mínimo funcional.

## Stack
- Node.js + TypeScript + Express
- Prisma ORM + PostgreSQL
- Autenticación JWT
- Hash de contraseñas con bcrypt
- Validación de entrada con Zod
- Auditoría básica de acciones críticas
- Frontend React + Vite + Tailwind

## Roles
- `SUPER_ADMIN`: acceso global.
- `ORGANIZADOR`: solo gestiona sus torneos y categorías de sus torneos.
- `COMPETIDOR`: gestiona sus inscripciones y su perfil deportivo.
- `ARBITRO`: solo reporta resultados de partidos asignados.

## Frontend (estado actual)
Pantalla inicial con selección de tipo de usuario:
1. Competidor
2. Organizador / Administrador de torneo
3. Árbitro

### Registro de competidor
Solicita:
- email
- password
- ciudad
- deporte
- categoría

Flujo:
- registra competidor (`POST /api/auth/register/competitor`)
- hace login automático (`POST /api/auth/login`)
- intenta completar perfil deportivo (`PUT /api/competitor-profile`)
- muestra panel de competidor con perfil + torneos + botón **Inscribirme**

### Organizadores y árbitros
- Vista preparada para organizador con mensaje: **“Registro de organizadores próximamente”**.
- Vista preparada para árbitro con mensaje: **“Registro de árbitros próximamente”**.
- Panel organizador preparado con listado de torneos y botón futuro **Crear torneo**.
- Panel árbitro con mensaje: **“Panel de árbitro en preparación”**.

## Seguridad y catálogos públicos
Lectura pública habilitada para:
- `GET /api/cities`
- `GET /api/sports`
- `GET /api/sport-categories`

Escritura protegida por autenticación/rol:
- `POST /api/cities`
- `POST /api/sports`
- `POST /api/sport-categories`
- resto de endpoints de operación

## Setup y testing esperado
1. `npm install`
2. `npm run build`
3. `npx prisma migrate dev`
4. `npm run prisma:seed`
5. `cd frontend && npm install && npm run build`
