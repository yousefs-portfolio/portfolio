export type PostId = string;
export type PostSlug = string;

export interface Post {
  id: PostId;
  slug: PostSlug;
  title: string;
  titleAr?: string | null;
  excerpt: string;
  excerptAr?: string | null;
  publishedAt: Date;
  featured: boolean;
  author: string;
  tags: string[];
  content?: string | null;
  contentAr?: string | null;
}

export const sortPostsByPublishedAtDesc = (posts: Post[]): Post[] =>
  [...posts].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
  );
