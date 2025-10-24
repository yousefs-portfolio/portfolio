Here’s a copy-pasteable **Codex-style refactor prompt** for a **Next.js + Postgres + Keystatic** project, aiming for **Clean Architecture + SRP** while preserving behavior.

---

# 🧭 Refactor to Clean Architecture (Next.js + Postgres + Keystatic) — Codex Prompt

**Role:** You are an expert TypeScript/Next.js architect. Refactor the repo into **Clean Architecture** (ports & adapters) with minimal public API changes and all tests passing.

**Non-negotiables:**

* Preserve public routes, API behavior, and content URLs.
* Keep Next.js data fetching semantics intact (RSC/SSR/ISR/CSR).
* Postgres access only through ports; no raw SQL in UI.
* Keystatic treated as a content adapter; domain stays CMS-agnostic.
* Type-safe end-to-end (strict TS, Zod on boundaries), lint/format clean.

---

## 1) Inputs (fill before running)

* **Repo path:** `{{REPO_PATH}}`
* **Next.js version:** `{{NEXT_VERSION}}` (e.g., 14/15)
* **Router type:** `app` router (required)
* **DB lib:** `{{DB_LIB}}` (e.g., Prisma/Drizzle/node-postgres)
* **Keystatic setup path:** `{{KEYSTATIC_DIR}}` (e.g., `/keystatic`)
* **Primary routes/pages:** `{{ROUTE_LIST}}`
* **Key operations to extract (use cases):** `{{OPERATIONS}}` (e.g., “publishPost”, “listProducts”)
* **Package manager:** `{{PKG}}` (pnpm/npm/yarn)
* **Test commands:** `{{TEST_CMD_UNIT}}`, `{{TEST_CMD_E2E}}` (e.g., `vitest`, `playwright`)
* **CI command:** `{{CI_CMD}}`

---

## 2) Target architecture & layout

```
{{REPO_PATH}}/
  app/                         # Next.js app router (UI+controllers only)
    (public-routes)/...
    api/                       # thin controllers calling use-cases
  components/                  # presentational (no business logic)
  styles/
  public/

  core/                        # Clean Architecture center (no Next.js here)
    domain/                    # entities, value objects, domain services (pure TS)
      post.ts
      user.ts
    use-cases/                 # application services / orchestrators
      publish-post.ts
      list-posts.ts
    interfaces/                # ports (interfaces) consumed by use-cases
      repositories.ts
      content.ts
      tx.ts                    # transaction boundary port
    lib/                       # cross-cutting pure utils (e.g., slugify, dates)

  adapters/                    # frameworks & I/O implementations
    db/
      prisma/                  # or drizzle/pg
        client.ts
        post.repository.ts     # implements ports.repositories
        transaction.ts         # implements tx port
    content/
      keystatic/               # implements ports.content
        client.ts
        post.content.ts
    cache/
      vercel-kv.ts             # optional caching adapter
    auth/
      nextauth.ts              # optional auth adapter (ports if needed)

  config/
    env.ts                     # zod-validated env
    settings.ts

  tests/
    unit/
    integration/
    e2e/

  keystatic/                   # existing keystatic config/content (left intact)
    keystatic.config.ts
    content/

  prisma/ | drizzle/           # schema/migrations if applicable
  package.json
  tsconfig.json
  next.config.js
  playwright.config.ts (opt)
  vitest.config.ts (opt)
  .eslintrc.cjs
  .prettierrc
```

**Dependency rule:**
`adapters → interfaces → use-cases → domain` (only point inward).
The `app/` layer is a **controller** that calls `use-cases` and maps inputs/outputs.

---

## 3) Refactor game plan

1. **Safety net**

   * Detect existing tests; if missing around `{{OPERATIONS}}`, add unit tests at use-case level replicating current behavior.
   * Snapshot public API responses where helpful (contract tests).
   * Run `{{TEST_CMD_UNIT}}`/`{{TEST_CMD_E2E}}` to capture baseline.

2. **Carve out a pure domain**

   * Move types & core rules into `core/domain/*` (no imports from Next.js, DB, or Keystatic).

3. **Define ports (interfaces)**

   * In `core/interfaces/*`, define repo/content/tx ports with minimal surface. Example:

     ```ts
     // core/interfaces/repositories.ts
     export interface PostRepository {
       findBySlug(slug: string): Promise<Post | null>;
       list(params: { limit: number; tag?: string }): Promise<Post[]>;
       save(input: NewPost, tx?: Tx): Promise<Post>;
     }
     ```

     ```ts
     // core/interfaces/tx.ts
     export interface Tx {
       <T>(fn: (ctx: { postRepo: PostRepository }) => Promise<T>): Promise<T>;
     }
     ```

