import {randomBytes, scryptSync} from 'node:crypto';

import {eq} from 'drizzle-orm';

import {db, sqlite} from '../../drizzle/db';
import {projects, services, users} from '../../drizzle/schema';

const hashPassword = (password: string, salt?: string) => {
    const resolvedSalt = salt ?? randomBytes(16).toString('hex');
    const saltBuffer = Buffer.from(resolvedSalt, 'hex');
    const derived = scryptSync(password, saltBuffer, 64).toString('hex');
    return {hash: derived, salt: resolvedSalt};
};

async function seed() {
    await db
        .insert(projects)
        .values({
            id: 'seen-project',
            title: 'Seen (س)',
            description:
                'A revolutionary systems language built on evidence-based syntax. Here, abstract logic and compiler theory take form.',
            layer: 'LAYER 1',
            layerName: 'THE LANGUAGE',
            category: 'web',
            content:
                'A revolutionary systems language built on evidence-based syntax. Here, abstract logic and compiler theory take form.',
            featured: true,
            order: 1,
        })
        .onConflictDoNothing();

    await db
        .insert(projects)
        .values({
            id: 'summon-project',
            title: 'Summon',
            description:
                'The language provides structure. With Summon, that structure becomes tangible UI components—the building blocks of modern applications.',
            layer: 'LAYER 2',
            layerName: 'THE FRAMEWORK',
            category: 'mobile',
            content:
                'The language provides structure. With Summon, that structure becomes tangible UI components—the building blocks of modern applications.',
            featured: true,
            order: 2,
        })
        .onConflictDoNothing();

    await db
        .insert(projects)
        .values({
            id: 'hearthshire-project',
            title: 'Hearthshire',
            description:
                'The final layer, where systems and components breathe life into a world. A custom Rust engine powers a universe of 10 billion voxels, rendered with a neural, painterly touch.',
            layer: 'LAYER 3',
            layerName: 'THE EXPERIENCE',
            category: 'game',
            content:
                'The final layer, where systems and components breathe life into a world. A custom Rust engine powers a universe of 10 billion voxels, rendered with a neural, painterly touch.',
            featured: true,
            order: 3,
        })
        .onConflictDoNothing();

    await db
        .insert(services)
        .values({
            id: 'systems-engine-dev',
            title: 'Systems & Engine Dev',
            description:
                'Custom language design, compiler development, and high-performance game engine architecture in Rust or C++.',
            featured: true,
            order: 1,
        })
        .onConflictDoNothing();

    await db
        .insert(services)
        .values({
            id: 'framework-design',
            title: 'Framework Design',
            description:
                'Creating bespoke UI frameworks and design systems for cross-platform applications.',
            featured: true,
            order: 2,
        })
        .onConflictDoNothing();

    await db
        .insert(services)
        .values({
            id: 'interactive-experiences',
            title: 'Interactive Experiences',
            description:
                'Developing unique WebGL, 3D, and creative web experiences that push technical and artistic boundaries.',
            featured: true,
            order: 3,
        })
        .onConflictDoNothing();

    const defaultUsername = 'admin';
    const defaultPassword = 'admin';
    const {hash, salt} = hashPassword(defaultPassword);

    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.username, defaultUsername))
        .limit(1);

    const existing = existingUser.at(0);

    if (!existing) {
        await db.insert(users).values({
            username: defaultUsername,
            email: 'yousef.baitalmal.dev@email.com',
            name: 'Yousef Baitalmal',
            isAdmin: true,
            passwordHash: hash,
            passwordSalt: salt,
            mustChangePassword: true,
        });
    } else {
        await db
            .update(users)
            .set({
                passwordHash: hash,
                passwordSalt: salt,
                mustChangePassword: true,
            })
            .where(eq(users.id, existing.id));
    }

    console.log('Database seeded successfully!');
}

seed()
    .catch((error) => {
        console.error('Failed to seed database', error);
        process.exitCode = 1;
    })
    .finally(() => {
        sqlite.close();
    });
