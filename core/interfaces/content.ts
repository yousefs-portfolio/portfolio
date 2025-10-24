import type { Post } from '../domain/post';
import type { Project } from '../domain/project';
import type { Service } from '../domain/service';

export interface BlogContentReader {
  listPosts(): Promise<Post[]>;
  getPost(slug: string): Promise<Post | null>;
  listTags(): Promise<string[]>;
}

export interface ProjectContentReader {
  listProjects(): Promise<Project[]>;
}

export interface ServiceContentReader {
  listServices(): Promise<Service[]>;
}
