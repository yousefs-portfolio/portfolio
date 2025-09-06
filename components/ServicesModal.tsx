'use client'

import { useEffect, useState } from 'react'

interface Service {
  id: string
  title: string
  description: string
  featured: boolean
  order: number
}

interface ServicesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ServicesModal({ isOpen, onClose }: ServicesModalProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        const data = await response.json()
        setServices(data.filter((service: Service) => service.featured))
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-content text-center p-8 max-w-3xl">
        <h2 className="text-4xl font-bold mb-4">Services</h2>
        <p className="text-gray-400 mb-8 text-lg">
          I help ambitious companies build foundational, high-performance digital products. 
          My expertise spans from low-level systems engineering to crafting beautiful, 
          interactive user experiences.
        </p>
        
        {loading ? (
          <div className="text-gray-400">Loading services...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-gray-900/50 p-6 rounded-lg border border-white/10"
              >
                <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={() => {
            onClose()  // Close the modal
            // Scroll to contact section
            setTimeout(() => {
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
          }}
          className="mt-10 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-800 transition-all transform hover:scale-105 inline-block" 
          style={{ backgroundColor: '#B9314F' }}
        >
          Hire Me
        </button>
      </div>
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-2xl hover:text-gray-300 transition-colors"
        aria-label="Close modal"
      >
        &times;
      </button>
    </div>
  )
}
