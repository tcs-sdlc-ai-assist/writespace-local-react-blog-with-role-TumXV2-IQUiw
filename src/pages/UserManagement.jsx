import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, saveUsers } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';
import Navbar from '../components/Navbar.jsx';
import UserRow from '../components/UserRow.jsx';

export default function UserManagement() {
  const session = getSession();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session || session.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }

    const allUsers = getUsers();
    setUsers(allUsers);
  }, [session, navigate]);

  if (!session || session.role !== 'admin') {
    return null;
  }

  function refreshUsers() {
    const allUsers = getUsers();
    setUsers(allUsers);
  }

  function handleCreateUser(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required');
      return;
    }

    if (trimmedDisplayName.length < 2) {
      setError('Display name must be at least 2 characters');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (trimmedUsername.toLowerCase() === 'admin') {
      setError('Username reserved');
      return;
    }

    const allUsers = getUsers();
    if (allUsers.some((u) => u.username.toLowerCase() === trimmedUsername.toLowerCase())) {
      setError('Username already exists');
      return;
    }

    setLoading(true);

    const newUser = {
      id: 'u_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role,
      createdAt: Date.now(),
    };

    saveUsers([...allUsers, newUser]);

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setLoading(false);
    setSuccess(`User "${newUser.displayName}" created successfully`);

    refreshUsers();
  }

  function handleDeleteUser(userId) {
    const allUsers = getUsers();
    const updated = allUsers.filter((u) => u.id !== userId);
    saveUsers(updated);
    refreshUsers();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage user accounts for your WriteSpace platform.
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Create New User</h2>

          <form onSubmit={handleCreateUser} className="space-y-5">
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </div>

        {/* User List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              All Users
            </h2>
            <span className="text-sm text-gray-500">
              {users.length + 1} user{users.length + 1 === 1 ? '' : 's'} total
            </span>
          </div>

          <div className="space-y-3">
            {/* Admin user (hardcoded) */}
            <UserRow
              user={{
                id: 'u_admin',
                displayName: 'Administrator',
                username: 'admin',
                role: 'admin',
                createdAt: null,
              }}
              onDelete={handleDeleteUser}
            />

            {users.length > 0 ? (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteUser}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-lg font-semibold text-gray-700">No registered users yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create a user account using the form above.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}