4. **Extract use cases**

   * Implement each `{{OPERATIONS}}` in `core/use-cases/*`, depending only on `domain` + `interfaces` and returning plain data (no JSX/Response objects).

5. **Implement adapters**

   * **DB** (`adapters/db/*`): implement repositories + a `Tx` provider using `{{DB_LIB}}`.
   * **Keystatic** (`adapters/content/keystatic/*`): implement content port for read/write of content entries.
   * **Auth/Cache** as needed—behind ports.

6. **Wire controllers**

   * In `app/api/*/route.ts` and RSC/Server Actions, translate HTTP/params/session → use-case inputs, call the use case, and return serialized outputs.
   * Components remain dumb/presentational.

7. **Config & env**

   * Centralize env parsing in `config/env.ts` using Zod; ban `process.env.X` usage outside of config/adapters.

8. **Quality gates**

   * Setup strict TS, ESLint, Prettier, tsc check, Vitest (unit/integration), Playwright (e2e).
   * Add pre-commit and CI scripts. Fix all lint/type errors.

9. **Docs**

   * Update README with new module boundaries and how to add a new use-case/adapter.

---

## 4) Acceptance criteria

* Public routes and API responses remain compatible (or diffs documented).
* `core/` has **no** imports from Next.js, Prisma/Drizzle, Keystatic, or node APIs.
* All DB/Keystatic calls happen in `adapters/` only.
* Controllers (app/api/Server Actions) call **use-cases**, not repositories directly.
* Strict TypeScript passes (`tsc --noEmit`), ESLint/Prettier clean, tests green.
* Use-cases covered by unit tests; adapters have contract/integration tests.

---

## 5) Implementation details & guardrails

* Prefer small functions; SRP per file/class/function.
* Use Zod to validate all I/O boundaries (HTTP bodies, env, webhooks).
* Keep use-cases synchronous in shape (async allowed) and **return POJOs**.
* For transactions, pass a `Tx` port to the use-case or inject via context in controllers.
* For RSC/Server Actions, keep side effects only in controller → use-case call.
* No React/JSX in `core/`. No SQL in `app/` or `components/`.
* If Keystatic isn’t available at runtime (e.g., build-time fs), keep port async and let adapter decide.

---

## 6) Example snippets

**Domain**

```ts
// core/domain/post.ts
export type PostId = string;
export type Slug = string;

export interface Post {
  id: PostId;
  slug: Slug;
  title: string;
  body: string;
  publishedAt: Date | null;
  tags: string[];
}

export interface NewPost {
  slug: Slug;
  title: string;
  body: string;
  tags?: string[];
}

export function canPublish(p: Post): boolean {
  return !!p.title && !!p.body && p.body.length > 50;
}
```

**Use-case**

```ts
// core/use-cases/publish-post.ts
import { PostRepository } from "../interfaces/repositories";
import { Tx } from "../interfaces/tx";
import { canPublish } from "../domain/post";

export async function publishPost(
  input: { slug: string },
  deps: { repo: PostRepository; tx: Tx }
) {
  return deps.tx(async ({ postRepo }) => {
    const post = await postRepo.findBySlug(input.slug);
    if (!post) throw new Error("Post not found");
    if (!canPublish(post)) throw new Error("Post not ready for publication");
    const updated = await postRepo.save(
      { ...post, publishedAt: new Date() } as any
    );
    return { slug: updated.slug, publishedAt: updated.publishedAt };
  });
}
```

**DB adapter (Prisma example)**

```ts
// adapters/db/prisma/post.repository.ts
import { prisma } from "./client";
import type { PostRepository } from "../../../core/interfaces/repositories";
import type { Post, NewPost } from "../../../core/domain/post";

export const prismaPostRepository: PostRepository = {
  async findBySlug(slug) {
    const r = await prisma.post.findUnique({ where: { slug } });
    return r && {
      id: r.id, slug: r.slug, title: r.title, body: r.body,
      publishedAt: r.publishedAt, tags: r.tags
    } satisfies Post;
  },
  async list({ limit, tag }) {
    const r = await prisma.post.findMany({
      where: tag ? { tags: { has: tag } } : undefined,
      take: limit
    });
    return r.map(p => ({
      id: p.id, slug: p.slug, title: p.title, body: p.body,
      publishedAt: p.publishedAt, tags: p.tags
    }));
  },
  async save(input: NewPost | Post) {
    const r = await prisma.post.upsert({
      where: { slug: (input as Post).slug ?? (input as NewPost).slug },
      update: { ...input },
      create: { ...input, tags: input.tags ?? [] }
    });
    return {
      id: r.id, slug: r.slug, title: r.title, body: r.body,
      publishedAt: r.publishedAt, tags: r.tags
    };
  }
};
```

