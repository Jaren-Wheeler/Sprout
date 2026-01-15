Any descisions ?????

## Summary

This PR adds the initial PostgreSQL database setup using Prisma.

### What’s included
- Prisma schema based on database design docs
- Initial migration creating all core tables
- Docker Compose setup for local PostgreSQL
- `.env.example` for local configuration
- Documentation for running the database locally

### How to test
1. Install Docker Desktop (optional but recommended)
2. Run `docker compose up -d`
3. Copy `.env.example` → `.env`
4. Run `npx prisma migrate dev` from `backend`
5. Open Prisma Studio with `npx prisma studio`

Docker is recommended but optional for developers with a local Postgres install.
