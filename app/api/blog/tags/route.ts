import { NextResponse } from 'next/server';

import { keystaticBlogContent } from '@adapters/content/keystatic/blog.content';
import { listBlogTags } from '@core/use-cases/list-blog-tags';

export const runtime = 'nodejs'

// GET all unique tags from blog posts
export async function GET() {
  try {
    const tags = await listBlogTags({
      blogContentReader: keystaticBlogContent,
    });

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('Error reading tags from Keystatic:', error);
    return NextResponse.json({ error: 'Failed to load tags' }, { status: 500 });
  }
}
