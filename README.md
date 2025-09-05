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
  <p>A cutting-edge portfolio showcasing systems engineering, creative coding, and full-stack development through an immersive 3D journey.</p>
</div>

<div align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#api">API</a> •
  <a href="#deployment">Deployment</a>
</div>

---

## ✨ Features

### 🎨 **Immersive 3D Experience**
- **WebGL Particle System**: Dynamic, interactive 3D background with thousands of particles
- **Scroll-Triggered Animations**: GSAP-powered animations that respond to user scrolling
- **Post-Processing Effects**: Advanced visual effects including bloom and depth of field
- **Responsive 3D Canvas**: Adapts seamlessly to all screen sizes

### 🏗️ **Modern Architecture**
- **Next.js 15 App Router**: Latest routing system with server components
- **Turbopack**: Lightning-fast builds and hot module replacement
- **Prisma ORM**: Type-safe database access with SQLite
- **RESTful API**: Full CRUD operations for dynamic content management

### 🌐 **Bilingual Support** (Coming Soon)
- **English/Arabic**: Full RTL support with seamless language switching
- **Dynamic Translations**: All content available in both languages
- **Locale-Based Routing**: SEO-friendly URLs for each language

### 📝 **Content Management**
- **Admin Dashboard**: Password-protected admin interface for content management
- **Dynamic Projects**: Showcase your work with database-driven project sections
- **Blog System**: Built-in blog with markdown support and metadata
- **Contact Form**: Integrated contact form with database storage

### 🎯 **Performance Optimized**
- **Code Splitting**: Automatic code splitting for optimal loading
- **Image Optimization**: Next.js Image component with lazy loading
- **CSS-in-JS**: Tailwind CSS for minimal runtime overhead
- **Database Caching**: Efficient query patterns with Prisma

---

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
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: SQLite (Development) / PostgreSQL (Production-ready)
- **API**: RESTful endpoints with Next.js API Routes

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
   npm run db:push
   ```

4. **Seed the database**
   ```bash
   node prisma/seed.js
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

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## 🏛️ Architecture

### Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── blog/         # Blog CRUD endpoints
│   │   ├── contacts/     # Contact form submissions
│   │   ├── projects/     # Project management
│   │   └── services/     # Services CRUD
│   ├── admin/            # Admin dashboard
│   ├── blog/             # Blog pages
│   ├── components/       # React components
│   │   ├── ContactForm.tsx
│   │   ├── Header.tsx
│   │   ├── ServicesModal.tsx
│   │   └── ThreeBackground.tsx
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.js          # Database seeder
│   └── dev.db           # SQLite database
├── public/              # Static assets
├── messages/           # i18n translations
│   ├── en.json        # English translations
│   └── ar.json        # Arabic translations
└── package.json       # Dependencies

```

### Database Schema

```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  description String?
  content     String?
  layer       String?
  layerName   String?
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BlogPost {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  excerpt   String?
  published Boolean  @default(false)
  featured  Boolean  @default(false)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Service {
  id          String   @id @default(cuid())
  title       String
  description String?
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String?
  isAdmin   Boolean    @default(false)
  posts     BlogPost[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

---

## 🔌 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Blog Posts
- `GET /api/blog` - List all published posts
- `GET /api/blog/:slug` - Get post by slug
- `POST /api/blog` - Create post (admin)
- `PUT /api/blog/:id` - Update post (admin)
- `DELETE /api/blog/:id` - Delete post (admin)

### Services
- `GET /api/services` - List all services
- `POST /api/services` - Create service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Contacts
- `GET /api/contacts` - List all contacts (admin)
- `POST /api/contacts` - Submit contact form
- `DELETE /api/contacts/:id` - Delete contact (admin)

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
DATABASE_URL="file:./dev.db"

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

**Yousef Baitalmal**  
[yousef.baitalmal.dev@email.com](mailto:yousef.baitalmal.dev@email.com)

Project Link: [https://github.com/yousefs-portfolio/portfolio](https://github.com/yousefs-portfolio/portfolio)

---

<div align="center">
  <p>Built with ❤️ using Next.js, Three.js, and modern web technologies</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
