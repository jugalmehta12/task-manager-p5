# Performance Optimization Report — Practical 8

## Objective

Optimize the React frontend using route-based code splitting (lazy loading) and measure the impact on bundle sizes.

## Baseline (Before Optimization)

Recorded before adding lazy loading to the frontend routes.

```
dist/index.html                     0.41 kB │ gzip:  0.27 kB
dist/assets/index-DYw5gYtR.css     2.58 kB │ gzip:  0.94 kB
dist/assets/Contact-DXI0p-9s.js    1.07 kB │ gzip:  0.52 kB
dist/assets/Projects-DuC0ZI3R.js   1.12 kB │ gzip:  0.55 kB
dist/assets/index-CTIQre5C.js    184.51 kB │ gzip: 60.95 kB
```

**Total JS (initial load):** 184.51 kB (60.95 kB gzipped)
**JS chunks:** 3 (main + 2 lazy chunks already existed from earlier work)

**Note:** The initial codebase already had lazy loading for Projects and Contact routes. The baseline above represents the state at the start of this session.

## What Was Implemented

1. **JWT Authentication** (Practical 7) — Added `bcryptjs` and `jsonwebtoken` to backend.
2. **Route-based lazy loading** was already present for `Projects` and `Contact` pages.
3. **Auth page** is eagerly loaded (required immediately on app load for unauthenticated users).
4. **Home page** is eagerly loaded (main task management view).

## Post-Optimization Build

After all changes (JWT auth, auth page, updated API, 401 handling):

```
dist/index.html                     0.41 kB │ gzip:  0.28 kB
dist/assets/index-DY1vODir.css     3.97 kB │ gzip:  1.22 kB
dist/assets/index-C4tKHxOX.js    183.84 kB │ gzip: 60.93 kB
dist/assets/Home-BSQ1iYlJ.js       3.74 kB │ gzip:  1.18 kB
dist/assets/Projects-I7qDhFwj.js   1.12 kB │ gzip:  0.55 kB
dist/assets/Contact-CCl9FjOg.js    1.07 kB │ gzip:  0.53 kB
dist/assets/api-BmKQhQD5.js        1.21 kB │ gzip:  0.49 kB
```

## Lazy-Loaded Routes

| Route      | Component   | Loading Strategy | Chunk Size |
|------------|-------------|------------------|------------|
| `/`        | Home        | `React.lazy()`   | 3.74 kB    |
| `/projects`| Projects    | `React.lazy()`   | 1.12 kB    |
| `/contact` | Contact     | `React.lazy()`   | 1.07 kB    |
| Auth       | AuthPage    | Eager (conditional) | — |

## Key Implementation Details

```jsx
// App.jsx — lazy imports
const Home = lazy(() => import('./pages/Home.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

// Suspense wrapper around Routes
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/contact" element={<Contact />} />
  </Routes>
</Suspense>
```

## Verified Behavior

- Home page loads immediately on `/`
- Projects page lazy chunk loads on navigation to `/projects`
- Contact page lazy chunk loads on navigation to `/contact`
- `<Loading />` fallback shown while lazy chunks download
- All routes work without full page reload
- Auth page shown when not logged in, hides after login

## Observations

- Home, Projects, and Contact are all lazy-loaded as separate chunks
- Home chunk (3.74 kB) is larger because it contains task management logic
- Projects chunk (1.12 kB) and Contact chunk (1.07 kB) are small due to minimal logic
- API utility is shared in a separate chunk (1.21 kB)
- Auth page is eagerly loaded since it's shown immediately for unauthenticated users
- Main bundle (183.84 kB) contains React, React Router, and core app code
- Total JS across all chunks: ~191 kB (~63.7 kB gzipped)
