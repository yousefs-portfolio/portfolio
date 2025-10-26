<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Three.js-r170-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
</div>

<div align="center">
  <h1>🚀 Portfolio | Yousef Baitalmal</h1>
  <p><strong>Engineering from First Principles</strong></p>
  <p>A production-grade portfolio and admin platform combining immersive 3D storytelling, multilingual content, and clean architecture.</p>
</div>

<div align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a>
</div>

---

## ✨ Features

### 🎨 Immersive 3D Storytelling

- Scroll-driven Three.js narrative highlighting language → framework → experience.
- Arabic letter particle field and voxel terrain animated with GSAP.
- Responsive canvas with graceful degradation for low-powered devices.

### 🧱 Layered Content Architecture

- App Router + Server Components with thin controllers over shared use-cases.
- Keystatic-backed admin for projects, services, blog posts, and translations.
- REST endpoints ready for integrations (`/api/projects`, `/api/blog`, `/api/contact`, ...).

### 🌍 Full Internationalization
- English ↔ Arabic toggle with persistent preference and auto-detection.
- RTL-aware typography helpers (`font-comfortaa`, `font-almarai`).
- Bilingual Markdoc content surfaced through shared use-case logic.

### 🔐 Production-Ready Platform
- NextAuth admin auth with enforced password rotation.
- Cloud Run + Cloud SQL Postgres deployment path, including `/api/db/health` probe.
- Strict TypeScript, ESLint, Vitest, and Playwright-ready scaffolding.

### 🪪 Clean Architecture Enforcement

