'use client'

import { useState, useEffect } from 'react'

interface Project {
  id: string
  title: string
  description: string
  layer: string
  layerName: string
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
  email: string
  message: string
  createdAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'contacts'>('projects')
  
  // Data states
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)

  // Check if already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check (in production, this should be handled server-side)
    if (password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      fetchData()
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch all data
      const [projectsRes, servicesRes, contactsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/services'),
        fetch('/api/contacts')
      ])
      
      const projectsData = await projectsRes.json()
      const servicesData = await servicesRes.json()
      const contactsData = await contactsRes.json()
      
      setProjects(projectsData)
      setServices(servicesData)
      setContacts(contactsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setServices(services.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return
    
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setContacts(contacts.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete contact:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded mb-4 text-white"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your portfolio content and settings</p>
          </div>
          <div className="flex gap-4">
            <a href="/keystatic" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex items-center gap-2">
              <span>📝</span> Keystatic CMS
            </a>
            <a href="/" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <a href="/keystatic" className="bg-purple-900 p-6 rounded-lg hover:bg-purple-800 transition-colors border border-purple-700">
            <h3 className="text-lg font-semibold mb-2">Keystatic CMS</h3>
            <p className="text-3xl font-bold">📝</p>
            <p className="text-sm text-purple-300 mt-1">Visual content editor →</p>
          </a>
          <a href="/admin/blog" className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
            <h3 className="text-lg font-semibold mb-2">Blog Posts</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-400 mt-1">Manage blog content →</p>
          </a>
          <a href="/admin/services" className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
            <h3 className="text-lg font-semibold mb-2">Services</h3>
            <p className="text-3xl font-bold">{services.length}</p>
            <p className="text-sm text-gray-400 mt-1">Manage services →</p>
          </a>
          <a href="/admin/projects" className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
            <h3 className="text-lg font-semibold mb-2">Projects</h3>
            <p className="text-3xl font-bold">{projects.length}</p>
            <p className="text-sm text-gray-400 mt-1">Manage projects →</p>
          </a>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Contacts</h3>
            <p className="text-3xl font-bold">{contacts.length}</p>
            <p className="text-sm text-gray-400 mt-1">View submissions</p>
          </div>
        </div>

        {/* CMS Info Section */}
        <div className="bg-purple-900/20 border border-purple-700 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">Content Management Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">📝 Keystatic CMS</h3>
              <p className="text-gray-400 mb-3">
                A visual, Git-based CMS that provides a user-friendly interface for managing your content. 
                Perfect for blog posts, documentation, and structured content.
              </p>
              <ul className="text-sm text-gray-400 space-y-1 mb-3">
                <li>• Visual markdown editor</li>
                <li>• Image management</li>
                <li>• Git-based version control</li>
                <li>• No database required</li>
              </ul>
              <a href="/keystatic" className="text-purple-400 hover:text-purple-300">Open Keystatic CMS →</a>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">⚡ Quick Admin Pages</h3>
              <p className="text-gray-400 mb-3">
                Built-in admin pages for quick content management with database storage. 
                Best for dynamic content that needs frequent updates.
              </p>
              <ul className="text-sm text-gray-400 space-y-1 mb-3">
                <li>• Direct database management</li>
                <li>• Bilingual content support</li>
                <li>• Real-time updates</li>
                <li>• Form validation</li>
              </ul>
              <p className="text-gray-500 text-sm">Access via the cards above</p>
            </div>
          </div>
        </div>

        {/* Recent Contacts */}
        <h2 className="text-2xl font-semibold mb-4">Recent Contact Submissions</h2>

        {/* Contact Submissions */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No contact submissions yet.</p>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="bg-gray-900 p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{contact.name}</h3>
                      <p className="text-blue-400">{contact.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-300 mb-2">{contact.message}</p>
                  <p className="text-sm text-gray-500">
                    Received: {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
