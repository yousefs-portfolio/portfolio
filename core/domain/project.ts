export type ProjectId = string;

export interface Project {
  id: ProjectId;
  slug: string;
  title: string;
  titleAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  layer: string;
  layerName: string;
  layerNameAr?: string | null;
  category: string;
  featured: boolean;
  order: number;
  content: string;
  contentAr?: string | null;
  technologies: string[];
  technologiesAr?: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
}
