# Practicals 4-8 — Implementation Summary

## Practical 4: RESTful API with Node.js + Express

### Objective
Build a Task Management REST API using Express with CRUD endpoints.

### Files
- `backend/server.js` — Express server setup
- `backend/controllers/taskController.js` — CRUD logic
- `backend/routes/taskRoutes.js` — Route definitions
- `backend/middleware/logger.js` — Request logging
- `backend/middleware/requireJsonContentType.js` — Content-Type validation
- `backend/middleware/validateObjectId.js` — ObjectId format validation
- `backend/middleware/errorHandler.js` — Global error handler

### Endpoints
| Method | Endpoint | Status Codes |
|--------|----------|-------------|
| GET | /api/tasks | 200 |
| POST | /api/tasks | 201, 400 |
| GET | /api/tasks/:id | 200, 404 |
| PUT | /api/tasks/:id | 200, 404 |
| DELETE | /api/tasks/:id | 200, 404 |

### Middleware
- **Logger**: Logs method, URL, timestamp for every request
- **requireJsonContentType**: Rejects POST/PUT without Content-Type: application/json
- **validateObjectId**: Route-specific, rejects malformed MongoDB IDs with 400
- **errorHandler**: Global, returns structured JSON, never exposes stack traces
- **404 handler**: Custom JSON response for undefined routes

### Task Object
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "completed": false
}
```

### Testing
- GET /api/tasks returns 200 with task array
- POST /api/tasks with valid body returns 201
- POST /api/tasks without title returns 400
- PUT /api/tasks/:id returns 200
- DELETE /api/tasks/:id returns 200
- GET /api/tasks/invalid-id returns 400
- GET /api/tasks/nonexistent returns 404
- Undefined route returns structured 404

---

## Practical 5: MongoDB + Mongoose

### Objective
Replace in-memory storage with MongoDB using Mongoose.

### Files
- `backend/models/Task.js` — Mongoose schema
- `backend/.env` — MongoDB URI configuration

### Schema
```javascript
{
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now }
}
```

### Features
- **Pre-save hook**: Trims whitespace from title
- **Priority enum**: Restricts to low/medium/high
- **Validation errors**: Return clean structured JSON, never raw Mongoose errors
- **Async error handling**: All DB operations wrapped in try/catch, forwarded to error middleware

### Verification
- Data persists after server restart
- Schema validation rejects missing title
- Priority enum rejects invalid values
- ObjectId validation returns clean 400

---

## Practical 6: Full Stack React + Node + MongoDB

### Objective
Connect React frontend to Express/MongoDB backend.

### Architecture
```
React (localhost:3001) → Express (localhost:5000) → MongoDB
```

### Files
- `frontend/src/api.js` — Centralized API utility
- `frontend/src/pages/Home.jsx` — Task management page
- `frontend/src/components/TaskForm.jsx` — Create task form
- `frontend/src/components/TaskList.jsx` — Task list display
- `frontend/src/components/TaskItem.jsx` — Individual task display

### Features
- **CORS**: Enabled on backend for cross-origin requests
- **Centralized API**: Single `api.js` with base URL
- **CRUD from UI**: Create, read, update, delete tasks
- **Loading states**: Spinner during API calls
- **Error states**: Error banner with messages
- **Delete confirmation**: Window.confirm before delete
- **State synchronization**: Re-fetch or local state update after writes

### Verification
- Create task → appears in list
- Refresh browser → task persists
- Edit priority → updates in list
- Delete task → removed from list
- 401 handling → redirects to login

---

## Practical 7: JWT Authentication + Middleware

### Objective
Add user authentication with JWT tokens.

### Files
- `backend/models/User.js` — User model with bcrypt
- `backend/controllers/authController.js` — Register/login logic
- `backend/routes/authRoutes.js` — Auth routes
- `backend/middleware/auth.js` — JWT verification middleware
- `backend/middleware/validation.js` — Input validation (register/login/task)
- `frontend/src/pages/AuthPage.jsx` — Login/Register UI

### Endpoints
| Method | Endpoint | Auth Required | Status Codes |
|--------|----------|--------------|-------------|
| POST | /api/auth/register | No | 201, 400 |
| POST | /api/auth/login | No | 200, 401 |
| GET | /api/auth/me | Yes | 200, 401 |
| GET | /api/tasks | Yes | 200, 401 |
| POST | /api/tasks | Yes | 201, 400, 401 |
| PUT | /api/tasks/:id | Yes | 200, 404, 401 |
| DELETE | /api/tasks/:id | Yes | 200, 404, 401 |

### Security
- Passwords stored as bcrypt hashes only (never plaintext)
- JWT tokens expire after 1 hour
- JWT_SECRET loaded from environment variables
- Password never returned in API responses
- Auth middleware rejects missing/invalid/expired tokens with 401

### Frontend Auth Flow
- Unauthenticated users see Login/Register page
- Token stored in `localStorage`
- All API requests include `Authorization: Bearer <token>` header
- 401 responses clear token and redirect to login
- Logout clears token and returns to auth page

### Validation
- Email required + valid format
- Password required + min 6 characters
- Task title required
- All validated before reaching database

---

## Practical 8: React Performance Optimization + Lazy Loading

### Objective
Optimize React frontend with route-based code splitting.

### Implementation
- `React.lazy()` for Home, Projects, and Contact routes
- `<Suspense>` wrapper with Loading fallback component
- Route chunks generated separately in production build

### Baseline Build
```
dist/assets/index-<hash>.js      184.51 kB (gzip: 60.95 kB)
dist/assets/Projects-<hash>.js     1.12 kB (gzip: 0.55 kB)
dist/assets/Contact-<hash>.js      1.07 kB (gzip: 0.52 kB)
```

### Post-Optimization Build
```
dist/assets/index-<hash>.js      183.84 kB (gzip: 60.93 kB)
dist/assets/Home-<hash>.js         3.74 kB (gzip: 1.18 kB)
dist/assets/Projects-<hash>.js     1.12 kB (gzip: 0.55 kB)
dist/assets/Contact-<hash>.js      1.07 kB (gzip: 0.53 kB)
dist/assets/api-<hash>.js          1.21 kB (gzip: 0.49 kB)
```

### Key Code
```jsx
const Home = lazy(() => import('./pages/Home.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

<Suspense fallback={<Loading />}>
  <Routes>...</Routes>
</Suspense>
```

### Verified
- Home loads immediately
- Projects chunk loads on navigation
- Contact chunk loads on navigation
- Loading fallback visible during chunk download
- All routes work without full page reload
