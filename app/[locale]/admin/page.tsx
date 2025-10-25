'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {signOut, useSession} from 'next-auth/react'
import {useLocale} from 'next-intl'

type ProjectCategory = 'web' | 'mobile' | 'game'

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

interface Service {
  id: string
  title: string
  description: string
  featured: boolean
  order: number
}

interface Contact {
  id: string
  name: string
  email?: string
  whatsapp?: string
  requirements: string
  createdAt: string
}

export default function AdminPage() {
  const {data: session, status} = useSession()
  const locale = useLocale()
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'contacts'>('projects')
  
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [projectsRes, servicesRes, contactsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/services'),
        fetch('/api/contact')
      ])
      
      setProjects(await projectsRes.json())
      setServices(await servicesRes.json())
      setContacts(await contactsRes.json())
    } catch {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.isAdmin) {
      void fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.isAdmin])

  const deleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' })
        setProjects(prev => prev.filter(p => p.id !== id))
      } catch {
        setError('Failed to delete project')
      }
    }
  }

  const deleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await fetch(`/api/services/${id}`, { method: 'DELETE' })
        setServices(prev => prev.filter(s => s.id !== id))
      } catch {
        setError('Failed to delete service')
      }
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading…</div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold">Admin Access Required</h1>
        <p className="text-gray-400">Please sign in at the admin portal.</p>
          <Link
          href="/admin/login"
          className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          Go to Admin Login
          </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => signOut({callbackUrl: `/${locale}`})}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex space-x-4 mb-8 border-b border-gray-700">
          {(['projects', 'services', 'contacts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize font-semibold ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-red-400 mb-4">{error}</div>}

        {activeTab === 'projects' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <div className="grid gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{project.layer}: {project.layerName}</p>
                      <p className="text-sm text-gray-400 mb-2">Category: {project.category}</p>
                      <p className="text-gray-300 mb-2">{project.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded ${
                          project.featured ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {project.featured ? 'Featured' : 'Not Featured'}
                        </span>
                        <span>Order: {project.order}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Services</h2>
            <div className="grid gap-4">
              {services.map((service) => (
                <div key={service.id} className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-gray-300 mb-2">{service.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded ${
                          service.featured ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {service.featured ? 'Featured' : 'Not Featured'}
                        </span>
                        <span>Order: {service.order}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Submissions</h2>
            <div className="grid gap-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-2">{contact.name}</h3>
                  <div className="text-sm text-gray-400 mb-2">
                    {contact.email && <div>Email: {contact.email}</div>}
                    {contact.whatsapp && <div>WhatsApp: {contact.whatsapp}</div>}
                    <div>Submitted: {new Date(contact.createdAt).toLocaleDateString()}</div>
                  </div>
                  <p className="text-gray-300">{contact.requirements}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
