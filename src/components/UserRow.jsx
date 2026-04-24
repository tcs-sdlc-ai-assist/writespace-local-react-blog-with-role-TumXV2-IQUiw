import React, { useState } from 'react';
import { getSession } from '../utils/auth.js';
import Avatar from './Avatar.jsx';

export default function UserRow({ user, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const session = getSession();

  const isAdmin = user.role === 'admin';
  const isSelf = session && session.userId === user.id;
  const canDelete = !isAdmin && !isSelf;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  function handleDeleteClick() {
    if (confirmingDelete) {
      onDelete(user.id);
      setConfirmingDelete(false);
    } else {
      setConfirmingDelete(true);
    }
  }

  function handleCancel() {
    setConfirmingDelete(false);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Avatar role={user.role} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">
              {user.displayName}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                user.role === 'admin'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {user.role}
            </span>
          </div>
          <span className="text-xs text-gray-500">@{user.username}</span>
          {formattedDate && (
            <span className="text-xs text-gray-400 mt-0.5">
              Joined {formattedDate}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {canDelete && confirmingDelete && (
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        {canDelete && (
          <button
            onClick={handleDeleteClick}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              confirmingDelete
                ? 'text-white bg-red-600 hover:bg-red-700'
                : 'text-red-600 border border-red-300 hover:bg-red-50'
            }`}
          >
            {confirmingDelete ? 'Confirm Delete' : 'Delete'}
          </button>
        )}
        {!canDelete && (
          <span className="text-xs text-gray-400 italic">
            {isAdmin ? 'Admin' : 'You'}
          </span>
        )}
      </div>
    </div>
  );
}