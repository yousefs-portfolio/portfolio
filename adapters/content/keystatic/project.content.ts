import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

import type { Project } from '@core/domain/project';
import type { ProjectContentReader } from '@core/interfaces/content';

const projectsDir = path.join(process.cwd(), 'keystatic', 'content', 'projects');

type ProjectFrontMatter = {
  title?: string | { name?: string };
  titleAr?: string | null;
  layer?: string;
  layerName?: string;
  layerNameAr?: string | null;
  category?: string;
  featured?: boolean;
  order?: number;
  technologies?: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
};

const parseFrontMatter = (raw: string): ProjectFrontMatter => {
  if (!raw.trim()) {
    return {};
  }
  const data = parse(raw);
  return (typeof data === 'object' && data !== null ? data : {}) as ProjectFrontMatter;
};

const normaliseContent = (body: string): string =>
  body.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

const readProjectFile = async (slug: string): Promise<Project | null> => {
  try {
    const filePath = path.join(projectsDir, `${slug}.mdoc`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!match) {
      return null;
    }

      const frontMatterRaw = match[1] ?? '';
      const contentRaw = match[2] ?? '';
    const frontMatter = parseFrontMatter(frontMatterRaw);
    const rawTitle = frontMatter.title;
    const title =
      typeof rawTitle === 'string'
        ? rawTitle
        : typeof rawTitle === 'object' && rawTitle?.name
          ? rawTitle.name
          : slug;

    const descriptionArPath = path.join(projectsDir, slug, 'descriptionAr.mdoc');
    let contentAr: string | undefined;
    try {
      const arContent = await fs.readFile(descriptionArPath, 'utf-8');
      contentAr = normaliseContent(arContent);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    return {
      id: `${slug}-project`,
      slug,
      title,
      titleAr: frontMatter.titleAr ?? null,
      description: normaliseContent(contentRaw),
      descriptionAr: contentAr ?? null,
      layer: frontMatter.layer ?? 'LAYER 1',
      layerName: frontMatter.layerName ?? '',
      layerNameAr: frontMatter.layerNameAr ?? null,
      category: frontMatter.category ?? 'web',
      featured: Boolean(frontMatter.featured ?? true),
      order: Number(frontMatter.order ?? 0),
      content: normaliseContent(contentRaw),
      contentAr: contentAr ?? null,
      technologies: Array.isArray(frontMatter.technologies)
        ? frontMatter.technologies.map((item) => String(item))
        : [],
      technologiesAr: [],
      githubUrl: frontMatter.githubUrl ?? null,
      liveUrl: frontMatter.liveUrl ?? null,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

const getProjectSlugs = async (): Promise<string[]> => {
  const items = await fs.readdir(projectsDir, { withFileTypes: true });
  return items
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdoc'))
    .map((entry) => entry.name.replace(/\.mdoc$/, ''));
};

class KeystaticProjectContent implements ProjectContentReader {
  async listProjects(): Promise<Project[]> {
    const slugs = await getProjectSlugs();
    const projects = await Promise.all(slugs.map((slug) => readProjectFile(slug)));
    return projects.filter((project): project is Project => project !== null);
  }
}

export const keystaticProjectContent = new KeystaticProjectContent();
