import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';
import Navbar from '../components/Navbar.jsx';
import Avatar from '../components/Avatar.jsx';

export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    const allPosts = getPosts();
    const found = allPosts.find((p) => p.id === id);
    if (found) {
      setPost(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  const canEdit =
    session &&
    post &&
    (session.role === 'admin' || session.userId === post.authorId);

  const formattedDate = post && post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  function handleDeleteClick() {
    if (confirmingDelete) {
      const allPosts = getPosts();
      const updated = allPosts.filter((p) => p.id !== post.id);
      savePosts(updated);
      navigate('/blogs', { replace: true });
    } else {
      setConfirmingDelete(true);
    }
  }

  function handleCancelDelete() {
    setConfirmingDelete(false);
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700">Post not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-block mt-4 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Back to Posts
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <p className="text-sm text-gray-500">Loading…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <Link
            to="/blogs"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            ← Back to Posts
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
            {canEdit && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/edit/${post.id}`}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors"
                >
                  Edit
                </Link>
                {confirmingDelete && (
                  <button
                    onClick={handleCancelDelete}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
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
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Avatar role={post.authorRole || 'user'} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                {post.authorName || 'Unknown'}
              </span>
              {formattedDate && (
                <span className="text-xs text-gray-400">{formattedDate}</span>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {post.body}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}