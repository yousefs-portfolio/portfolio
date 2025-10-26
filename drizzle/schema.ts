import {createId} from '@paralleldrive/cuid2';
import {sql} from 'drizzle-orm';
import {boolean, integer, pgTable, text, timestamp, uniqueIndex,} from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => createId()),
    title: text('title').notNull(),
    titleAr: text('titleAr'),
    description: text('description').notNull(),
    descriptionAr: text('descriptionAr'),
    layer: text('layer').notNull(),
    layerName: text('layerName').notNull(),
    layerNameAr: text('layerNameAr'),
    category: text('category').notNull().default('web'),
    content: text('content').notNull(),
    contentAr: text('contentAr'),
    tech: text('tech').notNull().default(''),
    techAr: text('techAr').notNull().default(''),
    liveUrl: text('liveUrl'),
    githubUrl: text('githubUrl'),
    featured: boolean('featured').notNull().default(false),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('createdAt', {withTimezone: true})
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt', {withTimezone: true})
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const blogPosts = pgTable(
    'blog_posts',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => createId()),
        title: text('title').notNull(),
        titleAr: text('titleAr'),
        content: text('content').notNull(),
        contentAr: text('contentAr'),
        excerpt: text('excerpt').notNull(),
        excerptAr: text('excerptAr'),
        tags: text('tags').notNull().default(''),
        tagsAr: text('tagsAr').notNull().default(''),
        published: boolean('published').notNull().default(false),
        featured: boolean('featured').notNull().default(false),
        slug: text('slug').notNull(),
        createdAt: timestamp('createdAt', {withTimezone: true})
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
        updatedAt: timestamp('updatedAt', {withTimezone: true})
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
        slugIdx: uniqueIndex('blog_posts_slug_idx').on(table.slug),
    }),
);

export const services = pgTable('services', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => createId()),
    title: text('title').notNull(),
    titleAr: text('titleAr'),
    description: text('description').notNull(),
    descriptionAr: text('descriptionAr'),
    icon: text('icon'),
    features: text('features').notNull().default(''),
    featuresAr: text('featuresAr').notNull().default(''),
    featured: boolean('featured').notNull().default(false),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('createdAt', {withTimezone: true})
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt', {withTimezone: true})
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const contacts = pgTable('contacts', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text('name').notNull(),
    email: text('email'),
    whatsapp: text('whatsapp'),
    requirements: text('requirements').notNull(),
    createdAt: timestamp('createdAt', {withTimezone: true})
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const users = pgTable(
    'users',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => createId()),
        username: text('username').notNull(),
        email: text('email'),
        name: text('name'),
        passwordHash: text('passwordHash').notNull(),
        passwordSalt: text('passwordSalt').notNull(),
        mustChangePassword: boolean('mustChangePassword').notNull().default(true),
        isAdmin: boolean('isAdmin').notNull().default(false),
    },
    (table) => ({
        usernameIdx: uniqueIndex('users_username_idx').on(table.username),
        emailIdx: uniqueIndex('users_email_idx').on(table.email),
    }),
);
