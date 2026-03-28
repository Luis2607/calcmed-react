interface Props {
  tag: string
  title: string
  description: string
  onClick?: () => void
  href?: string
  className?: string
}

export default function BannerEditorial({ tag, title, description, onClick, href, className }: Props) {
  const cls = `banner-editorial${className ? ` ${className}` : ''}`
  const content = (
    <>
      <div className="banner-body">
        <div className="banner-tag">{tag}</div>
        <div className="banner-title">{title}</div>
        <div className="banner-desc">{description}</div>
      </div>
      <div className="banner-chevron" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 4.5L13 10L7.5 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </>
  )

  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <div className={cls} onClick={onClick} onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {content}
    </div>
  )
}
