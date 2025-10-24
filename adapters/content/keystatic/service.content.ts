import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

import type { Service } from '@core/domain/service';
import type { ServiceContentReader } from '@core/interfaces/content';

const servicesDir = path.join(process.cwd(), 'keystatic', 'content', 'services');

type ServiceFrontMatter = {
  title?: string | { name?: string };
  titleAr?: string | null;
  featured?: boolean;
  order?: number;
  icon?: string | null;
};

const parseFrontMatter = (raw: string): ServiceFrontMatter => {
  if (!raw.trim()) {
    return {};
  }
  const data = parse(raw);
  return (typeof data === 'object' && data !== null ? data : {}) as ServiceFrontMatter;
};

const normaliseContent = (body: string): string =>
  body.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

const readServiceFile = async (slug: string): Promise<Service | null> => {
  try {
    const filePath = path.join(servicesDir, `${slug}.mdoc`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!match) {
      return null;
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

    const descriptionArPath = path.join(servicesDir, slug, 'descriptionAr.mdoc');
    let descriptionAr: string | undefined;
    try {
      const arContent = await fs.readFile(descriptionArPath, 'utf-8');
      descriptionAr = normaliseContent(arContent);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    return {
      id: slug,
      slug,
      title,
      titleAr: frontMatter.titleAr ?? null,
      description: normaliseContent(contentRaw),
      descriptionAr: descriptionAr ?? null,
      featured: Boolean(frontMatter.featured ?? true),
      order: Number(frontMatter.order ?? 0),
      icon: frontMatter.icon ?? null,
      features: [],
      featuresAr: [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

const getServiceSlugs = async (): Promise<string[]> => {
  const items = await fs.readdir(servicesDir, { withFileTypes: true });
  return items
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdoc'))
    .map((entry) => entry.name.replace(/\.mdoc$/, ''));
};

class KeystaticServiceContent implements ServiceContentReader {
  async listServices(): Promise<Service[]> {
    const slugs = await getServiceSlugs();
    const services = await Promise.all(slugs.map((slug) => readServiceFile(slug)));
    return services.filter((service): service is Service => service !== null);
  }
}

export const keystaticServiceContent = new KeystaticServiceContent();
