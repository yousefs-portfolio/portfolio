import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: process.env.NODE_ENV === 'production' ? 'github' : 'local',
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'keystatic/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ 
          name: { 
            label: 'Title',
            validation: { isRequired: true }
          } 
        }),
        titleAr: fields.text({ 
          label: 'Title (Arabic)',
          validation: { isRequired: false }
        }),
        excerpt: fields.text({ 
          label: 'Excerpt',
          multiline: true,
          validation: { isRequired: true }
        }),
        excerptAr: fields.text({ 
          label: 'Excerpt (Arabic)',
          multiline: true,
          validation: { isRequired: false }
        }),
        publishedAt: fields.date({ 
          label: 'Published Date',
          validation: { isRequired: true },
          defaultValue: { kind: 'today' }
        }),
        featured: fields.checkbox({
          label: 'Featured Post',
          defaultValue: false,
        }),
        author: fields.text({ 
          label: 'Author',
          defaultValue: 'Yousef Baitalmal'
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value
          }
        ),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts/',
            },
          },
        }),
        contentAr: fields.markdoc({
          label: 'Content (Arabic)',
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts/',
            },
          },
        }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'keystatic/content/projects/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({ 
          name: { 
            label: 'Title',
            validation: { isRequired: true }
          } 
        }),
        titleAr: fields.text({ 
          label: 'Title (Arabic)',
          validation: { isRequired: false }
        }),
        layer: fields.select({
          label: 'Layer',
          options: [
            { label: 'Layer 1', value: 'LAYER 1' },
            { label: 'Layer 2', value: 'LAYER 2' },
            { label: 'Layer 3', value: 'LAYER 3' },
          ],
          defaultValue: 'LAYER 1',
        }),
        layerName: fields.text({ 
          label: 'Layer Name',
          validation: { isRequired: true }
        }),
        layerNameAr: fields.text({ 
          label: 'Layer Name (Arabic)',
          validation: { isRequired: false }
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Web', value: 'web' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Game Development', value: 'game' },
          ],
          defaultValue: 'web',
        }),
        featured: fields.checkbox({
          label: 'Featured Project',
          defaultValue: true,
        }),
        order: fields.integer({
          label: 'Display Order',
          defaultValue: 0,
        }),
        description: fields.markdoc({
          label: 'Description',
        }),
        descriptionAr: fields.markdoc({
          label: 'Description (Arabic)',
        }),
        technologies: fields.array(
          fields.text({ label: 'Technology' }),
          {
            label: 'Technologies Used',
            itemLabel: props => props.value
          }
        ),
        githubUrl: fields.url({
          label: 'GitHub URL',
          validation: { isRequired: false }
        }),
        liveUrl: fields.url({
          label: 'Live Demo URL',
          validation: { isRequired: false }
        }),
        image: fields.image({
          label: 'Project Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
      },
    }),
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'keystatic/content/services/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({ 
          name: { 
            label: 'Title',
            validation: { isRequired: true }
          } 
        }),
        titleAr: fields.text({ 
          label: 'Title (Arabic)',
          validation: { isRequired: false }
        }),
        featured: fields.checkbox({
          label: 'Featured Service',
          defaultValue: true,
        }),
        order: fields.integer({
          label: 'Display Order',
          defaultValue: 0,
        }),
        description: fields.markdoc({
          label: 'Description',
        }),
        descriptionAr: fields.markdoc({
          label: 'Description (Arabic)',
        }),
        icon: fields.text({
          label: 'Icon Name (optional)',
          validation: { isRequired: false }
        }),
      },
    }),
  },
  singletons: {
    homepage: singleton({
      label: 'Homepage',
      path: 'keystatic/content/homepage',
      schema: {
        heroTitle1: fields.text({ 
          label: 'Hero Title Line 1',
          defaultValue: 'Engineering'
        }),
        heroTitle1Ar: fields.text({ 
          label: 'Hero Title Line 1 (Arabic)',
          defaultValue: 'الهندسة'
        }),
        heroTitle2: fields.text({ 
          label: 'Hero Title Line 2',
          defaultValue: 'from First Principles.'
        }),
        heroTitle2Ar: fields.text({ 
          label: 'Hero Title Line 2 (Arabic)',
          defaultValue: 'من المبادئ الأولى.'
        }),
        heroSubtitle: fields.text({ 
          label: 'Hero Subtitle',
          multiline: true,
          defaultValue: 'Scroll to begin a journey through my stack — from the foundational logic of a systems language to the vibrant pixels of a game engine.'
        }),
        heroSubtitleAr: fields.text({ 
          label: 'Hero Subtitle (Arabic)',
          multiline: true,
          defaultValue: 'انتقل للأسفل لبدء رحلة عبر مكدسي التقني — من المنطق الأساسي للغة الأنظمة إلى البكسلات النابضة بالحياة لمحرك الألعاب.'
        }),
        contactTitle: fields.text({ 
          label: 'Contact Section Title',
          defaultValue: "Let's Build."
        }),
        contactTitleAr: fields.text({ 
          label: 'Contact Section Title (Arabic)',
          defaultValue: 'دعنا نبني.'
        }),
        contactSubtitle: fields.text({ 
          label: 'Contact Section Subtitle',
          multiline: true,
          defaultValue: "If you're working on revolutionary products, I'd love to talk."
        }),
        contactSubtitleAr: fields.text({ 
          label: 'Contact Section Subtitle (Arabic)',
          multiline: true,
          defaultValue: 'إذا كنت تعمل على منتجات ثورية، أود أن أتحدث معك.'
        }),
        email: fields.text({ 
          label: 'Contact Email',
          defaultValue: 'yousef.baitalmal.dev@email.com'
        }),
      },
    }),
    settings: singleton({
      label: 'Site Settings',
      path: 'keystatic/content/settings',
      schema: {
        siteName: fields.text({ 
          label: 'Site Name',
          defaultValue: 'Yousef Baitalmal - Portfolio'
        }),
        siteNameAr: fields.text({ 
          label: 'Site Name (Arabic)',
          defaultValue: 'يوسف بيت المال - المعرض'
        }),
        siteDescription: fields.text({ 
          label: 'Site Description',
          multiline: true,
          defaultValue: 'Engineering from First Principles - A portfolio showcasing systems engineering, creative coding, and full-stack development.'
        }),
        siteDescriptionAr: fields.text({ 
          label: 'Site Description (Arabic)',
          multiline: true,
          defaultValue: 'الهندسة من المبادئ الأولى - معرض يعرض هندسة الأنظمة والبرمجة الإبداعية والتطوير الكامل.'
        }),
        defaultLocale: fields.select({
          label: 'Default Language',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Arabic', value: 'ar' },
          ],
          defaultValue: 'en',
        }),
        socialLinks: fields.object({
          github: fields.url({ label: 'GitHub URL' }),
          linkedin: fields.url({ label: 'LinkedIn URL' }),
          twitter: fields.url({ label: 'Twitter URL' }),
        }),
      },
    }),
  },
});
