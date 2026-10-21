# Task Manager — Full Stack Application (Practicals 4-9)

A full-stack Task Management application built with React, Express, MongoDB, JWT authentication, and in-memory caching. Implements Practicals 4 through 9 of the Advanced Web Development Frameworks course.

## Technologies

- **Frontend:** React 18, React Router DOM v7, Vite 8
- **Backend:** Node.js, Express 4, Mongoose 8
- **Database:** MongoDB
- **Auth:** bcryptjs, jsonwebtoken (JWT)
- **Other:** CORS, dotenv
- **Performance:** node-cache with a 60-second TTL and write invalidation

## Project Structure

```
task-manager-p5/
├── backend/
│   ├── models/
│   │   ├── Task.js              # Mongoose schema (title, description, completed, priority)
│   │   └── User.js              # User model (email, bcrypt password)
│   ├── controllers/
│   │   ├── taskController.js    # Task CRUD operations
│   │   └── authController.js    # Register, login, getMe
│   ├── routes/
│   │   ├── taskRoutes.js        # Protected task routes
│   │   └── authRoutes.js        # Public auth routes
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── logger.js            # Request logging
│   │   ├── requireJsonContentType.js
│   │   ├── validateObjectId.js  # ObjectId format check
│   │   ├── validate.js          # Input validation
│   │   └── errorHandler.js      # Global error handler
│   ├── server.js                # Express server entry point
│   ├── package.json
│   ├── .env                     # Environment variables (git-ignored)
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── api.js               # Centralized API utility
│   │   ├── App.jsx              # Root component with auth + routing
│   │   ├── main.jsx             # Entry point
│   │   ├── index.css            # Global styles
│   │   ├── components/
│   │   │   ├── TaskForm.jsx     # Create task form
│   │   │   ├── TaskList.jsx     # Task list display
│   │   │   ├── TaskItem.jsx     # Individual task
│   │   │   └── Loading.jsx      # Suspense fallback
│   │   └── pages/
│   │       ├── Home.jsx         # Task management (lazy-loaded)
│   │       ├── Projects.jsx     # Projects page (lazy-loaded)
│   │       ├── Contact.jsx      # Contact page (lazy-loaded)
│   │       └── AuthPage.jsx     # Login/Register
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── performance.md           # Practical 8 performance report
│   └── practicals-4-8.md        # Implementation summary
├── .gitignore
├── .env.example
└── README.md
```

## Prerequisites

- Node.js (v18+)
- npm
- MongoDB (local installation or MongoDB Atlas)

## Installation

### 1. Backend

```bash
cd backend
npm install
```

### 2. Frontend

```bash
cd frontend
npm install
```

## Environment Variables

Copy `.env.example` to `backend/.env`:

```bash
cp .env.example backend/.env
```

Edit `backend/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
PORT=5000
JWT_SECRET=your_secret_key_here
```

**Never commit `.env` with real secrets.**

## Running the Application

### Start MongoDB

Ensure MongoDB is running locally:

```bash
mongod
# or check with:
mongosh
```

### Start Backend (Port 5000)

```bash
cd backend
npm run dev
```

Output:
```
MongoDB connected
Server running on port 5000
```

### Start Frontend (Port 3001)

```bash
cd frontend
npm run dev
```

Open `http://localhost:3001` in your browser.

## Authentication Flow

1. **Register:** POST `/api/auth/register` with `{ email, password }`
2. **Login:** POST `/api/auth/login` with `{ email, password }`
3. Receive JWT token
4. Store token in `localStorage`
5. All task requests include `Authorization: Bearer <token>` header
6. **Logout:** Clear token from `localStorage`

## API Endpoints

### Auth (Public)

| Method | Endpoint | Body | Status | Description |
|--------|----------|------|--------|-------------|
| POST | `/api/auth/register` | `{ email, password }` | 201 | Register new user |
| POST | `/api/auth/login` | `{ email, password }` | 200 | Login, returns JWT |
| GET | `/api/auth/me` | — | 200 | Get current user (requires JWT) |

### Tasks (Protected — requires JWT)

| Method | Endpoint | Body | Status | Description |
|--------|----------|------|--------|-------------|
| GET | `/api/tasks` | — | 200 | Get all tasks |
| POST | `/api/tasks` | `{ title, description?, priority? }` | 201 | Create task |
| GET | `/api/tasks/:id` | — | 200 | Get single task |
| PUT | `/api/tasks/:id` | `{ title?, completed?, priority? }` | 200 | Update task |
| DELETE | `/api/tasks/:id` | — | 200 | Delete task |

### Example Request Bodies

**Register:**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Create Task:**
```json
{
  "title": "Complete homework",
  "description": "Math assignment chapter 5",
  "priority": "high"
}
```

**Update Task:**
```json
{
  "completed": true,
  "priority": "low"
}
```

### Example Authorization Header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Practical Summaries

### Practical 4: RESTful API
Express server with Task CRUD endpoints, logging middleware, Content-Type validation, ObjectId validation, global error handler, and custom 404 responses.

### Practical 5: MongoDB + Mongoose
Replaced in-memory storage with MongoDB. Task schema with title (required), description, completed, priority (enum: low/medium/high), createdAt. Pre-save hook trims title. Clean validation error responses.

### Practical 6: Full Stack
Connected React frontend to backend. Centralized API utility, task CRUD UI with loading/error states, delete confirmation, state synchronization after writes.

### Practical 7: JWT Authentication
User model with bcrypt password hashing. Register/login endpoints. JWT tokens (1h expiry). Auth middleware protecting all task routes. Frontend auth flow with token storage, 401 handling, and logout.

### Practical 8: Performance Optimization
Route-based lazy loading with React.lazy() and Suspense. Projects and Contact pages loaded on demand. Loading fallback component. Bundle splitting verified in production build.

### Practical 9: In-Memory Caching
`GET /api/tasks` uses node-cache with a 60-second TTL. All task writes invalidate collection and single-task cache keys. A protected `/api/tasks/debug/cache` endpoint exposes hit/miss counters. See `docs/practical-9-caching.md` for the measurement procedure and lab journal table.

## Performance (Before/After)

| Metric | Before | After |
|--------|--------|-------|
| Initial JS bundle | 184.51 kB | ~186 kB |
| Projects chunk | 1.12 kB (lazy) | 1.12 kB (lazy) |
| Contact chunk | 1.07 kB (lazy) | 1.07 kB (lazy) |
| Auth page | N/A | Eagerly loaded |

See `docs/performance.md` for detailed build output.

## Known Issues

- MongoDB must be running locally before starting the backend
- JWT secret in `.env.example` is a placeholder — replace with a real secret
- The contact form on the Contact page is a demo (no backend submission)
