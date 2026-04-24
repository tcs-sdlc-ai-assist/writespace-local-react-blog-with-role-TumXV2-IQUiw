import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth.js';
import Avatar from './Avatar.jsx';

export default function PublicNavbar() {
  const session = getSession();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">
          WriteSpace
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <button
                onClick={() => navigate('/blogs')}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Dashboard
              </button>
              <Avatar role={session.role} />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}