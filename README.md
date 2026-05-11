# Komix

Plateforme de lecture de webcomics. Projet pour RNCP à ADA Tech School, stack SvelteKit + PostgreSQL.

## Stack

- SvelteKit
- Tailwind + DaisyUI
- Drizzle + Postgre
- Docker

## Lancer le projet



```bash
cp .env.example .env
npm run db:start
npm install
npm run dev
```

## Base de données

```bash
npm run db:migrate
npm run db:studio
```

## Tests

```bash
npm run test # Tous les tests
npm run test:unit
npm run test:e2e
```