**Tx adapter (Prisma)**

```ts
// adapters/db/prisma/transaction.ts
import { prisma } from "./client";
import { prismaPostRepository } from "./post.repository";
import type { Tx } from "../../../core/interfaces/tx";

export const prismaTx: Tx = async (fn) =>
  prisma.$transaction((tx) =>
    fn({
      postRepo: {
        ...prismaPostRepository,
        // override methods to use `tx` if needed
      },
    })
  );
```

**Keystatic adapter (read)**

```ts
// adapters/content/keystatic/post.content.ts
import { createReader } from "@keystatic/core/reader/node";
import config from "../../../keystatic/keystatic.config";
import type { Post } from "../../../core/domain/post";

const reader = createReader(process.cwd(), config);

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const entry = await reader.collections.posts.read(slug);
  if (!entry) return null;
  return {
    id: slug,
    slug,
    title: entry.title,
    body: entry.content,         // map fields as needed
    publishedAt: entry.publishedAt ?? null,
    tags: entry.tags ?? [],
  };
}
```

**HTTP controller (app router)**

```ts
// app/api/posts/publish/route.ts
import { NextResponse } from "next/server";
import { publishPost } from "@/core/use-cases/publish-post";
import { prismaPostRepository } from "@/adapters/db/prisma/post.repository";
import { prismaTx } from "@/adapters/db/prisma/transaction";
import { z } from "zod";

const Body = z.object({ slug: z.string().min(1) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parse = Body.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  try {
    const result = await publishPost(parse.data, {
      repo: prismaPostRepository,
      tx: prismaTx,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
```

---

## 7) Tooling configs (generate/update)

**package.json (scripts)**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --check .",
    "format:fix": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  }
}
```

**tsconfig.json (strict)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "types": ["vitest/globals"]
  },
  "include": ["app", "components", "core", "adapters", "config", "tests", "keystatic"]
}
```

**.eslintrc.cjs**

```js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "unused-imports"],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    "unused-imports/no-unused-imports": "error"
  }
};
```

**config/env.ts**

```ts
import { z } from "zod";

const Env = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"])
});

export const env = Env.parse(process.env);
```

---

## 8) Step-by-step actions Codex should take

1. **Scan & map** current data flow (UI ↔ API ↔ DB ↔ Keystatic).
2. **Propose a file move/creation plan** to the target layout (show a tree diff).
3. **Commit series (small, safe):**

   * `chore: add strict TS, ESLint, Prettier, test tooling`
   * `test: add safety-net tests for {{OPERATIONS}}`
   * `refactor(core): extract domain models & rules`
   * `feat(core): add ports (repositories/content/tx)`
   * `feat(core): add use-cases for {{OPERATIONS}}`
   * `feat(adapters/db): implement {{DB_LIB}} repositories + tx`
   * `feat(adapters/content): implement Keystatic adapter`
   * `refactor(app): route handlers call use-cases`
   * `docs: update README with module boundaries`
4. After each commit: run `lint`, `format`, `typecheck`, and tests.
5. Produce a final summary with any public API diffs and migration notes.

**Output format:** show diffs for created/changed files + a short justification per change. Summarize test results after each step.

---

## 9) Verification checklist

* [ ] No imports from `adapters` or `app` inside `core/`.
* [ ] All DB/Keystatic effects isolated in `adapters/`.
* [ ] API routes & Server Actions delegate to `use-cases`.
* [ ] Zod validates all external inputs/outputs at boundaries.
* [ ] `pnpm build && pnpm typecheck && pnpm lint && pnpm test` are green.
* [ ] Docs updated; adding a new use-case/adapter is documented.

---

## 10) Commands Codex can run (fish-friendly)

```fish
cd {{REPO_PATH}}
{{PKG}} install
{{PKG}} run lint ; and {{PKG}} run format ; and {{PKG}} run typecheck
{{PKG}} run test
{{PKG}} run e2e 2>/dev/null; or true
```

---

### Your turn (Codex):

1. Print the file move/creation plan to reach the target layout.
2. If destructive moves are detected, ask once for confirmation; otherwise proceed.
3. Apply changes in small commits, running quality gates after each.
4. Finish with a concise architecture map and instructions to add a new use-case/adapter.

---

If you share `{{REPO_PATH}}`, `{{DB_LIB}}` (Prisma/Drizzle), and a couple of `{{OPERATIONS}}`, I can pre-fill this for your exact repo.