- `core/` hosts domain entities, interfaces, and use-cases (framework-free).
- `adapters/` implements infrastructure (Drizzle/Postgres, Keystatic, auth).
- Routes/controllers validate inputs and map results between layers.

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **3D Graphics**: [Three.js r170](https://threejs.org/)
- **Animations**: [GSAP 3.12](https://greensock.com/gsap/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: Cloud SQL Postgres (primary) with SQLite fallback for local development
- **API**: RESTful endpoints via Next.js route handlers

### **Developer Experience**

- **Build Tool**: [Turbopack](https://turbo.build/pack)
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint with Next.js config
- **Version Control**: Git with conventional commits

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17 or higher
- npm, yarn, or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yousefs-portfolio/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Local SQLite (default)
   npm run db:push
   ```
   > To target Postgres instead, set `DATABASE_URL=postgres://...` (or individual Cloud SQL env vars) before running the
   command.

4. **Seed the database**
   ```bash
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

### Development Commands

| Command               | Description                                    |
|-----------------------|------------------------------------------------|
| `npm run dev`         | Start development server with Turbopack        |
| `npm run build`       | Build for production                           |
| `npm start`           | Start production server                        |
| `npm run lint`        | Run ESLint                                     |
| `npm run typecheck`   | Run TypeScript in strict no-emit mode          |
| `npm run test`        | Execute unit tests with Vitest                 |
| `npm run format`      | Check formatting with Prettier                 |
| `npm run format:fix`  | Format all files with Prettier                 |
| `npm run e2e`         | Execute Playwright test suite                  |
| `npm run ci`          | Run linting, type-checking, and unit tests     |
| `npm run db:push`     | Apply Drizzle schema changes (push migrations) |
| `npm run db:generate` | Generate SQL migrations from schema            |
| `npm run db:studio`   | Explore the database with Drizzle Studio       |
| `npm run db:seed`     | Seed SQLite with demo content                  |

---

## 🏛️ Architecture

### Project Structure

```
portfolio/
├── app/                           # Next.js App Router (UI + HTTP controllers only)
│   ├── api/                      # Route handlers call use-cases
│   └── (public routes)/          # Pages/components consuming API responses
├── adapters/                     # Framework & I/O implementations (outer layer)
│   ├── auth/nextauth.ts          # NextAuth wiring via use-cases
│   ├── content/keystatic/        # Keystatic-backed content readers
│   └── db/drizzle/               # Drizzle repositories + transaction adapter
├── core/                         # Clean Architecture center (pure TypeScript)
│   ├── domain/                   # Entities/value objects
│   ├── interfaces/               # Ports consumed by use-cases
│   ├── use-cases/                # Application services / orchestration
│   └── lib/                      # Cross-cutting pure helpers (errors, etc.)
├── config/                       # Environment parsing and runtime settings
├── keystatic/
│   ├── keystatic.config.ts       # Keystatic configuration
│   └── content/                  # Markdown/Markdoc content managed by Keystatic
├── drizzle/                      # Schema definitions and migrations
├── tests/
│   └── unit/                     # Use-case unit tests (Vitest)
├── public/                       # Static assets
└── package.json                  # Scripts and dependencies

```

**Dependency rule:** `app` → `adapters` → `core/interfaces` → `core/use-cases` → `core/domain`. The flow always points inward, keeping framework and persistence concerns at the boundary.

#### Adding a new use-case
1. Model the behaviour in `core/domain` (entities/value objects) if new types are needed.
2. Define/extend the required ports in `core/interfaces`.
3. Implement the orchestration in `core/use-cases/<feature>.ts` returning plain data.
4. Provide an adapter in `adapters/*` that satisfies the new port (Drizzle, Keystatic, etc.).
5. Call the use-case from an API route or server action in `app/`, validating inputs with Zod.
6. Add targeted unit tests under `tests/unit/use-cases`.

### Database Schema

```ts
import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const contacts = sqliteTable('contacts', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email'),
  whatsapp: text('whatsapp'),
  requirements: text('requirements').notNull(),
  createdAt: text('createdAt')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  username: text('username').notNull(),
  email: text('email'),
  name: text('name'),
  passwordHash: text('passwordHash').notNull(),
  passwordSalt: text('passwordSalt').notNull(),
  mustChangePassword: integer('mustChangePassword', { mode: 'boolean' })
    .notNull()
    .default(true),
  isAdmin: integer('isAdmin', { mode: 'boolean' }).notNull().default(false),
});
```

---

## 🔌 API Endpoints

### Projects
- `GET /api/projects` - List all projects sourced via Keystatic

### Blog Posts
- `GET /api/blog` - List published posts with optional `featured`, `limit`, and `tag` filters
- `GET /api/blog/[slug]` - Fetch post by slug with Markdown payload
- `GET /api/blog/tags` - List unique tags

### Services
- `GET /api/services` - List services sourced via Keystatic

### Contacts
- `GET /api/contact` - List contact submissions (admin view)
- `POST /api/contact` - Submit contact form (requires email or WhatsApp)

### Admin
- `POST /api/admin/change-password` - Update admin password (requires authenticated admin session)

---

## 🌍 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables if needed
   - Deploy!

### Environment Variables

Create a `.env.local` file for local development:

```env
# Database
DATABASE_URL="file:./drizzle/dev.db"

# Admin (for production)
ADMIN_PASSWORD="your-secure-password"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Production Database

For production, consider using:
- **PostgreSQL** (Recommended)
- **MySQL**
- **PlanetScale**
- **Supabase**

Update your `DATABASE_URL` accordingly:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

---

## 🔮 Future Enhancements

### Phase 1: Content Management
- [ ] Integrate Contentful/Sanity.io for blog management
- [ ] Add markdown editor for admin dashboard
- [ ] Implement draft/preview functionality

### Phase 2: Enhanced Interactivity
- [ ] Add WebGL post-processing effects
- [ ] Implement page transitions with Framer Motion
- [ ] Create interactive project showcases

### Phase 3: Performance & SEO
- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Add structured data for SEO
- [ ] Optimize Core Web Vitals

### Phase 4: Features
- [ ] Add newsletter subscription
- [ ] Implement comment system for blog
- [ ] Create RSS feed
- [ ] Add dark/light theme toggle

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---



