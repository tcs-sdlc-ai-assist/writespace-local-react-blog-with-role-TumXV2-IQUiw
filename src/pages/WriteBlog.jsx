import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';
import Navbar from '../components/Navbar.jsx';

const TITLE_MAX_LENGTH = 150;
const BODY_MAX_LENGTH = 5000;

export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const allPosts = getPosts();
    const post = allPosts.find((p) => p.id === id);

    if (!post) {
      setNotFound(true);
      return;
    }

    if (session.role !== 'admin' && session.userId !== post.authorId) {
      navigate('/blogs', { replace: true });
      return;
    }

    setTitle(post.title || '');
    setBody(post.body || '');
  }, [id, isEditMode, session, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      setError('Title and content are required');
      return;
    }

    if (trimmedTitle.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setError(`Title must be ${TITLE_MAX_LENGTH} characters or less`);
      return;
    }

    if (trimmedBody.length < 10) {
      setError('Content must be at least 10 characters');
      return;
    }

    if (trimmedBody.length > BODY_MAX_LENGTH) {
      setError(`Content must be ${BODY_MAX_LENGTH} characters or less`);
      return;
    }

    setLoading(true);

    const allPosts = getPosts();

    if (isEditMode) {
      const postIndex = allPosts.findIndex((p) => p.id === id);

      if (postIndex === -1) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      const existingPost = allPosts[postIndex];

      if (session.role !== 'admin' && session.userId !== existingPost.authorId) {
        setError('You do not have permission to edit this post');
        setLoading(false);
        return;
      }

      const updatedPost = {
        ...existingPost,
        title: trimmedTitle,
        body: trimmedBody,
        updatedAt: Date.now(),
      };

      const updatedPosts = [...allPosts];
      updatedPosts[postIndex] = updatedPost;
      savePosts(updatedPosts);

      navigate(`/blogs/${id}`, { replace: true });
    } else {
      const newPost = {
        id: 'p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
        title: trimmedTitle,
        body: trimmedBody,
        authorId: session.userId,
        authorName: session.displayName,
        authorRole: session.role,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      savePosts([...allPosts, newPost]);

      navigate(`/blogs/${newPost.id}`, { replace: true });
    }
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
              The post you're trying to edit doesn't exist or has been removed.
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isEditMode ? 'Edit Post' : 'Write a New Post'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <span
                  className={`text-xs ${
                    title.trim().length > TITLE_MAX_LENGTH
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}
                >
                  {title.trim().length}/{TITLE_MAX_LENGTH}
                </span>
              </div>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <span
                  className={`text-xs ${
                    body.trim().length > BODY_MAX_LENGTH
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}
                >
                  {body.trim().length}/{BODY_MAX_LENGTH}
                </span>
              </div>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your post content here…"
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                to="/blogs"
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isEditMode
                    ? 'Saving…'
                    : 'Publishing…'
                  : isEditMode
                  ? 'Save Changes'
                  : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}