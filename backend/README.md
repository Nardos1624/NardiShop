# NardiShop backend

The Next.js frontend proxies `/api/*` and `/uploads/*` to this service on port
5000. The backend must be running and connected to PostgreSQL for those routes
to work.

## Configure PostgreSQL

Create a local PostgreSQL database named `NardiShop`, then copy `.env.example`
to `.env` and set `DB_PASS` to the password for `DB_USER`. For a hosted database,
set `DATABASE_URL` to its connection string instead. Keep `.env` private; it
contains credentials.

## Start the backend

First copy the example environment file from the repository root and set the
PostgreSQL credentials:

```sh
cp backend/.env.example backend/.env
```

Then, in a separate terminal from the frontend, start the backend:

```sh
cd backend
pnpm install
pnpm dev
```

The server listens on port 5000 only after the database connection succeeds.
Verify it at <http://localhost:5000/health>. If the frontend reports
`ECONNREFUSED`, check that PostgreSQL is running and that `backend/.env` has
valid credentials; product API and uploaded-image requests cannot work until
the backend starts.