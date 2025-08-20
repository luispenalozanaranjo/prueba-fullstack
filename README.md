# Prueba Fullstack — Nuxt 3 + Pinia + Sass + Moleculer/Express + MongoDB

## Levantar todo con Docker
```bash
docker compose up --build
# Front: http://localhost:3000
# Back : http://localhost:3001/api
```

## Front (Nuxt 3)
Directorio: `/frontend` — Config env: `NUXT_PUBLIC_API_BASE`

## Back (Moleculer por defecto)
Directorio: `/backend` — Env: `PORT`, `MONGODB_URI`, `BASIC_AUTH_*`

## Back alternativo (Express)
Directorio: `/backend-express` — misma API

## Deploy
- Front: Vercel (root `/frontend`)
- Back: Render/Fly/Heroku (root `/backend` o `/backend-express`)
