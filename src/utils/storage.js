const KEYS = {
  USERS: 'writespace_users',
  POSTS: 'writespace_posts',
  SESSION: 'writespace_session',
};

function readFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (e) {
    console.warn(`Failed to read "${key}" from localStorage:`, e);
    return fallback;
  }
}

function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to write "${key}" to localStorage:`, e);
  }
}

function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Failed to remove "${key}" from localStorage:`, e);
  }
}

export function getUsers() {
  const users = readFromStorage(KEYS.USERS, []);
  if (!Array.isArray(users)) return [];
  return users;
}

export function saveUsers(users) {
  if (!Array.isArray(users)) return;
  writeToStorage(KEYS.USERS, users);
}

export function getPosts() {
  const posts = readFromStorage(KEYS.POSTS, []);
  if (!Array.isArray(posts)) return [];
  return posts;
}

export function savePosts(posts) {
  if (!Array.isArray(posts)) return;
  writeToStorage(KEYS.POSTS, posts);
}

export function getSession() {
  const session = readFromStorage(KEYS.SESSION, null);
  if (session && typeof session === 'object' && session.userId && session.username && session.role) {
    return session;
  }
  return null;
}

export function saveSession(session) {
  if (!session || typeof session !== 'object') return;
  writeToStorage(KEYS.SESSION, session);
}

export function clearSession() {
  removeFromStorage(KEYS.SESSION);
}