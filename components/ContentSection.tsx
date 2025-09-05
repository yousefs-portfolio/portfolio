interface ContentSectionProps {
  id: string
  className?: string
  children: React.ReactNode
}

export default function ContentSection({ id, className = '', children }: ContentSectionProps) {
  return (
    <section id={id} className={`content-section ${className}`}>
      <div className="content-box">
        {children}
      </div>
    </section>
  )
}
