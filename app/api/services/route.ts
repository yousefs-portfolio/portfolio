import { NextResponse } from 'next/server';

import { keystaticServiceContent } from '@adapters/content/keystatic/service.content';
import { listServices } from '@core/use-cases/list-services';

export const runtime = 'nodejs'

export async function GET() {
  try {
    const services = await listServices({
      serviceContentReader: keystaticServiceContent,
    });

    const payload = services.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      featured: service.featured,
      order: service.order,
    }));

    return NextResponse.json(payload, { status: 200 })
  } catch (error: any) {
    console.error('Error reading services from Keystatic:', error);
    return NextResponse.json({ error: 'Failed to load services' }, { status: 500 })
  }
}
