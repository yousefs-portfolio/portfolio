'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Service {
  id: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  icon?: string
  features: string[]
  featuresAr: string[]
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    icon: '',
    features: '',
    featuresAr: '',
    featured: true,
    order: 0
  })

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('adminAuth')
    if (auth !== 'true') {
      window.location.href = '/admin'
      return
    }
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      // Ensure data is an array
      setServices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch services:', error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const serviceData = {
      ...formData,
      features: formData.features.split(',').map(t => t.trim()).filter(Boolean),
      featuresAr: formData.featuresAr.split(',').map(t => t.trim()).filter(Boolean),
      order: parseInt(formData.order as any) || 0
    }
    
    const method = editingService ? 'PUT' : 'POST'
    const url = editingService ? `/api/services/${editingService.id}` : '/api/services'
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      })
      
      if (response.ok) {
        fetchServices()
        setShowForm(false)
        setEditingService(null)
        setFormData({
          title: '',
          titleAr: '',
          description: '',
          descriptionAr: '',
          icon: '',
          features: '',
          featuresAr: '',
          featured: true,
          order: 0
        })
      }
    } catch (error) {
      console.error('Failed to save service:', error)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      titleAr: service.titleAr || '',
      description: service.description || '',
      descriptionAr: service.descriptionAr || '',
      icon: service.icon || '',
      features: Array.isArray(service.features) ? service.features.join(', ') : '',
      featuresAr: Array.isArray(service.featuresAr) ? service.featuresAr.join(', ') : '',
      featured: service.featured,
      order: service.order
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      const response = await fetch(`/api/services/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setServices(services.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Services Management</h1>
            <div className="flex gap-4 text-sm">
              <Link href="/admin" className="text-gray-400 hover:text-white">← Dashboard</Link>
              <Link href="/admin/blog" className="text-gray-400 hover:text-white">Blog</Link>
              <Link href="/admin/projects" className="text-gray-400 hover:text-white">Projects</Link>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingService(null)
              setFormData({
                title: '',
                titleAr: '',
                description: '',
                descriptionAr: '',
                icon: '',
                features: '',
                featuresAr: '',
                featured: true,
                order: services.length
              })
              setShowForm(true)
            }}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
          >
            + New Service
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {editingService ? 'Edit Service' : 'Create New Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* English Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-400">English Content</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Title (English) *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-3 bg-gray-800 rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2">Icon (optional)</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full p-3 bg-gray-800 rounded"
                      placeholder="e.g., FaCode, FaDesktop"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2">Description (English) *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Features (English - comma separated)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded"
                    rows={2}
                    placeholder="Feature 1, Feature 2, Feature 3"
                  />
                </div>
              </div>
              
              {/* Arabic Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-400">Arabic Content</h3>
                
                <div>
                  <label className="block mb-2">Title (Arabic)</label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded text-right"
                    dir="rtl"
                    placeholder="العنوان بالعربية"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Description (Arabic)</label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded text-right"
                    dir="rtl"
                    rows={3}
                    placeholder="الوصف بالعربية"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Features (Arabic - comma separated)</label>
                  <textarea
                    value={formData.featuresAr}
                    onChange={(e) => setFormData({ ...formData, featuresAr: e.target.value })}
                    className="w-full p-3 bg-gray-800 rounded text-right"
                    dir="rtl"
                    rows={2}
                    placeholder="ميزة 1، ميزة 2، ميزة 3"
                  />
                </div>
              </div>
              
              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-400">Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Display Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full p-3 bg-gray-800 rounded"
                      min="0"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      Featured (Show in services modal)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingService(null)
                  }}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="space-y-4">
          {services.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No services yet. Create your first service!</p>
          ) : (
            services.sort((a, b) => a.order - b.order).map((service) => (
              <div key={service.id} className="bg-gray-900 p-6 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold">{service.title}</h3>
                      {service.featured && (
                        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs">Featured</span>
                      )}
                      <span className="text-gray-500 text-sm">Order: {service.order}</span>
                    </div>
                    <p className="text-gray-300">{service.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-400 hover:text-blue-300 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
