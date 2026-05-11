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
- `ORGANIZADOR`: solo gestiona sus torneos y categorías de sus torneos.
- `COMPETIDOR`: gestiona sus inscripciones y su perfil deportivo.
- `ARBITRO`: solo reporta resultados de partidos asignados.

## Nuevos módulos deportivos base
- `cities`: catálogo de ciudades (crear/listar).
- `sports`: catálogo de deportes (crear/listar).
- `sport-categories`: categorías por deporte (crear/listar).
- `tournament-categories`: categorías habilitadas dentro de un torneo.
- `competitor-profile`: perfil deportivo del competidor.

## Reglas de acceso
- `SUPER_ADMIN` puede crear ciudades, deportes y categorías deportivas.
- `ORGANIZADOR` puede crear categorías dentro de torneos propios.
- `COMPETIDOR` puede crear/actualizar su perfil deportivo (`city`, `sport`, `sportCategory`).

## Endpoints principales
- `GET/POST /cities`
- `GET/POST /sports`
- `GET/POST /sport-categories`
- `GET/POST /tournament-categories`
- `GET/PUT /competitor-profile`

## Seed inicial
`npm run prisma:seed` ahora asegura:
- Ciudad: `Salta`
- Deporte: `Tenis`
- Categorías de tenis: `Primera`, `Segunda`, `Tercera`, `Cuarta`, `Quinta`, `Dobles`
- Usuario `SUPER_ADMIN` inicial (configurable por env)

## Setup y testing esperado
1. `npm install`
2. `npm run build`
3. `npx prisma migrate dev`
4. `npm run prisma:seed`
