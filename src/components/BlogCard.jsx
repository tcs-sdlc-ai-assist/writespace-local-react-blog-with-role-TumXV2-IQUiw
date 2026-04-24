import React from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth.js';
import Avatar from './Avatar.jsx';

const ACCENT_COLORS = [
  'border-indigo-500',
  'border-violet-500',
  'border-pink-500',
  'border-blue-500',
  'border-teal-500',
  'border-amber-500',
];

export default function BlogCard({ post, index = 0 }) {
  const session = getSession();
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  const excerpt =
    post.body && post.body.length > 120
      ? post.body.substring(0, 120) + '…'
      : post.body || '';

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div
      className={`bg-white rounded-lg border-l-4 ${accentColor} shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/blogs/${post.id}`}
            className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {post.title}
          </Link>
          {canEdit && (
            <Link
              to={`/edit/${post.id}`}
              className="flex-shrink-0 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Edit post"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">{excerpt}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar role={post.authorRole || 'user'} />
          <span className="text-sm font-medium text-gray-700">
            {post.authorName || 'Unknown'}
          </span>
        </div>
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>
    </div>
  );
}