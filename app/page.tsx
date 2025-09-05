'use client'

import { useState, useEffect } from 'react'
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
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const data = await response.json()
        setProjects(data.filter((project: Project) => project.featured))
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
    
    // Add GSAP animations for content sections
    const sections = ['#hero', '#seen', '#summon', '#hearthshire', '#contact']
    sections.forEach((selector) => {
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
  }, [])

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
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">Engineering</h1>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter section-title-gradient mb-8">from First Principles.</h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400">
            Scroll to begin a journey through my stack — from the foundational logic of a systems language to the vibrant pixels of a game engine.
          </p>
        </ContentSection>
        
        {/* Dynamic Project Sections */}
        {loading ? (
          <ContentSection id="loading">
            <div className="text-gray-400">Loading projects...</div>
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
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">Let's Build.</h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
            If you're working on revolutionary products, I'd love to talk.
          </p>
          <a 
            href="mailto:yousef.baitalmal.dev@email.com" 
            className="btn-primary text-white px-10 py-5 rounded-lg font-semibold text-xl transition-all transform hover:scale-105 inline-block mb-8"
          >
            yousef.baitalmal.dev@email.com
          </a>
          
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
