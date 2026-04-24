import { getUsers, saveUsers, getSession, saveSession, clearSession } from './storage.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_DISPLAY_NAME = 'Administrator';
const ADMIN_USER_ID = 'u_admin';

export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required' };
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return { success: false, error: 'Invalid input' };
  }

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  if (!trimmedUsername || !trimmedPassword) {
    return { success: false, error: 'Username and password are required' };
  }

  if (trimmedUsername === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
    const session = {
      userId: ADMIN_USER_ID,
      username: ADMIN_USERNAME,
      displayName: ADMIN_DISPLAY_NAME,
      role: 'admin',
    };
    saveSession(session);
    return { success: true, session };
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase() && u.password === trimmedPassword
  );

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
  saveSession(session);
  return { success: true, session };
}

export function register(displayName, username, password) {
  if (!displayName || !username || !password) {
    return { success: false, error: 'All fields are required' };
  }

  if (typeof displayName !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
    return { success: false, error: 'Invalid input' };
  }

  const trimmedDisplayName = displayName.trim();
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
    return { success: false, error: 'All fields are required' };
  }

  if (trimmedDisplayName.length < 2) {
    return { success: false, error: 'Display name must be at least 2 characters' };
  }

  if (trimmedUsername.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }

  if (trimmedPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  if (trimmedUsername.toLowerCase() === ADMIN_USERNAME) {
    return { success: false, error: 'Username reserved' };
  }

  const users = getUsers();
  if (users.some((u) => u.username.toLowerCase() === trimmedUsername.toLowerCase())) {
    return { success: false, error: 'Username already exists' };
  }

  const user = {
    id: 'u_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
    displayName: trimmedDisplayName,
    username: trimmedUsername,
    password: trimmedPassword,
    role: 'user',
    createdAt: Date.now(),
  };

  saveUsers([...users, user]);

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
  saveSession(session);
  return { success: true, session };
}

export function logout() {
  clearSession();
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;

  if (session.userId === ADMIN_USER_ID) {
    return {
      id: ADMIN_USER_ID,
      displayName: ADMIN_DISPLAY_NAME,
      username: ADMIN_USERNAME,
      role: 'admin',
    };
  }

  const users = getUsers();
  const user = users.find((u) => u.id === session.userId);
  if (!user) {
    clearSession();
    return null;
  }

  return user;
}

export function isAdmin() {
  const session = getSession();
  if (!session) return false;
  return session.role === 'admin';
}