import type { BlogContentReader } from '../interfaces/content';

export const listBlogTags = async (
  deps: { blogContentReader: BlogContentReader },
): Promise<string[]> => {
  const tags = await deps.blogContentReader.listTags();
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );
};
