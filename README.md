[![PlaySphere CI Pipeline](https://github.com/DASUN53/playsphere_project/actions/workflows/ci.yml/badge.svg)](https://github.com/DASUN53/playsphere_project/actions/workflows/ci.yml)

# PlaySphere

PlaySphere is a containerized full-stack e-sports and gaming platform featuring a games catalog, tournament/event listings, a store with order management, user collections, and JWT-based authentication.

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Lucide React, served with Nginx in production
- **Backend:** Node.js 20, Express 5, `mysql2`, JWT (`jsonwebtoken`), `bcryptjs`
- **Database:** MySQL 8.0 (initialized via `backend/db/schema.sql` and `backend/db/seed.sql`)
- **DevOps & Security:** Docker, Docker Compose, GitHub Actions, Trivy, GitHub Container Registry (GHCR)

## Project Structure

```text
playsphere_project/
├── .github/workflows/ci.yml   # CI/CD & DevSecOps pipeline
├── backend/                   # Express REST API & MySQL schema/seed
│   ├── db/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── routes/            # auth, games, events, orders, collections
│       └── server.js
├── frontend/                  # React + Vite SPA & Nginx config
│   ├── nginx.conf
│   └── src/
│       ├── Components/
│       ├── context/
│       ├── pages/             # Home, Store, Events, GameDetails, Profile, etc.
│       └── services/
└── docker-compose.yml         # Multi-container orchestration (db, backend, frontend)
```

## Getting Started

### Option 1: Run with Docker Compose (Recommended)

1. Ensure you have a `.env` file in `playsphere_project/` with the required database and JWT variables:

   ```env
   MYSQL_ROOT_PASSWORD=your_root_password
   MYSQL_DATABASE=playsphere
   MYSQL_USER=playsphere_user
   MYSQL_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```

2. Build and start all services (`db`, `backend`, and `frontend`):

   ```bash
   docker compose up --build
   ```

3. Access the application:
   - **Frontend:** `http://localhost` (mapped from container port `8080`)
   - **Backend API:** `http://localhost:5000`
   - **Health Check:** `http://localhost:5000/api/health`

### Option 2: Run Locally (Without Docker)

**Backend:**

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Endpoint | Description |
| :--- | :--- |
| `GET /api/health` | Express & MySQL connectivity health check |
| `/api/auth` | User registration and JWT login |
| `/api/games` | Games catalog |
| `/api/events` | E-sports tournaments and events |
| `/api/orders` | Store order management |
| `/api/collections` | User game collections |

## CI/CD Pipeline

The GitHub Actions workflow in [.github/workflows/ci.yml](.github/workflows/ci.yml) runs on pushes and pull requests to `main` and `development-new`:

1. **Frontend Quality & Build Check (`frontend-ci`):** Installs dependencies and runs `npm run build`.
2. **Backend API & Database Integration (`backend-ci`):** Spins up an ephemeral MySQL 8.0 container, loads `schema.sql` and `seed.sql`, starts the Express server, and verifies `/api/health` and `/api/games`.
3. **Container Vulnerability Scan (`security-scan`):** Builds the backend and frontend Docker images and scans both with **Trivy** for `CRITICAL` and `HIGH` CVEs.
4. **Continuous Delivery (`publish-images`):** On pushes to `main`, builds and pushes the images to **GitHub Container Registry (`ghcr.io`)**.
