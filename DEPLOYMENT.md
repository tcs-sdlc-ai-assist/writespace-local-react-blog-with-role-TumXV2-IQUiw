# Deployment Guide

This document covers how to deploy the WriteSpace Blog application to production using Vercel, including SPA configuration, build setup, and CI/CD automation.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build for Production](#build-for-production)
- [Vercel Deployment](#vercel-deployment)
  - [Option 1: Deploy via Vercel CLI](#option-1-deploy-via-vercel-cli)
  - [Option 2: Deploy via Git Integration](#option-2-deploy-via-git-integration)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Environment Setup](#environment-setup)
- [CI/CD Auto-Deploy on Push](#cicd-auto-deploy-on-push)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have the following:

- **Node.js 18+** and **npm** installed locally
- A **Vercel account** — sign up at [vercel.com](https://vercel.com)
- **Vercel CLI** (optional, for command-line deployments):
  ```bash
  npm install -g vercel
  ```
- The project repository cloned and dependencies installed:
  ```bash
  git clone <repository-url>
  cd writespace-blog
  npm install
  ```

---

## Build for Production

WriteSpace uses **Vite 5** as its build tool. To generate a production-ready bundle:

```bash
npm run build
```

This outputs optimized static files to the `dist/` directory:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
```

To preview the production build locally before deploying:

```bash
npm run preview
```

The preview server runs at `http://localhost:4173` by default.

---

## Vercel Deployment

### Option 1: Deploy via Vercel CLI

1. **Login to Vercel:**

   ```bash
   vercel login
   ```

2. **Deploy from the project root:**

   ```bash
   vercel
   ```

   The CLI will prompt you to configure the project on first deploy:

   | Prompt | Value |
   |---|---|
   | Set up and deploy? | `Y` |
   | Which scope? | Select your Vercel account or team |
   | Link to existing project? | `N` (for first deploy) |
   | Project name | `writespace-blog` (or your preferred name) |
   | Directory with source code | `./` |
   | Override build settings? | `N` |

   Vercel automatically detects the Vite framework and applies the correct settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Deploy to production:**

   ```bash
   vercel --prod
   ```

   This publishes the app to your production domain (e.g., `writespace-blog.vercel.app`).

### Option 2: Deploy via Git Integration

1. **Push your code** to a Git provider (GitHub, GitLab, or Bitbucket).

2. **Import the project on Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Vercel auto-detects the Vite framework

3. **Confirm the build settings:**

   | Setting | Value |
   |---|---|
   | Framework Preset | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

4. **Click Deploy.** Vercel builds and publishes the app automatically.

---

## SPA Rewrite Configuration

WriteSpace is a single-page application using React Router DOM for client-side routing. All routes (e.g., `/blogs`, `/admin`, `/write`) must resolve to `index.html` so React Router can handle them.

The project includes a `vercel.json` file at the repository root that configures this:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### How It Works

- Any request to a path like `/blogs/p_123456` is rewritten to serve `/index.html`.
- Once the HTML loads, React Router reads the URL and renders the correct page component.
- Without this rewrite, refreshing or directly navigating to a non-root route would return a 404 error.

### Route Map Reference

| Path | Component | Access |
|---|---|---|
| `/` | LandingPage | Public |
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/blogs` | Home | Authenticated |
| `/blogs/:id` | ReadBlog | Authenticated |
| `/write` | WriteBlog | Authenticated |
| `/edit/:id` | WriteBlog | Authenticated |
| `/admin` | AdminDashboard | Admin only |
| `/admin/users` | UserManagement | Admin only |
| `/users` | UserManagement | Admin only |

All unmatched routes redirect to `/` via the catch-all `<Navigate to="/" replace />` in `App.jsx`.

> **Note:** The `vercel.json` file is automatically picked up by Vercel during deployment. No additional configuration is needed.

---

## Environment Setup

WriteSpace is a fully client-side application with **no environment variables required**. All data is persisted in the browser's `localStorage` under the following keys:

| Key | Description |
|---|---|
| `writespace_users` | Array of registered user objects |
| `writespace_posts` | Array of blog post objects |
| `writespace_session` | Current authenticated user session |

### Default Admin Account

A hardcoded admin account is available out of the box — no setup required:

- **Username:** `admin`
- **Password:** `admin123`

This account is defined in `src/utils/auth.js` and does not exist in `localStorage`. It cannot be deleted through the UI.

### Node.js Version

If you need to pin the Node.js version on Vercel, add an `engines` field to `package.json`:

```json
{
  "engines": {
    "node": "18.x"
  }
}
```

Alternatively, set the Node.js version in your Vercel project settings under **Settings → General → Node.js Version**.

---

## CI/CD Auto-Deploy on Push

When using Vercel's Git integration, deployments are triggered automatically on every push:

### Production Deploys

- Pushes to the **main** branch (or your configured production branch) trigger a **production deployment**.
- The app is published to your production domain (e.g., `writespace-blog.vercel.app`).

### Preview Deploys

- Pushes to **any other branch** or **pull requests** trigger a **preview deployment**.
- Each preview deploy gets a unique URL (e.g., `writespace-blog-abc123.vercel.app`).
- Preview URLs are automatically posted as comments on pull requests (GitHub/GitLab).

### Configuring the Production Branch

By default, Vercel uses `main` as the production branch. To change this:

1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Settings → Git**
3. Update the **Production Branch** field

### Skipping Deployments

To skip a deployment for a specific commit, include `[skip ci]` or `[vercel skip]` in your commit message:

```bash
git commit -m "Update README [skip ci]"
```

### Build Caching

Vercel caches `node_modules` between deployments to speed up builds. If you encounter stale dependency issues, you can force a clean build:

1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Settings → General**
3. Scroll to **Build & Development Settings**
4. Override the install command with: `npm ci`

This ensures a clean install from `package-lock.json` on every deploy.

---

## Troubleshooting

### 404 on Page Refresh

**Cause:** The SPA rewrite is not applied, so the server returns a 404 for client-side routes.

**Fix:** Ensure `vercel.json` exists at the repository root with the rewrite rule:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Blank Page After Deploy

**Cause:** The build output directory is misconfigured.

**Fix:** Verify that the output directory in Vercel is set to `dist` (the default Vite output directory). Check your Vercel project settings under **Settings → General → Build & Development Settings**.

### Styles Missing in Production

**Cause:** Tailwind CSS purged classes that are used dynamically.

**Fix:** Ensure `tailwind.config.js` includes all source files in the `content` array:

```js
content: [
  "./index.html",
  "./src/**/*.{js,jsx}",
]
```

### localStorage Data Not Persisting

**Cause:** This is expected behavior — `localStorage` is browser-specific and per-domain. Data created on `localhost:5173` will not appear on your Vercel deployment, and vice versa.

**Note:** Each user's browser maintains its own independent data store. There is no shared backend database.

### Build Failures

Run the build locally to catch errors before deploying:

```bash
npm run build
```

Common issues:
- **Import errors:** Ensure all file paths use the correct `.jsx` extension for files containing JSX syntax.
- **Missing dependencies:** Run `npm install` to ensure all packages are present.
- **Node.js version mismatch:** Verify your local Node.js version matches the version configured on Vercel (18+).