'use client'

import {useEffect, useMemo, useState} from 'react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useTranslations} from 'next-intl'
import ThreeBackground from '@/components/ThreeBackground'
import Header from '@/components/Header'
import ContentSection from '@/components/ContentSection'
import ServicesModal from '@/components/ServicesModal'
import ContactForm from '@/components/ContactForm'

gsap.registerPlugin(ScrollTrigger)

type ProjectCategory = 'web' | 'mobile' | 'game'

const CATEGORY_ORDER: readonly ProjectCategory[] = ['web', 'mobile', 'game']

interface Project {
  id: string
  title: string
  description: string
  layer: string
  layerName: string
  content: string
  featured: boolean
  order: number
  category: ProjectCategory
}

export default function Home() {
  const t = useTranslations()
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<'all' | ProjectCategory>('all')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects', { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data: Project[] = await response.json()
          const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          const featured = sorted.filter((project) => project.featured)
          setProjects(featured.length > 0 ? featured : sorted)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const availableCategories = useMemo(() => {
    const set = new Set<ProjectCategory>()
    projects.forEach((project) => {
      if (CATEGORY_ORDER.includes(project.category)) {
        set.add(project.category)
      }
    })
    return CATEGORY_ORDER.filter((category) => set.has(category))
  }, [projects])

  useEffect(() => {
    if (activeCategory !== 'all' && !availableCategories.includes(activeCategory)) {
      setActiveCategory('all')
    }
  }, [availableCategories, activeCategory])

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') {
      return projects
    }
    return projects.filter((project) => project.category === activeCategory)
  }, [projects, activeCategory])

  // Set up GSAP animations after projects load
  useEffect(() => {
    if (!loading && projects.length > 0) {
      // Animate hero and contact sections
      ['#hero', '#contact'].forEach((selector) => {
        const box = document.querySelector(selector + ' .content-box')
        if (box) {
          gsap.to(box, {
            opacity: 1,
            scrollTrigger: {
              trigger: selector,
              start: 'top center',
              end: 'bottom center',
              toggleActions: 'play reverse play reverse'
            }
          })
        }
      })
      
      // Animate project sections
      projects.forEach((project) => {
        const selector = '#' + project.id.replace('-project', '')
        const box = document.querySelector(selector + ' .content-box')
        if (box) {
          gsap.to(box, {
            opacity: 1,
            scrollTrigger: {
              trigger: selector,
              start: 'top center',
              end: 'bottom center',
              toggleActions: 'play reverse play reverse'
            }
          })
        }
      })
    }
  }, [loading, projects])

  return (
    <>
      <ThreeBackground />
      <Header onServicesClick={() => setServicesModalOpen(true)} />
      
      <main>
        {/* Hero Section */}
        <ContentSection id="hero">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">{t('hero.title1')}</h1>
          <h2
            className="text-5xl md:text-8xl font-black tracking-tighter section-title-gradient mb-8">{t('hero.title2')}</h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400">
            {t('hero.subtitle')}
          </p>
        </ContentSection>
        
        {/* Project Filters */}
        {!loading && projects.length > 0 && availableCategories.length > 0 && (
          <ContentSection id="project-filters" className="pt-0">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors border ${
                  activeCategory === 'all'
                    ? 'bg-white text-black border-white'
                    : 'border-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                {t('projects.filters.all')}
              </button>
              {availableCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors border ${
                    activeCategory === category
                      ? 'bg-white text-black border-white'
                      : 'border-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  {t(`projects.filters.${category}`)}
                </button>
              ))}
            </div>
          </ContentSection>
        )}

        {/* Dynamic Project Sections */}
        {loading ? (
          <ContentSection id="loading">
            <div className="text-gray-400">{t('blog.loading')}</div>
          </ContentSection>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
              <ContentSection
                  key={project.id}
                  id={project.id.replace('-project', '')}
                  className="project-section"
              >
              <h4 className="text-5xl md:text-7xl font-bold mb-4">
                {project.title}
              </h4>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {project.description}
              </p>
            </ContentSection>
          ))
        ) : (
          <ContentSection id="no-projects">
            <div className="text-gray-400">{t('projects.noProjects')}</div>
          </ContentSection>
        )}
        
        {/* Contact Section */}
        <ContentSection id="contact">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">{t('contact.title')}</h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
            {t('contact.subtitle')}
          </p>

          {/* Contact Form */}
          <ContactForm />
        </ContentSection>
      </main>
      
      <ServicesModal 
        isOpen={servicesModalOpen} 
        onClose={() => setServicesModalOpen(false)} 
      />
    </>
  )
}
