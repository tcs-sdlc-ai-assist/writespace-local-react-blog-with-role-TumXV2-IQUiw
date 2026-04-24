# WriteSpace Blog

A clean, minimal blogging platform built with React and Vite. WriteSpace lets users create, read, edit, and delete blog posts — all powered by localStorage with no backend required.

## Tech Stack

- **React 18** — UI library
- **React Router DOM 6** — Client-side routing
- **Tailwind CSS 3** — Utility-first styling
- **Vite 5** — Build tool and dev server
- **localStorage** — Client-side data persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace-blog

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Folder Structure

```
writespace-blog/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── src/
│   ├── main.jsx                  # App entry point
│   ├── App.jsx                   # Root component with route definitions
│   ├── index.css                 # Tailwind CSS imports
│   ├── components/
│   │   ├── Avatar.jsx            # User avatar component (role-based)
│   │   ├── BlogCard.jsx          # Blog post card for list views
│   │   ├── Navbar.jsx            # Authenticated navigation bar
│   │   ├── ProtectedRoute.jsx    # Route guard for auth and admin access
│   │   ├── PublicNavbar.jsx      # Public-facing navigation bar
│   │   ├── StatCard.jsx          # Dashboard statistic card
│   │   └── UserRow.jsx           # User list row with delete action
│   ├── pages/
│   │   ├── AdminDashboard.jsx    # Admin overview with stats and recent posts
│   │   ├── Home.jsx              # Blog listing page
│   │   ├── LandingPage.jsx       # Public landing page with hero and features
│   │   ├── LoginPage.jsx         # User login form
│   │   ├── ReadBlog.jsx          # Single blog post view
│   │   ├── RegisterPage.jsx      # User registration form
│   │   ├── UserManagement.jsx    # Admin user CRUD interface
│   │   └── WriteBlog.jsx         # Create and edit blog post form
│   └── utils/
│       ├── auth.js               # Authentication logic (login, register, logout)
│       └── storage.js            # localStorage read/write helpers
```

## Route Map

| Path            | Component        | Access       | Description                     |
|-----------------|------------------|--------------|---------------------------------|
| `/`             | LandingPage      | Public       | Landing page with hero section  |
| `/login`        | LoginPage        | Public       | User sign-in form               |
| `/register`     | RegisterPage     | Public       | User registration form          |
| `/blogs`        | Home             | Authenticated | All blog posts listing         |
| `/blogs/:id`    | ReadBlog         | Authenticated | Single blog post view          |
| `/write`        | WriteBlog        | Authenticated | Create a new blog post         |
| `/edit/:id`     | WriteBlog        | Authenticated | Edit an existing blog post     |
| `/admin`        | AdminDashboard   | Admin only   | Admin dashboard with stats      |
| `/admin/users`  | UserManagement   | Admin only   | User management interface       |
| `/users`        | UserManagement   | Admin only   | User management (alias)         |

## localStorage Schema

All data is persisted in the browser's localStorage under the following keys:

### `writespace_users`

Array of user objects:

```json
[
  {
    "id": "u_1700000000000_abc1234",
    "displayName": "Jane Doe",
    "username": "janedoe",
    "password": "password123",
    "role": "user",
    "createdAt": 1700000000000
  }
]
```

### `writespace_posts`

Array of blog post objects:

```json
[
  {
    "id": "p_1700000000000_xyz5678",
    "title": "My First Post",
    "body": "Post content goes here...",
    "authorId": "u_1700000000000_abc1234",
    "authorName": "Jane Doe",
    "authorRole": "user",
    "createdAt": 1700000000000,
    "updatedAt": 1700000000000
  }
]
```

### `writespace_session`

Current authenticated user session:

```json
{
  "userId": "u_admin",
  "username": "admin",
  "displayName": "Administrator",
  "role": "admin"
}
```

## Default Admin Account

A hardcoded admin account is available out of the box:

- **Username:** `admin`
- **Password:** `admin123`

This account cannot be deleted through the UI.

## Usage Guide

1. **Register** a new account or **log in** with the default admin credentials.
2. **Write** blog posts using the "Write" link in the navigation bar.
3. **Read** posts by clicking on any blog card from the listing page.
4. **Edit** or **delete** your own posts (admins can edit or delete any post).
5. **Admin users** can manage accounts via the "Users" link in the navigation bar.

## Deployment

The project includes a `vercel.json` configuration for deployment on Vercel with SPA rewrites:

```bash
# Deploy to Vercel
npm run build
# Upload the dist/ folder or connect your repository to Vercel
```

All client-side routes are rewritten to `/index.html` to support React Router.

## License

Private