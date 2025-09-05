import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed projects (matching the example.html sections)
  await prisma.project.upsert({
    where: { id: 'seen-project' },
    update: {},
    create: {
      id: 'seen-project',
      title: 'Seen (س)',
      description: 'A revolutionary systems language built on evidence-based syntax. Here, abstract logic and compiler theory take form.',
      layer: 'LAYER 1',
      layerName: 'THE LANGUAGE',
      content: 'A revolutionary systems language built on evidence-based syntax. Here, abstract logic and compiler theory take form.',
      featured: true,
      order: 1,
    },
  })

  await prisma.project.upsert({
    where: { id: 'summon-project' },
    update: {},
    create: {
      id: 'summon-project',
      title: 'Summon',
      description: 'The language provides structure. With Summon, that structure becomes tangible UI components—the building blocks of modern applications.',
      layer: 'LAYER 2',
      layerName: 'THE FRAMEWORK',
      content: 'The language provides structure. With Summon, that structure becomes tangible UI components—the building blocks of modern applications.',
      featured: true,
      order: 2,
    },
  })

  await prisma.project.upsert({
    where: { id: 'hearthshire-project' },
    update: {},
    create: {
      id: 'hearthshire-project',
      title: 'Hearthshire',
      description: 'The final layer, where systems and components breathe life into a world. A custom Rust engine powers a universe of 10 billion voxels, rendered with a neural, painterly touch.',
      layer: 'LAYER 3',
      layerName: 'THE EXPERIENCE',
      content: 'The final layer, where systems and components breathe life into a world. A custom Rust engine powers a universe of 10 billion voxels, rendered with a neural, painterly touch.',
      featured: true,
      order: 3,
    },
  })

  // Seed services (matching the services modal content)
  await prisma.service.upsert({
    where: { id: 'systems-engine-dev' },
    update: {},
    create: {
      id: 'systems-engine-dev',
      title: 'Systems & Engine Dev',
      description: 'Custom language design, compiler development, and high-performance game engine architecture in Rust or C++.',
      featured: true,
      order: 1,
    },
  })

  await prisma.service.upsert({
    where: { id: 'framework-design' },
    update: {},
    create: {
      id: 'framework-design',
      title: 'Framework Design',
      description: 'Creating bespoke UI frameworks and design systems for cross-platform applications.',
      featured: true,
      order: 2,
    },
  })

  await prisma.service.upsert({
    where: { id: 'interactive-experiences' },
    update: {},
    create: {
      id: 'interactive-experiences',
      title: 'Interactive Experiences',
      description: 'Developing unique WebGL, 3D, and creative web experiences that push technical and artistic boundaries.',
      featured: true,
      order: 3,
    },
  })

  // Seed admin user
  await prisma.user.upsert({
    where: { email: 'yousef.baitalmal.dev@email.com' },
    update: {},
    create: {
      email: 'yousef.baitalmal.dev@email.com',
      name: 'Yousef Baitalmal',
      isAdmin: true,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
