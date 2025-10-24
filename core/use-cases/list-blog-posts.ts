import type { Post } from '../domain/post';
import { sortPostsByPublishedAtDesc } from '../domain/post';
import type { BlogContentReader } from '../interfaces/content';

export interface ListBlogPostsInput {
  featured?: boolean;
  tag?: string;
  limit?: number;
}

export type BlogPostSummary = Omit<Post, 'content' | 'contentAr' | 'tags'> & {
  tags: string[];
};

export const listBlogPosts = async (
  input: ListBlogPostsInput,
  deps: { blogContentReader: BlogContentReader },
): Promise<BlogPostSummary[]> => {
  const posts = await deps.blogContentReader.listPosts();
  const sorted = sortPostsByPublishedAtDesc(posts);

  let filtered = sorted;
  if (input.featured) {
    filtered = filtered.filter((post) => post.featured);
  }

  if (input.tag) {
    const tag = input.tag.toLowerCase();
    filtered = filtered.filter((post) =>
      post.tags.some((postTag) => postTag.toLowerCase() === tag),
    );
  }

  if (typeof input.limit === 'number' && input.limit > 0) {
    filtered = filtered.slice(0, input.limit);
  }

  return filtered.map(
    ({ content, contentAr, ...rest }): BlogPostSummary => ({
      ...rest,
      tags: [...rest.tags],
    }),
  );
};
