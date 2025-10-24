import type { Post } from '../domain/post';
import type { BlogContentReader } from '../interfaces/content';
import { UseCaseError } from '../lib/errors';

export const getBlogPost = async (
  slug: string,
  deps: { blogContentReader: BlogContentReader },
): Promise<Post> => {
  const resolvedSlug = slug.trim();
  if (!resolvedSlug) {
    throw new UseCaseError('BAD_REQUEST', 'Slug is required');
  }

  const post = await deps.blogContentReader.getPost(resolvedSlug);
  if (!post) {
    throw new UseCaseError('NOT_FOUND', 'Post not found');
  }
  return post;
};
