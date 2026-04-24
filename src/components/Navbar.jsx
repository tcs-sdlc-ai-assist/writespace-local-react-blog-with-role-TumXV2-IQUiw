import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getSession } from '../utils/auth.js';
import { logout } from '../utils/auth.js';
import Avatar from './Avatar.jsx';

export default function Navbar() {
  const session = getSession();
  const navigate = useNavigate();
  const location = useLocation();

  if (!session) return null;

  const isActive = (path) => location.pathname === path;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const linkClass = (path) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive(path)
        ? 'text-indigo-600 bg-indigo-50'
        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/blogs" className="text-xl font-bold text-indigo-600 tracking-tight">
            WriteSpace
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/blogs" className={linkClass('/blogs')}>
              Blogs
            </Link>
            <Link to="/write" className={linkClass('/write')}>
              Write
            </Link>
            {session.role === 'admin' && (
              <Link to="/admin/users" className={linkClass('/admin/users')}>
                Users
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar role={session.role} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 leading-tight">
                {session.displayName}
              </span>
              <span className="text-xs text-gray-400 leading-tight capitalize">
                {session.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}