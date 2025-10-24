import { NextResponse } from 'next/server';

import { keystaticProjectContent } from '@adapters/content/keystatic/project.content';
import { listProjects } from '@core/use-cases/list-projects';

export const runtime = 'nodejs'

// Keystatic reader is only available server-side
// We import dynamically to avoid issues in edge-like environments
export async function GET() {
  try {
    const projects = await listProjects({
      projectContentReader: keystaticProjectContent,
    });

    const payload = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      layer: project.layer,
      layerName: project.layerName,
      category: project.category,
      content: project.content,
      featured: project.featured,
      order: project.order,
    }));

    return NextResponse.json(payload, { status: 200 })
  } catch (error) {
    console.error('Error reading projects from Keystatic:', error);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 })
  }
}
