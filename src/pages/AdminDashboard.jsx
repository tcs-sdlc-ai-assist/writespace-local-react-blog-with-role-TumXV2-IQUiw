import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, getUsers } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import BlogCard from '../components/BlogCard.jsx';

export default function AdminDashboard() {
  const session = getSession();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!session || session.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }

    const allPosts = getPosts();
    const sorted = [...allPosts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setPosts(sorted);

    const allUsers = getUsers();
    setUsers(allUsers);
  }, [session, navigate]);

  if (!session || session.role !== 'admin') {
    return null;
  }

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for the hardcoded admin
  const adminPosts = posts.filter((p) => p.authorRole === 'admin').length;
  const userPosts = posts.filter((p) => p.authorRole !== 'admin').length;

  const recentPosts = posts.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your WriteSpace platform.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Posts" value={totalPosts} icon="📝" />
          <StatCard label="Total Users" value={totalUsers} icon="👥" />
          <StatCard label="Admin Posts" value={adminPosts} icon="👑" />
          <StatCard label="User Posts" value={userPosts} icon="📖" />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/write"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Write a Post
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
            >
              Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Posts</h2>
            {posts.length > 6 && (
              <Link
                to="/blogs"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                View All →
              </Link>
            )}
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post, index) => (
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
        </div>
      </main>
    </div>
  );
}