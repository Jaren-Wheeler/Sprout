# Documentation Strategy

## 1. Anchor Documents (High-Level)

Anchor documents are high-level references that change infrequently.  
Each team member owns and maintains the area they are most familiar with, making it easier to stay accountable and quickly gain context on other parts of the system.

### Example Structure

docs/
├─ database.md # Luke
├─ architecture.md # Jaren
├─ api.md # Luke / Jaren
├─ frontend.md # Chelsea / Romeo
├─ decisions.md # Shared

> This approach allows everyone to focus on their domain while still providing a clear, centralized source of truth for the project.

---

## 2. Touchpoint Documentation (Lightweight, PR-Based)

Instead of requiring full documentation for every change, documentation is updated **only when a pull request changes a core contract**.

**Rule:**  
If a PR changes a contract, it must mention it.  
If it does not, no documentation update is required.

### Examples

- **Schema change** → Comment: `Updated database.md`
- **API change** → Comment: `Endpoint updated`
- **No contract change** → No documentation required

### Pull Request Template

## Summary
What does this change do? (one sentence is good)

## Does this affect?
- [ ] Database schema
- [ ] API contract
- [ ] Frontend behavior
- [ ] No contract changes

## Notes
Context or anything relevant.

--- 

## 3. What Not to Document

To avoid needless work, the following changes should **not** require documentation updates:

- Styling changes  
- Small UI tweaks  
- Refactors with no behavior changes  
- Bug fixes  

### Guiding Principle

> Code is the source of truth.  
> Documentation explains **intent**, not implementation.

## Local Database Setup

Sprout uses PostgreSQL with Prisma for database management.

### Docker Setup

Docker provides a simple way to run PostgreSQL locally without installing it directly.

**Requirements**
- Docker Desktop (https://www.docker.com/products/docker-desktop)

**Start the database**
```bash
docker compose up -d
```
**Stop the database**
```bash
docker compose down
```

## Local database credentials

- Host: localhost
- Port: 5432
- Database: sprout
- User: sprout
- Password: sprout
  
  Create a local `.env` file from `.env.example`, then run migrations:

 ```bash
cd backend
npx prisma migrate dev
```