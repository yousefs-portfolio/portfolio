import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { keystaticBlogContent } from '@adapters/content/keystatic/blog.content';
import { getBlogPost } from '@core/use-cases/get-blog-post';
import { UseCaseError } from '@core/lib/errors';

export const runtime = 'nodejs';

const ParamsSchema = z.object({
  slug: z.string().min(1),
});

export async function GET(
  _request: NextRequest,
  context: { params: { slug: string } },
) {
  try {
    const parsed = ParamsSchema.safeParse(context.params);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const post = await getBlogPost(parsed.data.slug, {
      blogContentReader: keystaticBlogContent,
    });

    return NextResponse.json(
      {
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
        content: post.content ?? '',
        contentAr: post.contentAr ?? undefined,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof UseCaseError && error.code === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    console.error('Error in blog post API:', error);
    return NextResponse.json({ error: 'Failed to load blog post' }, { status: 500 });
  }
}
