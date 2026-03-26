import { BookmarkSimple } from '@phosphor-icons/react'

type Domain = 'urg' | 'dil' | 'calc' | 'prot' | 'esc' | 'conv'
type Status = 'free' | 'premium' | 'novo'

interface Props {
  abbr: string
  domain: Domain
  name: string
  status?: Status
  bookmarked?: boolean
  onBookmark?: () => void
  onClick?: () => void
  href?: string
  className?: string
}

export default function CardFeature({ abbr, domain, name, status = 'free', bookmarked, onBookmark, onClick, href, className = '' }: Props) {
  const Tag = href ? 'a' : 'div'
  return (
    <Tag className={`card-feature ${className}`} onClick={onClick} href={href}>
      <span className={`tag-abbr ${domain}`}>{abbr}</span>
      <span className="feat-name">{name}</span>
      <span className={`tag-status ${status} mt-1`}>
        {status === 'free' ? 'Gratuito' : status === 'premium' ? 'PREMIUM' : 'NOVO'}
      </span>
      {onBookmark !== undefined && (
        <BookmarkSimple
          size={18}
          weight={bookmarked ? 'fill' : 'regular'}
          className={`feat-bookmark ${bookmarked ? 'saved' : ''}`}
          onClick={e => { e.stopPropagation(); e.preventDefault(); onBookmark?.() }}
        />
      )}
    </Tag>
  )
}
