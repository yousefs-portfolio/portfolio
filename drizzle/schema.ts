import {createId} from '@paralleldrive/cuid2';
import {sql} from 'drizzle-orm';
import {
    integer,
    sqliteTable,
    text,
    uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
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
    featured: integer('featured', {mode: 'boolean'}).notNull().default(false),
    order: integer('order').notNull().default(0),
    createdAt: text('createdAt')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const blogPosts = sqliteTable(
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
        published: integer('published', {mode: 'boolean'}).notNull().default(false),
        featured: integer('featured', {mode: 'boolean'}).notNull().default(false),
        slug: text('slug').notNull(),
        createdAt: text('createdAt')
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
        updatedAt: text('updatedAt')
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
        slugIdx: uniqueIndex('blog_posts_slug_idx').on(table.slug),
    }),
);

export const services = sqliteTable('services', {
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
    featured: integer('featured', {mode: 'boolean'}).notNull().default(false),
    order: integer('order').notNull().default(0),
    createdAt: text('createdAt')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const contacts = sqliteTable('contacts', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text('name').notNull(),
    email: text('email'),
    whatsapp: text('whatsapp'),
    requirements: text('requirements').notNull(),
    createdAt: text('createdAt')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const users = sqliteTable(
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
        mustChangePassword: integer('mustChangePassword', {mode: 'boolean'})
            .notNull()
            .default(true),
        isAdmin: integer('isAdmin', {mode: 'boolean'}).notNull().default(false),
    },
    (table) => ({
        usernameIdx: uniqueIndex('users_username_idx').on(table.username),
        emailIdx: uniqueIndex('users_email_idx').on(table.email),
    }),
);
