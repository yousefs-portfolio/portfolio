import { z } from 'zod'

// Custom slug validation
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Blog Post Schema
export const blogPostSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  titleAr: z.string()
    .min(3, 'Arabic title must be at least 3 characters')
    .max(200, 'Arabic title must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(slugRegex, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z.string()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt must not exceed 500 characters'),
  excerptAr: z.string()
    .min(10, 'Arabic excerpt must be at least 10 characters')
    .max(500, 'Arabic excerpt must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  content: z.string()
    .min(10, 'Content must be at least 10 characters'),
  contentAr: z.string()
    .min(10, 'Arabic content must be at least 10 characters')
    .optional()
    .or(z.literal('')),
  tags: z.string().optional().or(z.literal('')),
  tagsAr: z.string().optional().or(z.literal('')),
  published: z.boolean(),
  featured: z.boolean()
})

// Service Schema
export const serviceSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  titleAr: z.string()
    .min(3, 'Arabic title must be at least 3 characters')
    .max(200, 'Arabic title must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  descriptionAr: z.string()
    .min(10, 'Arabic description must be at least 10 characters')
    .max(1000, 'Arabic description must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  icon: z.string().optional().or(z.literal('')),
  features: z.string().optional().or(z.literal('')),
  featuresAr: z.string().optional().or(z.literal('')),
  order: z.number().min(0, 'Order must be a positive number'),
  featured: z.boolean()
})

// Project Schema
export const projectSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  titleAr: z.string()
    .min(3, 'Arabic title must be at least 3 characters')
    .max(200, 'Arabic title must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  descriptionAr: z.string()
    .min(10, 'Arabic description must be at least 10 characters')
    .max(1000, 'Arabic description must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  contentAr: z.string().optional().or(z.literal('')),
  tech: z.string()
    .min(1, 'Technologies are required'),
  techAr: z.string().optional().or(z.literal('')),
  liveUrl: z.string()
    .url('Live URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  githubUrl: z.string()
    .url('GitHub URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  layer: z.string(),
  layerName: z.string().optional().or(z.literal('')),
  layerNameAr: z.string().optional().or(z.literal('')),
  category: z.enum(['web', 'mobile', 'game']),
  order: z.number().min(0, 'Order must be a positive number'),
  featured: z.boolean()
})

// Contact Schema
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  whatsapp: z.string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  requirements: z.string()
    .min(10, 'Requirements must be at least 10 characters')
    .max(2000, 'Requirements must not exceed 2000 characters')
})

// Type exports
export type BlogPostFormData = z.infer<typeof blogPostSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type ContactFormData = z.infer<typeof contactSchema>
