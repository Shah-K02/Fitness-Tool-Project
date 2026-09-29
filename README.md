# Personalised Fitness Assistant

A personal training log: log food by time of day against a daily calorie
target, calculate calories and macros for a goal, search exercises with
demonstrations and tutorial videos, and share progress in a community feed.

- **Client:** React 18 (Create React App), in `client/`
- **API:** Node 20 + Express 4, in `server/server/`
- **Database:** MySQL 8, schema in `server/db/`
- **External APIs:** USDA FoodData Central (food search), ExerciseDB and
  YouTube Search via RapidAPI (exercises and tutorial videos)

In production a single Express server serves both the API (`/api/*`) and the
built React app, so there's one service to deploy and no CORS setup.

## Requirements

- Node.js 20 or newer
- MySQL 8
- API keys: a [USDA FoodData Central key](https://fdc.nal.usda.gov/api-key-signup)
  (free) and a [RapidAPI](https://rapidapi.com) key subscribed to
  **ExerciseDB** and **YouTube Search and Download**

## Local development

```bash
# 1. Install dependencies
npm run install:all

# 2. Create the database and tables
mysql -u root -p -e "CREATE DATABASE fitness_app"
mysql -u root -p fitness_app < server/db/schema.sql

# 3. Configure the server
cp server/server/.env.example server/server/.env
#    then fill in the database details, JWT_SECRET and API keys

# 4. Run the API (port 8081) and the client (port 3000) in two terminals
npm run dev:server
npm run dev:client
```

Open http://localhost:3000. The client's dev server proxies `/api` requests
to the API.

## Tests

```bash
npm test
```

Runs the API tests (`server/server/__tests__`, database mocked) and the client
tests. GitHub Actions runs the same tests, a dependency audit and a production
build on every push (`.github/workflows/ci.yml`).

## Configuration

All settings are environment variables, documented in
[`server/server/.env.example`](server/server/.env.example). The ones a
deployment must set:

| Variable | Notes |
|---|---|
| `NODE_ENV` | `production` |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` | MySQL connection |
| `DB_SSL` | `true` for managed databases that require TLS |
| `JWT_SECRET` | Random string, at least 32 characters |
| `USDA_API_KEY` | Without it, food search falls back to USDA's heavily rate-limited `DEMO_KEY` |
| `REACT_APP_RAPID_API_KEY` | Used by the API server only; never sent to the browser |
| `PORT` | Usually set by the host |

The server refuses to start if the required variables are missing or the JWT
secret is too short in production.

## Deploying

### Any Node host (Render, Railway, Heroku, a VPS)

- **Build command:** `npm run build` (builds the client and installs the
  server's production dependencies only; run `npm run install:all` again
  before developing or testing locally)
- **Start command:** `npm start`
- **Health check path:** `/api/health`
- Set the environment variables above.
- Create the tables once with `server/db/schema.sql`.
- Uploaded post images are written to `server/server/uploads` (or
  `UPLOADS_DIR`). Hosts with ephemeral disks lose these on redeploy, so attach
  a persistent disk at that path.

### Docker

```bash
docker build -t fitness-assistant .
docker run -p 8081:8081 --env-file server/server/.env -e NODE_ENV=production \
  -v fitness-uploads:/app/server/server/uploads fitness-assistant
```

### Upgrading an existing database

Databases created before `server/db/schema.sql` existed need one migration,
which adds unique emails and cascading deletes:

```bash
mysql -u <user> -p <database> < server/db/migrations/001_integrity_constraints.sql
```

## Security

- Passwords are hashed with bcrypt (cost 12). Sign-in returns a JWT that
  expires after an hour.
- Login and registration are rate limited, as are the exercise and food
  lookups that spend third-party API quota.
- Security headers via Helmet, including a Content-Security-Policy.
- Uploads accept JPEG, PNG, GIF and WebP only (checked by file contents, not
  just the declared type), up to 5 MB, saved under random names.
- Users can only change or delete their own posts, food entries and profile.
- API errors never expose internal details.

## Project structure

```
client/                 React app
  src/components/       Pages and components
  src/helpers/          Auth context, API client, nutrition maths
server/
  db/                   schema.sql and migrations
  server/               Express API
    app.js              App setup: security, rate limits, routes
    server.js           Starts the server
    config.js           Environment configuration
    db.js               MySQL connection pool
    routes/ controllers/ models/ middleware/
    __tests__/          API tests
```
