# WaterLog (Fluid Tracker)

Track daily fluid intake with a simple Next.js app. Uses Better Auth for email/password authentication and MySQL for persistence.

## Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Install and Run](#install-and-run)
- [Database](#database)
  - [Create Schema](#create-schema)
  - [Tables Overview](#tables-overview)
- [Authentication](#authentication)
  - [How It Works](#how-it-works)
  - [Creating an Account](#creating-an-account)
  - [Logging In and Out](#logging-in-and-out)
- [Key Files](#key-files)
- [License](#license)

## Overview

- App routes and UI live under `src/app`.
- Auth backed by Better Auth with a MySQL connection and numeric IDs.
- Dashboard is protected; unauthenticated users are redirected to login.

## Tech Stack

- Next.js 15, React 19
- Better Auth
- MySQL (mysql2)
- Vanilla CSS for simple styling

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8 (or compatible)

### Environment Variables

Create a `.env.local` file in the project root:

```bash
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_password
DB_SCHEMA=fluidtracker
```

### Install and Run

```bash
npm install
# Initialize database schema (MySQL must be running)
mysql -u "$DB_USER" -p"$DB_PASS" -h "${DB_HOST:-localhost}" < "src/app/scripts/createdb.sql"

# Start the dev server
npm run dev
```

Open http://localhost:3000.

## Database

### Create Schema

The SQL to create all tables and seed minimal test data (non-auth) is in:

- [`src/app/scripts/createdb.sql`](src/app/scripts/createdb.sql)

Run it with:

```bash
mysql -u "$DB_USER" -p"$DB_PASS" -h "${DB_HOST:-localhost}" < "src/app/scripts/createdb.sql"
```

### Tables Overview

- user
  - Profile only: id INT AUTO_INCREMENT, email UNIQUE, name, emailVerified, timestamps.
  - No password fields; Better Auth stores credentials in account.
- account
  - One row per auth provider per user (email/password lives here).
  - Columns: id, userId (FK user.id), providerId, accountId, password (hash), tokens/timestamps.
- session
  - Active sessions created by Better Auth (id INT AUTO_INCREMENT, userId, token, expiresAt, metadata).
- verification
  - Tokens for flows like email verification or password reset.
- patients, relationships, fluidTargets
  - Domain tables used by the app for patient and target management.

See full definitions in [`src/app/scripts/createdb.sql`](src/app/scripts/createdb.sql).

## Authentication

### How It Works

- Config: [`src/app/lib/auth.ts`](src/app/lib/auth.ts)
  - Uses a MySQL pool and numeric IDs (`advanced.database.useNumberId = true`).
- Route handler: [`src/app/api/auth/[...all]/route.ts`](src/app/api/auth/%5B...all%5D/route.ts)
- Server actions: [`src/app/actions/auth.ts`](src/app/actions/auth.ts)
  - `signUpAction`: validates inputs, calls Better Auth `signUpEmail`, returns success or error.
  - `signInAction`: calls `signInEmail`, returns success or error.
  - `signOutAction`: calls `signOut` and redirects to `/login`.
- Forms (client components) use `useActionState` to display inline errors and navigate on success:
  - Register: [`src/app/(auth)/register/RegisterForm.js`](<src/app/(auth)/register/RegisterForm.js>)
  - Login: [`src/app/(auth)/login/LoginForm.js`](<src/app/(auth)/login/LoginForm.js>)

Better Auth creates:

- user row (profile only)
- account row with the password hash (providerId='email', accountId=email)
- session row on successful sign-in

### Creating an Account

- Visit `/register`, submit email, name, and password.
- On success, you’ll be navigated to `/login`.
- After login, you’ll be taken to the dashboard `/`.

### Logging In and Out

- Visit `/login` with your credentials.
- Logout link is in the sidebar; it posts to `signOutAction`.

## Key Files

- Auth
  - [`src/app/lib/auth.ts`](src/app/lib/auth.ts)
  - [`src/app/api/auth/[...all]/route.ts`](src/app/api/auth/%5B...all%5D/route.ts)
  - [`src/app/actions/auth.ts`](src/app/actions/auth.ts)
  - Forms: [`login`](<src/app/(auth)/login/LoginForm.js>), [`register`](<src/app/(auth)/register/RegisterForm.js>)
- UI shell
  - [`src/app/layout.js`](src/app/layout.js)
  - [`src/app/components/Layout.js`](src/app/components/Layout.js)
  - [`src/app/components/Sidebar.js`](src/app/components/Sidebar.js)
- Dashboard
  - [`src/app/(dashboard)/page.js`](<src/app/(dashboard)/page.js>)
  - [`src/app/(dashboard)/DashboardClient.js`](<src/app/(dashboard)/DashboardClient.js>)
- Schema
  - [`src/app/scripts/createdb.sql`](src/app/scripts/createdb.sql)

## License

MIT © 2025
