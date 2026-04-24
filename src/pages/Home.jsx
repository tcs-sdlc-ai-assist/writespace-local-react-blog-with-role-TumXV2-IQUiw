import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const session = getSession();

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Posts</h1>
            <p className="mt-1 text-sm text-gray-500">
              {posts.length > 0
                ? `${posts.length} post${posts.length === 1 ? '' : 's'} published`
                : 'No posts yet'}
            </p>
          </div>
          <Link
            to="/write"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Write a Post
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-3">✍️</div>
            <h3 className="text-lg font-semibold text-gray-700">No posts yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start sharing your thoughts with the community.
            </p>
            <Link
              to="/write"
              className="inline-block mt-4 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}