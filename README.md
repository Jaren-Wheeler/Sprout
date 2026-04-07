# Sprout

Sprout is a personal productivity and life management application designed to help users track finances, fitness, planning, and daily organization in one place.

## Requirements
- Node.js (v18+)
- Docker & Docker Compose
- Git

## Installation Steps

1. Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```

2. Start the Database Using Docker
```bash
docker compose up -d
```
This will start the PostgreSQL database in a Docker container.

3. Set Up Environment Variables
Create a `.env` file inside the backend directory based on the `.env.example` file.

Example:
```javascript
DATABASE_URL="postgresql://sprout:sprout@localhost:5432/sprout"
USDA_API_KEY=your_usda_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. Install Backend Dependencies
```bash
cd backend
npm install
```

5. Run Database Migrations (Prisma)
```bash
npx prisma migrate dev
```

6. Install Frontend Dependencies
```bash
cd frontend
npm run dev
```

7. Start the Backend Server
```bash
cd backend
npm run dev
```

8. Start the Frontend
```bash
cd frontend
npm run dev
```

9. Access the App: <http://localhost:5173>