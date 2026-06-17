# Konsulta — Smart Triage Widget

An AI symptom-intake widget. When a patient describes their symptoms in free text, Claude returns:

- **Recommended department**
- **Urgency** (routine / soon / urgent / emergency)
- **2–3 matching doctors + suggested appointment slots**

Designed as a thin "middleware" layer that sits in front of an existing booking
system (e.g. eKonsulta Clinic). It adds an intelligent intake step before the
booking page without touching the backend.

## Tech Stack

| Area | Technology |
|------|------------|
| Frontend | React (Vite) |
| Backend | Node.js + Express (REST API) |
| DB | MongoDB (Mongoose) |
| AI | Claude (`claude-opus-4-8`) via `@anthropic-ai/sdk` |
| Infra | GCP (target: Cloud Run / App Engine) |

> This is a dummy-data demo. It always runs: with no MongoDB connection it falls
> back to in-memory dummy data, and with no `ANTHROPIC_API_KEY` it falls back to
> rule-based mock triage.

## How to Run

Run the backend and frontend in **two separate terminals**. The backend must be
running first so the frontend's `/api` proxy can reach it.

Prerequisites: Node.js 18+ (npm). MongoDB and an Anthropic API key are optional —
without them the app falls back to in-memory data + rule-based mock triage.

### 1. Backend (Terminal A) — http://localhost:4000

```bash
cd server
cp .env.example .env          # creates server/.env (NOT the repo root)
                              # optionally set ANTHROPIC_API_KEY, MONGODB_URI
npm install
npm run seed                  # (optional) load dummy doctors into MongoDB — see "Database" below
npm run dev                   # start the API server
```

> **Where does `.env` live?** Because the `cp` above runs from inside `server/`,
> it creates **`server/.env`**. The backend's `dotenv` loads the `.env` from the
> directory the server runs in (`server/`), so a `.env` in the repo root is **not**
> used. Keep the env file at `server/.env`.

> **Restart after editing `.env`.** `npm run dev` uses `node --watch`, which only
> watches imported source files — **not** `.env` (it's read by `dotenv`, not
> imported). After changing `MONGODB_URI`, `ANTHROPIC_API_KEY`, etc., stop the
> server (`Ctrl+C`) and run `npm run dev` again, or it keeps using the old values.

### 2. Frontend (Terminal B) — http://localhost:5173

```bash
cd client
npm install
npm run dev                   # start the Vite dev server, then open the URL it prints
```

Vite proxies `/api/*` to the backend on port 4000 (see `client/vite.config.js`),
so no extra config is needed.

### Production build (frontend)

```bash
cd client
npm run build                 # outputs static files to client/dist/
npm run preview               # preview the built site locally
```

## Database (MongoDB)

The app works **without any database** (in-memory dummy data). To persist the
dummy doctors and triage logs, point `MONGODB_URI` in `server/.env` at a MongoDB
instance and run the seed once.

### Option A — MongoDB Atlas (cloud, no local install)

1. Create a free **M0** cluster at <https://www.mongodb.com/cloud/atlas>.
2. **Database Access** → add a user (remember the password).
3. **Network Access** → add your IP (or `0.0.0.0/0` for development).
4. **Connect → Drivers** → copy the connection string.
5. Put it in `server/.env`, replacing `<password>` and adding the database name
   **`/konsulta` in the path** (before the `?`):

```bash
# server/.env  — note the "/konsulta" path segment
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/konsulta?retryWrites=true&w=majority
```

> ⚠️ **Common mistake:** the database name goes in the **path** (`.../mongodb.net/konsulta?...`),
> not as a query parameter (`...?konsulta=...`). Without `/konsulta` the data lands
> in the default `test` database.

### Option B — Local MongoDB

```bash
# macOS (Homebrew)
brew install mongodb-community
brew services start mongodb-community
```

```bash
# server/.env
MONGODB_URI=mongodb://localhost:27017/konsulta
```

### Seed the dummy data

```bash
cd server
npm run seed     # → "[db] MongoDB connected" then "[seed] Loaded 16 doctors"
```

Once connected, `npm run dev` logs `[db] MongoDB connected`, and the API reads
doctors from the `doctors` collection and writes triage logs to `triagerequests`.
Without a reachable `MONGODB_URI` it silently falls back to in-memory data.

> The "Demo mode (rule-based)" tag in the widget footer reflects the **AI** status
> (no `ANTHROPIC_API_KEY`), not the database. The DB works independently.

## API

### `POST /api/triage`

```json
{ "symptoms": "Chest has felt tight for 3 days and I get short of breath climbing stairs", "locale": "en" }
```

Response:

```json
{
  "recommendedDepartment": "Cardiology",
  "urgency": "urgent",
  "urgencyLabel": "Urgent — seek prompt care",
  "assessment": "Chest discomfort and shortness of breath worsening with exertion...",
  "redFlags": ["chest pain on exertion", "shortness of breath"],
  "doctors": [
    {
      "id": "doc-cardio-01",
      "name": "Dr. Maria Santos",
      "department": "Cardiology",
      "specialties": ["..."],
      "languages": ["Filipino", "English"],
      "suggestedSlots": ["2026-06-18 09:30", "2026-06-18 10:00"]
    }
  ],
  "source": "claude"
}
```

### `GET /api/doctors`

Returns all dummy doctor/department data.

## Structure

```
konsulta/
├── server/   Express REST API + MongoDB + Claude triage service
└── client/   React widget
```
