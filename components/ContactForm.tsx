'use client'

import {useState} from 'react'
import {useTranslations} from 'next-intl'

export default function ContactForm() {
  const t = useTranslations('contact.form')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    requirements: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that at least WhatsApp is provided
    if (!formData.whatsapp && !formData.email) {
      alert(t('contactRequirement'))
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', whatsapp: '', requirements: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder={t('namePlaceholder')}
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        
        <div>
          <input
            type="email"
            name="email"
            placeholder={t('emailPlaceholder')}
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        
        <div>
          <input
            type="tel"
            name="whatsapp"
            placeholder={t('whatsappPlaceholder')}
            value={formData.whatsapp}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        
        <div>
          <textarea
            name="requirements"
            placeholder={t('requirementsPlaceholder')}
            value={formData.requirements}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors resize-none"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? t('sending') : t('send')}
        </button>
        
        {submitStatus === 'success' && (
          <div className="text-green-400 text-center">
            {t('success')}
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="text-red-400 text-center">
            {t('error')}
          </div>
        )}
      </form>
      
      <p className="text-gray-500 text-sm text-center mt-4">
        {t('contactRequirement')}
      </p>
    </div>
  )
}
