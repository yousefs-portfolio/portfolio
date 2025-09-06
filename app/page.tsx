'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
  const { t } = useLanguage()
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

  return (
    <>
      <ThreeBackground />
      <Header onServicesClick={() => setServicesModalOpen(true)} />
      
      <main>
        {/* Hero Section */}
        <ContentSection id="hero">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">{t('hero.title1')}</h1>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter section-title-gradient mb-8">{t('hero.title2')}</h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400">
            {t('hero.subtitle')}
          </p>
        </ContentSection>
        
        {/* Dynamic Project Sections */}
        {loading ? (
          <ContentSection id="loading">
            <div className="text-gray-400">{t('projects.loading')}</div>
          </ContentSection>
        ) : (
          projects.map((project) => (
            <ContentSection key={project.id} id={project.id.replace('-project', '')}>
              <h3 className={`text-sm font-semibold mb-2 tracking-widest ${getLayerColor(project.layer)}`}>
                {project.layer}: {project.layerName}
              </h3>
              <h4 className="text-5xl md:text-7xl font-bold mb-4">{project.title}</h4>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">{project.description}</p>
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
