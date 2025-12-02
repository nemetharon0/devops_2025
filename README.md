# Weather & Outfit Suggester

Egyszerű full-stack app: várost megadva lekéri az időjárást (Open-Meteo), outfitet ajánl, és a Wikipédiáról háttérképet húz a városhoz.

## Futtatás lokálisan
- Backend: `cd Backend && npm install && npm start` → http://localhost:5050/api/weather?city=Berlin
- Frontend dev: `cd Frontend && npm install && npm run dev` → http://localhost:5173

## Konfig
- `Backend/.env`: `PORT=5050`, `DEFAULT_CITY`, `DEFAULT_COUNTRY`, Open-Meteo URL-ek.
- `Frontend/.env`: `VITE_API_BASE_URL=http://localhost:5050/api`, `VITE_DEFAULT_CITY`.
- Outfit képek: `Frontend/public/outfits/*.jpg` (fájlnév az outfit szerint).

## Tesztek
- Backend: `cd Backend && npm test` (Vitest + Supertest).
- Frontend unit: `cd Frontend && npm test` (Vitest + RTL).
- Frontend E2E: `cd Frontend && npx playwright install && npm run test:e2e`.

## CI/CD (GitHub Actions)
- `ci.yml`: backend+frontend install, unit + E2E (Playwright telepítéssel, wait-on 5050/5173).
- `cd.yml`: build & push Docker Hubra (`nemetharon0/devops-frontend/backend:latest`), majd SCP + SSH deploy `docker compose pull/up`.
- Secrets: `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `SSH_HOST`, `SSH_USER`, `SSH_KEY`.

## Dockerfile-ok
- Backend: Node alpine, `PORT 5050`.
- Frontend: Vite build → Nginx statikus host, proxypass `/api` → backend (nginx.conf).

## Hasznos
- Health: `GET /health`.
- API: `GET /api/weather?city=Berlin[&country=DE]` → `city,country, tempCelsius, condition, outfit, background`.
