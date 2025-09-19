'use client'

import {useEffect, useState} from 'react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useTranslations} from 'next-intl'
import ThreeBackground from '@/components/ThreeBackground'
import Header from '@/components/Header'
import ContentSection from '@/components/ContentSection'
import ServicesModal from '@/components/ServicesModal'
import ContactForm from '@/components/ContactForm'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: string
  title: string
  description: string
  layer: string
  layerName: string
  content: string
  featured: boolean
  order: number
}

export default function Home() {
  const t = useTranslations()
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects', { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data: Project[] = await response.json()
        setProjects(data.filter((project: Project) => project.featured))
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

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

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'LAYER 1': return 'text-blue-400'
      case 'LAYER 2': return 'text-purple-400'
      case 'LAYER 3': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  // Map project IDs to translation keys
  const getProjectTranslation = (projectId: string, field: 'title' | 'description') => {
    const projectMap: Record<string, string> = {
      'seen-project': 'seen',
      'summon-project': 'summon',
      'hearthshire-project': 'hearthshire'
    }

    const projectKey = projectMap[projectId]
    if (projectKey) {
      return t(`projects.${projectKey}.${field}`)
    }
    return null
  }

  const getLayerTranslation = (layer: string, field: 'layer' | 'layerName') => {
    const layerMap: Record<string, string> = {
      'LAYER 1': 'layer1',
      'LAYER 2': 'layer2',
      'LAYER 3': 'layer3'
    }

    const layerKey = layerMap[layer]
    if (layerKey) {
      return field === 'layer' ? t(`projects.${layerKey}`) : t(`projects.${layerKey}Name`)
    }
    return layer
  }

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
        
        {/* Dynamic Project Sections */}
        {loading ? (
          <ContentSection id="loading">
            <div className="text-gray-400">{t('blog.loading')}</div>
          </ContentSection>
        ) : (
          projects.map((project) => (
            <ContentSection key={project.id} id={project.id.replace('-project', '')}>
              <h3 className={`text-sm font-semibold mb-2 tracking-widest ${getLayerColor(project.layer)}`}>
                {getLayerTranslation(project.layer, 'layer')}: {getLayerTranslation(project.layer, 'layerName')}
              </h3>
              <h4 className="text-5xl md:text-7xl font-bold mb-4">
                {getProjectTranslation(project.id, 'title') || project.title}
              </h4>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {getProjectTranslation(project.id, 'description') || project.description}
              </p>
            </ContentSection>
          ))
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
