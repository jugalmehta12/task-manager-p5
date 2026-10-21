const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

function extractErrorMessage(data, fallback) {
  if (Array.isArray(data.error)) return data.error.join(', ');
  return data.error || fallback;
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(extractErrorMessage(data, 'Request failed'));
    error.status = res.status;
    throw error;
  }
  return data;
}

// Auth
export async function register(email, password) {
  const data = await request(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return data.data;
}

export async function login(email, password) {
  const data = await request(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return data.data;
}

export async function getMe() {
  const data = await request(`${API_BASE}/auth/me`);
  return data.data;
}

// Tasks
export async function fetchTasks() {
  const data = await request(`${API_BASE}/tasks`);
  return data.data;
}

export async function createTask(task) {
  const data = await request(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  return data.data;
}

export async function updateTask(id, updates) {
  const data = await request(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return data.data;
}

export async function deleteTask(id) {
  const data = await request(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
  return data;
}
