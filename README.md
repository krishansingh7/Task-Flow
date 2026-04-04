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

## Project Structure

```
taskflow/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # DB schema (User, Task, RefreshToken)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts  # register, login, refresh, logout
│   │   │   └── tasks.controller.ts # CRUD + toggle + pagination/filter/search
│   │   ├── lib/
│   │   │   ├── prisma.ts           # Prisma singleton
│   │   │   └── jwt.ts              # Sign/verify access & refresh tokens
│   │   ├── middleware/
│   │   │   └── auth.ts             # Bearer token authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.routes.ts      # /auth/*
│   │   │   └── tasks.routes.ts     # /tasks/* (all protected)
│   │   └── index.ts                # Express app entry point
│   ├── .env                        # Dev environment variables
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── auth/
    │   │   │   ├── layout.tsx       # Split-panel auth layout
    │   │   │   ├── login/page.tsx   # Login form
    │   │   │   └── register/page.tsx# Registration form
    │   │   ├── dashboard/
    │   │   │   └── page.tsx         # Main task dashboard
    │   │   ├── globals.css          # Design tokens + Tailwind layers
    │   │   ├── layout.tsx
    │   │   └── page.tsx             # Root redirect
    │   ├── components/
    │   │   ├── layout/
    │   │   │   └── DashboardHeader.tsx
    │   │   ├── tasks/
    │   │   │   ├── TaskCard.tsx     # Individual task card w/ actions
    │   │   │   ├── TaskModal.tsx    # Create/Edit modal form
    │   │   │   ├── FilterBar.tsx    # Search + status + priority filters
    │   │   │   └── StatsBar.tsx     # Summary stats (total/pending/etc)
    │   │   └── ui/
    │   │       ├── Toast.tsx        # Toast notification system
    │   │       ├── Badges.tsx       # Status & Priority badges
    │   │       ├── ConfirmModal.tsx # Delete confirmation dialog
    │   │       └── Pagination.tsx   # Page navigation
    │   ├── lib/
    │   │   ├── api.ts               # Axios instance + auto-refresh interceptor
    │   │   └── tasks.service.ts     # Tasks API calls
    │   ├── store/
    │   │   └── auth.store.ts        # Zustand auth store
    │   └── types/
    │       └── index.ts             # Shared TypeScript types
    ├── .env.local
    ├── next.config.js
    ├── tailwind.config.js
    └── tsconfig.json
```

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

## Assessment Coverage

| Requirement | Status |
|-------------|--------|
| ✅ Node.js + TypeScript backend | Complete |
| ✅ Prisma ORM + SQL database | Complete |
| ✅ JWT access + refresh tokens | Complete |
| ✅ bcrypt password hashing | Complete |
| ✅ `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` | Complete |
| ✅ Full task CRUD endpoints | Complete |
| ✅ `GET /tasks` with pagination | Complete |
| ✅ `GET /tasks` with status filtering | Complete |
| ✅ `GET /tasks` with title search | Complete |
| ✅ `PATCH /tasks/:id/toggle` | Complete |
| ✅ Proper HTTP status codes (400, 401, 404, 409) | Complete |
| ✅ Input validation + error handling | Complete |
| ✅ Next.js App Router frontend | Complete |
| ✅ Login + Registration pages | Complete |
| ✅ Token storage + auto-refresh logic | Complete |
| ✅ Task dashboard with list | Complete |
| ✅ Filtering + searching UI | Complete |
| ✅ Responsive design (mobile + desktop) | Complete |
| ✅ Add, Edit, Delete, Toggle UI | Complete |
| ✅ Toast notifications | Complete |
