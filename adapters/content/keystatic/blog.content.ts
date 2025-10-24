import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

import type { Post } from '@core/domain/post';
import type { BlogContentReader } from '@core/interfaces/content';
import { settings } from '@config/settings';

const postsDir = path.join(process.cwd(), 'keystatic', 'content', 'posts');

type FrontMatter = {
  title?: string | { name?: string };
  titleAr?: string | null;
  excerpt?: string;
  excerptAr?: string | null;
  publishedAt?: string;
  featured?: boolean;
  author?: string;
  tags?: string[];
  contentAr?: string;
};

const parseFrontMatter = (raw: string): FrontMatter => {
  if (!raw.trim()) {
    return {};
  }
  const data = parse(raw);
  return (typeof data === 'object' && data !== null ? data : {}) as FrontMatter;
};

const toDate = (value: string | undefined): Date => {
  if (!value) {
    return new Date();
  }
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return new Date();
  }
  return date;
};

const normaliseContent = (body: string): string =>
  body.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

const readPostFile = async (slug: string): Promise<Post | null> => {
  try {
    const filePath = path.join(postsDir, `${slug}.mdoc`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!match) {
      return {
        id: slug,
        slug,
        title: slug,
        excerpt: '',
        publishedAt: new Date(),
        featured: false,
        author: settings.blog.defaultAuthor,
        tags: [],
        content: normaliseContent(normalized),
      };
    }

    const [, frontMatterRaw, contentRaw] = match;
    const frontMatter = parseFrontMatter(frontMatterRaw);

    const rawTitle = frontMatter.title;
    const title =
      typeof rawTitle === 'string'
        ? rawTitle
        : typeof rawTitle === 'object' && rawTitle?.name
          ? rawTitle.name
          : slug;

    const basePost: Post = {
      id: slug,
      slug,
      title,
      titleAr: frontMatter.titleAr ?? null,
      excerpt: frontMatter.excerpt ?? '',
      excerptAr: frontMatter.excerptAr ?? null,
      publishedAt: toDate(frontMatter.publishedAt),
      featured: Boolean(frontMatter.featured),
      author: frontMatter.author ?? settings.blog.defaultAuthor,
      tags: Array.isArray(frontMatter.tags)
        ? frontMatter.tags.map((tag) => String(tag))
        : [],
      content: normaliseContent(contentRaw),
    };

    const contentArFromFrontMatter =
      typeof frontMatter.contentAr === 'string'
        ? frontMatter.contentAr.trim()
        : null;

    const nestedContentPath = path.join(postsDir, slug, 'contentAr.mdoc');
    try {
      const nested = await fs.readFile(nestedContentPath, 'utf-8');
      return {
        ...basePost,
        contentAr: normaliseContent(nested),
      };
    } catch (nestedError) {
      if ((nestedError as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw nestedError;
      }
      return {
        ...basePost,
        contentAr: contentArFromFrontMatter,
      };
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

const getAllPostSlugs = async (): Promise<string[]> => {
  const items = await fs.readdir(postsDir, { withFileTypes: true });
  return items
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdoc'))
    .map((entry) => entry.name.replace(/\.mdoc$/, ''));
};

class KeystaticBlogContent implements BlogContentReader {
  async listPosts(): Promise<Post[]> {
    const slugs = await getAllPostSlugs();
    const posts = await Promise.all(slugs.map((slug) => readPostFile(slug)));
    return posts.filter((post): post is Post => post !== null);
  }

  async getPost(slug: string): Promise<Post | null> {
    return readPostFile(slug);
  }

  async listTags(): Promise<string[]> {
    const posts = await this.listPosts();
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (tag) {
          tags.add(tag);
        }
      });
    });
    return Array.from(tags);
  }
}

export const keystaticBlogContent = new KeystaticBlogContent();
