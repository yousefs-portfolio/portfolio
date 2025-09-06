'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  content?: string
  contentAr?: string
  tech: string[]
  techAr: string[]
  liveUrl?: string
  githubUrl?: string
  layer: string
  layerName?: string
  layerNameAr?: string
  order: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function ProjectsAdmin() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    content: '',
    contentAr: '',
    tech: '',
    techAr: '',
    liveUrl: '',
    githubUrl: '',
    layer: 'frontend',
    layerName: '',
    layerNameAr: '',
    order: 0,
    featured: false
  })

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchProjects()
    } else {
      router.push('/admin')
    }
  }, [router])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        // Ensure data is an array
        setProjects(Array.isArray(data) ? data : [])
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const projectData = {
      ...formData,
      tech: formData.tech.split(',').map(t => t.trim()).filter(Boolean),
      techAr: formData.techAr.split(',').map(t => t.trim()).filter(Boolean),
      order: parseInt(formData.order as any) || 0
    }

    try {
      const url = editingProject 
        ? `/api/projects/${editingProject.id}`
        : '/api/projects'
      
      const method = editingProject ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })

      if (res.ok) {
        fetchProjects()
        setShowForm(false)
        setEditingProject(null)
        setFormData({
          title: '',
          titleAr: '',
          description: '',
          descriptionAr: '',
          content: '',
          contentAr: '',
          tech: '',
          techAr: '',
          liveUrl: '',
          githubUrl: '',
          layer: 'frontend',
          layerName: '',
          layerNameAr: '',
          order: 0,
          featured: false
        })
      }
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      titleAr: project.titleAr || '',
      description: project.description,
      descriptionAr: project.descriptionAr || '',
      content: project.content || '',
      contentAr: project.contentAr || '',
      tech: Array.isArray(project.tech) ? project.tech.join(', ') : '',
      techAr: Array.isArray(project.techAr) ? project.techAr.join(', ') : '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      layer: project.layer,
      layerName: project.layerName || '',
      layerNameAr: project.layerNameAr || '',
      order: project.order,
      featured: project.featured
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
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

  const handleCancel = () => {
    setShowForm(false)
    setEditingProject(null)
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      content: '',
      contentAr: '',
      tech: '',
      techAr: '',
      liveUrl: '',
      githubUrl: '',
      layer: 'frontend',
      layerName: '',
      layerNameAr: '',
      order: 0,
      featured: false
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Projects Management</h1>
            <p className="text-gray-400 mt-1">Manage your portfolio projects</p>
          </div>
          <div className="flex gap-4">
            <a href="/admin" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
              ← Back to Dashboard
            </a>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              + Add Project
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* English Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-400">English Content</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title (English) *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2 bg-gray-800 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Layer *</label>
                    <select
                      value={formData.layer}
                      onChange={(e) => setFormData({ ...formData, layer: e.target.value })}
                      className="w-full p-2 bg-gray-800 rounded"
                      required
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="fullstack">Full Stack</option>
                      <option value="mobile">Mobile</option>
                      <option value="devops">DevOps</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (English) *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 bg-gray-800 rounded"
                    rows={2}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Content (English - optional)</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-2 bg-gray-800 rounded"
                    rows={4}
                    placeholder="Detailed project description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Technologies (English - comma separated) *</label>
                  <input
                    type="text"
                    value={formData.tech}
                    onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                    className="w-full p-2 bg-gray-800 rounded"
                    placeholder="React, TypeScript, Node.js"
                    required
                  />
                </div>
              </div>
              
              {/* Arabic Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-400">Arabic Content</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title (Arabic)</label>
                    <input
                      type="text"
                      value={formData.titleAr}
                      onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                      className="w-full p-2 bg-gray-800 rounded text-right"
                      dir="rtl"
                      placeholder="العنوان بالعربية"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Layer Name (Arabic)</label>
                    <input
                      type="text"
                      value={formData.layerNameAr}
                      onChange={(e) => setFormData({ ...formData, layerNameAr: e.target.value })}
                      className="w-full p-2 bg-gray-800 rounded text-right"
                      dir="rtl"
                      placeholder="الواجهة الأمامية"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (Arabic)</label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full p-2 bg-gray-800 rounded text-right"
                    dir="rtl"
                    rows={2}
                    placeholder="الوصف بالعربية"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Content (Arabic - optional)</label>
                  <textarea
                    value={formData.contentAr}
                    onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                    className="w-full p-2 bg-gray-800 rounded text-right"
                    dir="rtl"
                    rows={4}
                    placeholder="وصف تفصيلي للمشروع..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Technologies (Arabic - comma separated)</label>
                  <input
                    type="text"
                    value={formData.techAr}
                    onChange={(e) => setFormData({ ...formData, techAr: e.target.value })}
                    className="w-full p-2 bg-gray-800 rounded text-right"
                    dir="rtl"
                    placeholder="رياكت، تايب سكريبت، نود جي إس"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Live URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full p-2 bg-gray-800 rounded"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full p-2 bg-gray-800 rounded"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-gray-800 rounded"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="mr-2"
                    />
                    <span>Featured Project</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
                >
                  {editingProject ? 'Update Project' : 'Add Project'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No projects yet. Add your first project!</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="bg-gray-900 p-6 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        {project.featured && (
                          <span className="bg-yellow-600 text-black px-2 py-1 rounded text-xs">Featured</span>
                        )}
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">{project.layer}</span>
                      </div>
                      <p className="text-gray-400 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tech.map((tech, index) => (
                          <span key={index} className="bg-gray-800 px-2 py-1 rounded text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-500">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            Live Demo →
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            GitHub →
                          </a>
                        )}
                        <span>Order: {project.order}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-blue-400 hover:text-blue-300 px-3 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
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
        )}
      </div>
    </div>
  )
}
