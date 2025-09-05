'use client'

import { useState, useEffect } from 'react'

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'contacts'>('projects')
  
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
      setError('')
      fetchData()
    } else {
      setError('Invalid password')
    }
  }

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
    } catch (error) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' })
        setProjects(prev => prev.filter(p => p.id !== id))
      } catch (error) {
        setError('Failed to delete project')
      }
    }
  }

  const deleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await fetch(`/api/services/${id}`, { method: 'DELETE' })
        setServices(prev => prev.filter(s => s.id !== id))
      } catch (error) {
        setError('Failed to delete service')
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md w-full p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Login
            </button>
            {error && <p className="text-red-400 text-center">{error}</p>}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
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
