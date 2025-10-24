import { describe, expect, it } from 'vitest';

import type { Post } from '@core/domain/post';
import { listBlogPosts } from '@core/use-cases/list-blog-posts';

const makePost = (overrides: Partial<Post>): Post => ({
  id: 'post-1',
  slug: 'post-1',
  title: 'Post 1',
  excerpt: 'Excerpt',
  publishedAt: new Date('2024-01-01T00:00:00Z'),
  featured: false,
  author: 'Author',
  tags: [],
  content: 'content',
  contentAr: null,
  titleAr: null,
  excerptAr: null,
  ...overrides,
});

describe('listBlogPosts use-case', () => {
  it('filters by featured flag and tag, enforces limit', async () => {
    const posts: Post[] = [
      makePost({ id: '1', slug: 'first', tags: ['tech'], featured: true, publishedAt: new Date('2024-02-01') }),
      makePost({ id: '2', slug: 'second', tags: ['life'], featured: false, publishedAt: new Date('2024-03-01') }),
      makePost({ id: '3', slug: 'third', tags: ['tech'], featured: true, publishedAt: new Date('2024-01-15') }),
    ];

    const result = await listBlogPosts(
      {
        featured: true,
        tag: 'tech',
        limit: 1,
      },
      {
        blogContentReader: {
          listPosts: async () => posts,
          getPost: async () => null,
          listTags: async () => [],
        },
      },
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe('first');
  });
});
