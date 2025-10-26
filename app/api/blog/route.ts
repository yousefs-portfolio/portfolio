import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';

import {keystaticBlogContent} from '@adapters/content/keystatic/blog.content';
import {listBlogPosts} from '@core/use-cases/list-blog-posts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    const QuerySchema = z
      .object({
        featured: z.enum(['true', 'false']).optional(),
        limit: z
          .string()
          .regex(/^\d+$/)
          .transform((value) => Number(value))
          .optional(),
        tag: z.string().min(1).optional(),
      })
      .partial();

    const queryParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = QuerySchema.safeParse(queryParams);

    const filters = parsed.success
      ? {
          featured: parsed.data.featured ? parsed.data.featured === 'true' : undefined,
          limit: parsed.data.limit,
          tag: parsed.data.tag,
        }
      : {};

    const posts = await listBlogPosts(filters, {
      blogContentReader: keystaticBlogContent,
    });

    const payload = posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      titleAr: post.titleAr ?? undefined,
      excerpt: post.excerpt,
      excerptAr: post.excerptAr ?? undefined,
      publishedAt: post.publishedAt.toISOString(),
      featured: post.featured,
      author: post.author,
      tags: post.tags,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 });
  }
}
