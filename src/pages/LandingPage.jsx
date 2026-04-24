import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';
import PublicNavbar from '../components/PublicNavbar.jsx';
import BlogCard from '../components/BlogCard.jsx';

export default function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const session = getSession();

  useEffect(() => {
    const posts = getPosts();
    const sorted = [...posts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setLatestPosts(sorted.slice(0, 3));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            WriteSpace
          </h1>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
            A clean, minimal space to share your thoughts, stories, and ideas with the world.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            {session ? (
              <Link
                to="/blogs"
                className="px-6 py-3 text-base font-medium text-indigo-600 bg-white rounded-md hover:bg-indigo-50 transition-colors shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 text-base font-medium text-indigo-600 bg-white rounded-md hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 text-base font-medium text-white border border-white rounded-md hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Why WriteSpace?</h2>
          <p className="mt-2 text-gray-500">Everything you need to start writing, right in your browser.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 text-2xl mx-auto mb-4">
              ✍️
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Simple Writing</h3>
            <p className="mt-2 text-sm text-gray-500">
              No distractions. Just open the editor and start writing your next great post.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-violet-50 text-violet-600 text-2xl mx-auto mb-4">
              🔒
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Role-Based Access</h3>
            <p className="mt-2 text-sm text-gray-500">
              Admins manage users and content. Writers focus on what they do best — writing.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-pink-50 text-pink-600 text-2xl mx-auto mb-4">
              💾
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Local Storage</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your data stays in your browser. No servers, no tracking, completely private.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Latest Posts</h2>
          <p className="mt-2 text-gray-500">See what the community has been writing about.</p>
        </div>
        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-700">No posts yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to share something with the community.
            </p>
            {!session && (
              <Link
                to="/register"
                className="inline-block mt-4 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create an Account
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-lg font-bold text-indigo-600 tracking-tight">
                WriteSpace
              </Link>
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  Register
                </Link>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}