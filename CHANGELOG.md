# Changelog

All notable changes to the WriteSpace Blog project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2024-01-01

### Added

- **Public Landing Page** — Hero section with gradient background, feature highlights, and latest posts preview.
- **Authentication System** — Login and registration forms with client-side session management via localStorage.
- **Default Admin Account** — Hardcoded admin credentials (`admin` / `admin123`) available out of the box.
- **Blog CRUD Operations** — Full create, read, edit, and delete functionality for blog posts.
- **Blog Listing Page** — Grid layout displaying all published posts sorted by newest first.
- **Single Post View** — Dedicated read page with author info, date, and inline edit/delete controls.
- **Write/Edit Post Form** — Shared form component with character limits (150 for title, 5000 for body) and validation.
- **Admin Dashboard** — Overview page with stat cards for total posts, total users, admin posts, and user posts, plus quick actions and recent posts grid.
- **User Management** — Admin interface to create new user accounts with role selection and delete existing users with confirmation.
- **Role-Based Access Control** — Protected routes via `ProtectedRoute` component supporting both authenticated and admin-only access levels.
- **Navigation Components** — Separate `Navbar` for authenticated users and `PublicNavbar` for public pages, with active link highlighting.
- **Avatar Component** — Role-based avatar display (👑 for admin, 📖 for user).
- **localStorage Persistence** — All data (users, posts, sessions) stored under `writespace_users`, `writespace_posts`, and `writespace_session` keys with safe read/write helpers.
- **Responsive Design** — Tailwind CSS utility-first styling with responsive grid layouts across all pages.
- **Client-Side Routing** — React Router DOM v6 with catch-all redirect and SPA-compatible Vercel deployment configuration.
- **Vite Build Tooling** — Vite 5 development server and production build with React plugin support.