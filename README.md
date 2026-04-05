# TaskFlow — Full-Stack Task Management System

A production-ready Task Management System built for the **Track A (Full-Stack)** assessment.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | Node.js + Express + TypeScript |
| ORM | Prisma |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (Access + Refresh Token rotation) |
| Password Hashing | bcryptjs |
| Validation | Zod |
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (with auto-refresh interceptor) |

---

---

## Setup & Running

### Prerequisites
- Node.js 18+
- npm or yarn

---

### 1. Backend Setup

```bash
cd taskflow/backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database (creates SQLite file)
npx prisma db push

# Start development server
npm run dev
```

The API will be running at **http://localhost:4000**

---

### 2. Frontend Setup

```bash
cd taskflow/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The web app will be running at **http://localhost:3000**

---

## API Endpoints

### Authentication

| Method | Endpoint | Body | Auth Required | Description |
|--------|----------|------|---------------|-------------|
| POST | `/auth/register` | `{ name, email, password }` | No | Register new user |
| POST | `/auth/login` | `{ email, password }` | No | Login, returns tokens |
| POST | `/auth/refresh` | `{ refreshToken }` | No | Rotate tokens |
| POST | `/auth/logout` | `{ refreshToken }` | No | Invalidate refresh token |

**Success response (login/register):**
```json
{
  "user": { "id": "...", "name": "Alex", "email": "alex@example.com", "createdAt": "..." },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

---

### Tasks (all require `Authorization: Bearer <accessToken>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get paginated tasks (supports filtering/search) |
| POST | `/tasks` | Create a new task |
| GET | `/tasks/:id` | Get a single task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| PATCH | `/tasks/:id/toggle` | Toggle task status (PENDING ↔ COMPLETED) |

**GET /tasks query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | Filter: `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| `priority` | string | Filter: `LOW`, `MEDIUM`, `HIGH` |
| `search` | string | Search by task title |

**GET /tasks response:**
```json
{
  "tasks": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

**Task object:**
```json
{
  "id": "cuid...",
  "title": "Finish assessment",
  "description": "Complete the full-stack track",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2024-03-15T00:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "...",
  "userId": "..."
}
```

---

## Key Implementation Details

### JWT Token Strategy
- **Access Token**: 15-minute lifetime, used in `Authorization: Bearer` header
- **Refresh Token**: 7-day lifetime, stored in database (`RefreshToken` table)
- **Rotation**: On refresh, old token is deleted and a new pair is issued
- **Auto-refresh**: Axios interceptor catches 401 responses, refreshes transparently, retries original request

### Security
- Passwords hashed with `bcryptjs` (12 salt rounds)
- Tasks are user-scoped — users can only access their own tasks (enforced in all queries via `userId`)
- Refresh tokens are stored and validated in DB (can be revoked on logout)
- Input validation via `Zod` schemas on all endpoints

### Frontend State
- Auth state persisted to `localStorage` (user, accessToken, refreshToken)
- Hydrated on app load via `useAuthStore().hydrate()`
- Unauthenticated routes redirect to `/auth/login`
- Dashboard redirects to login if token is invalid/expired

### Responsive Design
- Mobile-first Tailwind layout
- Auth pages: split-panel on desktop, full-screen on mobile
- Dashboard: responsive grid stats, stacked task cards

---

## Task Data Model

```prisma
model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)   // PENDING | IN_PROGRESS | COMPLETED
  priority    Priority   @default(MEDIUM)    // LOW | MEDIUM | HIGH
  dueDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  userId      String
  user        User       @relation(...)
}
```

---

## Production Notes

For production deployment, replace the SQLite datasource in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

And update `.env`:
```
DATABASE_URL="postgresql://user:password@host:5432/taskflow"
JWT_ACCESS_SECRET="<cryptographically-random-32+-char-string>"
JWT_REFRESH_SECRET="<cryptographically-random-32+-char-string>"
```

---
